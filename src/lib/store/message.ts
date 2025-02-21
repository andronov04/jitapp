import {
  flow,
  getParent,
  getRoot,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
} from 'mobx-state-tree';
import { StateStore } from '@/lib/store/state';
import { WorkbenchStore } from '@/lib/store/workbench';
import { messageParser } from '@/hooks/useMessageParser';
import { parseArtifacts } from '@/lib/llm/utils/parser';
import { createMessageParser } from '@/lib/runtime/create-parser';
import { IUserStore, UserStore } from '@/lib/store/user';
import { IModelStore } from '@/lib/store/model';
import { IGeneratorStore } from '@/lib/store/generator';
import { createFetchError } from '@/lib/utils';

export const StreamStore = types
  .model({
    messages: types.array(types.frozen()),
    netContent: types.optional(types.string, ''), // Хранилище сообщений
    state: types.enumeration('State', [
      'idle',
      'streaming',
      'completed',
      'failed',
    ]),
  })
  .actions((self) => {
    let abortController: AbortController | null = null;

    return {
      generateStreaming: flow(function* generateSse(
        boxId: string,
        messageId: string,
        streamCallback: (type: string, value: any, status?: string) => void,
      ) {
        self.state = 'streaming';
        streamCallback('status', null, 'streaming');

        abortController = new AbortController(); // Создаём AbortController
        const signal = abortController.signal; // Получаем AbortSignal

        try {
          const response = yield fetch(
            `/api/v1/chat/${boxId}/stream?messageId=${messageId || ''}`,
            {
              method: 'GET',
              signal, // Передаём сигнал отмены
            },
          );

          if (!response.ok || !response.body) {
            const error = yield createFetchError(response);
            streamCallback('status', error, 'failed');
            return;
          }
          // if (!response.body) throw new Error('❌ Нет потока данных!');

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let textBuffer = '';

          while (true) {
            const { done, value } = yield reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            // parser
            let mParser = messageParser[messageId];
            if (!mParser) {
              messageParser[messageId] = createMessageParser();
              mParser = messageParser[messageId];
            }
            textBuffer += chunk;
            const result = mParser.parse(messageId, textBuffer);
            const newParsedContent = result.output ?? '';
            mParser.content += newParsedContent;
            self.netContent = mParser.content;
            streamCallback('content', self.netContent, self.state);

            streamCallback('state', result.state, self.state);

            // Обновляем store с новым сообщением
            self.messages.push(chunk);
          }

          self.state = 'completed';
          streamCallback('state', parseArtifacts(textBuffer), self.state);
          streamCallback('status', null, 'completed');
        } catch (error) {
          if (signal.aborted) {
          } else {
            self.state = 'failed';
          }
          streamCallback('status', null, 'failed');
        }
      }),

      abortStreaming() {
        if (abortController) {
          abortController.abort();
          console.log('⛔ Поток принудительно остановлен!');
          self.state = 'idle';
        }
      },
    };
  });

export const MessageStore = types
  .model('MessageStore', {
    id: types.identifier,
    role: types.string,
    content: types.string,
    generatorId: types.maybeNull(types.string),
    modelId: types.maybeNull(types.string),
    userId: types.maybeNull(types.string),
    // userId: types.safeReference(UserStore),
    // user: types.safeReference(UserStore),
    isProcessing: types.optional(types.boolean, false),
    status: types.optional(types.string, 'initial'), // streaming, completed, failed, created, cancelled
    parentMessageId: types.maybeNull(types.string), // ID родителя
    children: types.optional(
      types.array(types.late((): any => MessageStore)),
      [],
    ),
    failed: types.maybeNull(
      types.model({
        message: types.optional(types.string, ''),
        code: types.union(types.string, types.number),
      }),
    ),
  })
  .views((self) => ({
    get hasChildren() {
      return self.children.length > 0;
    },
    get parent() {
      return getParent(getParent(self)) as any;
    },
    get root() {
      return getRoot(self) as any;
    },
    get model(): IModelStore | null {
      return (
        (getRoot(self) as any)?.models.find(
          (a: any) => a.id === self.modelId,
        ) ?? null
      );
    },
    get generator(): IGeneratorStore | null {
      return (
        (getRoot(self) as any)?.generators.find(
          (a: any) => a.id === self.modelId,
        ) ?? null
      );
    },
    get user(): IUserStore | null {
      const root = getRoot<any>(self);
      return root.users.find((a: any) => a.id === self.userId) ?? null;
    },
    get fullContent() {
      // TODO fix it, once use, before create
      return (self.status === 'ready' || self.status === 'completed') &&
        self.role === 'assistant'
        ? createMessageParser().parse(self.id, self.content)?.output
        : self.content;
    },
  }))
  .actions((self) => {
    const updateMessage = (message: any) => {
      self.status = message.status || self.status;
    };

    const handleChangeStatus = (prevStatus: string) => {
      if (self.status !== prevStatus && self.parentMessageId) {
        try {
          self.root?.currentBox?.recalculateMsgStatus();
        } catch (e) {
          console.error('recalculateMsgStatus', e);
        }
      }
    };

    const streamCallback = (type: string, value: any, status?: string) => {
      if (type === 'content') {
        self.content = value ?? '';
        // updateState
      } else if (type === 'state') {
        self.root?.currentBox?.updateState(self.id, value, status);
      } else if (type === 'status' && status === 'failed') {
        self.failed = value.info;
      }
      // console.log('streamCallback', type, value, status);
      let prevStatus = self.status;
      self.status = status ?? self.status;
      handleChangeStatus(prevStatus);
    };

    const generateStreaming = flow(function* generateSse(
      streamCallback: (type: string, value: any, status?: string) => void,
    ) {
      self.failed = null;
      if (self.isProcessing) return;
      self.isProcessing = true;
      const stream = StreamStore.create({
        messages: [],
        state: 'idle',
      });
      yield stream.generateStreaming(
        (getRoot(self) as any)?.currentBox?.getId,
        self.id,
        streamCallback,
      );
      // // TODO delete stream
    });
    const findMessageById = (targetId: string) => {
      if (self.id === targetId) {
        return self;
      }
      for (const child of self.children) {
        const found = child.findMessageById(targetId);
        if (found) return found;
      }
      return null;
    };

    return {
      generateStreaming,
      findMessageById,
      updateMessage,
      streamCallback,
    };
  });

export type IMessageStore = Instance<typeof MessageStore>;
export type IMessageStoreSnapshotIn = SnapshotIn<typeof MessageStore>;
export type IMessageStoreSnapshotOut = SnapshotOut<typeof MessageStore>;
