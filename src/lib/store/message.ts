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

export const StreamStore = types
  .model({
    messages: types.array(types.frozen()),
    netContent: types.optional(types.string, ''), // Хранилище сообщений
    state: types.enumeration('State', [
      'idle',
      'pending',
      'completed',
      'error',
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
        self.state = 'pending';
        streamCallback('status', 'pending');

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

          if (!response.ok) throw new Error('Error fetching stream');
          if (!response.body) throw new Error('❌ Нет потока данных!');

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
          // streamCallback('status', 'completed');
        } catch (error) {
          if (signal.aborted) {
          } else {
            self.state = 'error';
          }
          // streamCallback('status', 'error');
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
    status: types.optional(types.string, 'initial'), // streaming, ready, failed
    parentId: types.maybeNull(types.string), // ID родителя
    children: types.optional(
      types.array(types.late((): any => MessageStore)),
      [],
    ), // Дети (late для рекурсии)
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
      return self.status === 'ready'
        ? createMessageParser().parse(self.id, self.content)?.output
        : self.content;
    },
  }))
  .actions((self) => {
    const updateMessage = (message: any) => {
      self.status = message.status || self.status;
    };

    const streamCallback = (type: string, value: any, status?: string) => {
      if (type === 'content') {
        self.content = value ?? '';
        // updateState
      } else if (type === 'state') {
        self.root?.currentBox?.updateState(self.id, value, status);
      }
    };

    const generateStreaming = flow(function* generateSse(
      streamCallback: (type: string, value: any, status?: string) => void,
    ) {
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

    return { generateStreaming, findMessageById, updateMessage, streamCallback };
  });

export type IMessageStore = Instance<typeof MessageStore>;
export type IMessageStoreSnapshotIn = SnapshotIn<typeof MessageStore>;
export type IMessageStoreSnapshotOut = SnapshotOut<typeof MessageStore>;
