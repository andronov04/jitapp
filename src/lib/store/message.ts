import {flow, getParent, getRoot, Instance, SnapshotIn, SnapshotOut, types} from "mobx-state-tree";
import {StateStore} from "@/lib/store/state";
import {WorkbenchStore} from "@/lib/store/workbench";
import {createMessageParser, messageParser} from "@/hooks/useMessageParser";
import {parseArtifacts} from "@/lib/llm/utils/parser";


export const StreamStore = types
  .model({
    messages: types.array(types.frozen()),
    netContent: types.optional(types.string, ""), // Хранилище сообщений
    state: types.enumeration("State", ["idle", "pending", "completed", "error"]),
  })
  .actions((self) => {
    let abortController: AbortController | null = null;

    return {
      generateStreaming: flow(function* generateSse(boxId: string, messageId: string, streamCallback: (type: string, value?: any) => void) {
        console.log("📡 Запуск стрима...", boxId, messageId);
        self.state = "pending";
        streamCallback('status', 'pending');

        abortController = new AbortController(); // Создаём AbortController
        const signal = abortController.signal; // Получаем AbortSignal

        try {
          const response = yield fetch(`/api/v1/chat/${boxId}/stream?messageId=${messageId || ""}`, {
            method: "GET",
            signal, // Передаём сигнал отмены
          });

          if (!response.body) throw new Error("❌ Нет потока данных!");

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let textBuffer = "";

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
            // console.log("📩 chunk:", chunk);
            textBuffer += chunk;
            const newParsedContent = mParser.parse(messageId, textBuffer);
            mParser.content += newParsedContent;
            self.netContent = mParser.content;
            streamCallback('content', self.netContent);

            streamCallback('state', parseArtifacts(textBuffer));

            console.log("📩 Получено:", chunk);

            // Обновляем store с новым сообщением
            self.messages.push(chunk);
          }

          self.state = "completed";
          streamCallback('status', 'completed');
          console.log("✅ Поток завершён!");
        } catch (error) {
          if (signal.aborted) {
            console.warn("⚠️ Поток был отменён!");
          } else {
            console.error("❌ Ошибка потока:", error);
            self.state = "error";
          }
          streamCallback('status', 'error');
        }
      }),

      abortStreaming() {
        if (abortController) {
          abortController.abort();
          console.log("⛔ Поток принудительно остановлен!");
          self.state = "idle";
        }
      },
    };
  });


export const MessageStore = types
  .model("MessageStore", {
    id: types.identifier,
    role: types.string,
    content: types.string,
    isProcessing: types.optional(types.boolean, false),
    status: types.optional(types.string, "initial"), // streaming, ready, failed
    parentId: types.maybeNull(types.string), // ID родителя
    children: types.optional(types.array(types.late((): any => MessageStore)), []), // Дети (late для рекурсии)
  })
  .views((self) => ({
    get hasChildren() {
      return self.children.length > 0;
    },
    get parent() {
      return getParent(getParent(self)) as any;
    },
    get app() {
      return getRoot(self) as any;
    },
  }))
  .actions((self) => {
    // addChild(message: Instance<typeof MessageStore>) {
    //   self.children.push(message);
    // },
    // removeChild(messageId: string) {
    //   self.children.replace(self.children.filter((msg) => msg.id !== messageId));
    // },
    const updateMessage = (message: any) => {
      self.status = message.status || self.status;
    };

    const streamCallback = (type: string, value?: string) => {
      if (type === 'content') {
        self.content = value ?? "";
        console.log("streamCallback-content", type, '--', value);
        // updateState
      } else if (type === 'status') {
        self.status = value ?? "";
        console.log("streamCallback-status", value);
      } else if (type === 'state') {
        console.log("streamCallback-state", value);
        self.app?.currentBox?.updateState(self.id, value)
      }
    };

    const generateStreaming = flow(function* generateSse(streamCallback: (type: string, value?: any) => void) {
      if (self.isProcessing) return;
      self.isProcessing = true;
      const stream = StreamStore.create({
        messages: [],
        state: 'idle',
      });
      yield stream.generateStreaming((getRoot(self) as any)?.currentBox?.id, self.id, streamCallback);
      // // TODO delete stream
    });
    return { generateStreaming, updateMessage, streamCallback };

  });

export type IMessageStore = Instance<typeof MessageStore>;
export type IMessageStoreSnapshotIn = SnapshotIn<typeof MessageStore>;
export type IMessageStoreSnapshotOut = SnapshotOut<typeof MessageStore>;
