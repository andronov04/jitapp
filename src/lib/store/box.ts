import {
  applySnapshot,
  flow,
  getParent,
  getRoot,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
} from 'mobx-state-tree';
import { values } from 'mobx';
import { IWorkbenchStore, WorkbenchStore } from '@/lib/store/workbench';
import { IMessageStore, MessageStore } from '@/lib/store/message';
import { fetcher, generateUuid } from '@/lib/utils';
import { ToolStore } from '@/lib/store/tool';

let boxStore: IBoxStore | undefined;

export const BoxStore = types
  .model({
    id: types.identifier,
    originalId: types.optional(types.string, ''),
    slug: types.optional(types.string, ''),
    description: types.optional(types.string, ''),
    empty: types.optional(types.boolean, true),
    isProcessing: types.optional(types.boolean, false), // for
    name: types.optional(types.string, ''),
    workbenches: types.array(WorkbenchStore),
    messages: types.array(MessageStore),
    isFirst: types.optional(types.boolean, true),
    numLikes: types.optional(types.number, 0),
    numViews: types.optional(types.number, 0),
    // isReady
  })
  .views((self) => ({
    get getId() {
      return self.originalId || self.id;
    },
    // get statuses() {
    //   return self.messages.map(m => m.status).map(s => ({status: s, count: self.messages.filter(m => m.status === s).length})).sort((a, b) => b.count - a.count);
    // },
  }))
  .actions((self) => {
    // const setLoadingCommits = (val: boolean) => {
    //   self.isLoadingCommits = val;
    // };

    const addWorkbench = (workbench: IWorkbenchStore) => {
      self.workbenches.push(workbench);
    };

    const addMessage = (message: Partial<IMessageStore>) => {
      self.messages.push(message as IMessageStore);
    };

    const setProcessing = (val: boolean) => {
      self.isProcessing = val;
    };

    const createChat = flow(function* createChat(input: string) {
      self.isProcessing = true;
      const messages = self.messages
        .filter((m) => m.status === 'initial')
        .map((m) => {
          return {
            id: m.id,
            role: m.role,
            modelId: m.modelId,
            generatorId: m.generatorId,
            children: m.children?.map((c) => {
              return {
                id: c.id,
                modelId: c.modelId,
                generatorId: c.generatorId,
                role: c.role,
              };
            }),
          };
        });

      const { data, error } = yield fetcher(`/api/v1/chat/create`, {
        input,
        boxId: self.getId,
        messages,
      });
      if (error) {
        console.error('createChat', error);
        return;
      }
      self.isFirst = false;
      const { box, messages: newMessages } = data;
      window.history.replaceState({}, '', `/i/${box.slug}`);
      self.name = box.name;
      self.description = box.description;
      self.empty = false;
      for (const message of newMessages) {
        const msg = self.messages.find((m) => m.id === message.id);
        if (msg) {
          msg.updateMessage({
            status: message.status,
          });
        }
        for (const child of message.children ?? []) {
          const childMsg = self.messages
            .map((a) => (a.children ?? []).flat())
            .flat()
            .find((m) => m.id === child.id);
          if (childMsg) {
            childMsg.updateMessage({
              status: child.status,
            });
          }
        }
      }
      self.isProcessing = false;
      //if (message.status === 'created' && message.role === 'assistant') {
      const tasks = self.messages
        .filter((msg) => msg.role === 'group')
        .map((msg) =>
          msg.children
            .filter((msg) => msg.status === 'ready' && msg.role === 'assistant')
            .map((m) => m.generateStreaming(m.streamCallback))
            .flat(),
        )
        .flat();

      // Теперь дожидаемся выполнения всех вызовов в параллель
      Promise.all(tasks);

      // const files: any = {};
      // values(self.content.files).forEach((item: any) => {
      //   files[item.key] = item.value;
      // });
      // try {
      //   const { body, status } = yield apiClient.repo.commitUpdateFiles.mutation({
      //     params: { repoId: self.id, commitId: self.activeCommit?.id ?? 1 },
      //     body: { files },
      //     query: { editable: true },
      //   });
      // } catch (err) {
      //   console.error("Failed to update content ", err);
      // }
      //
      // self.contentIndex = nanoid();

      // setTimeout(() => {
      //   generateStreaming(generateUuid()).then(console.log).catch(console.error);
      // }, 2000);
    });

    // const findMessageById = (targetId: string) => {
    //   for (const message of self.messages) {
    //     const found = message.findMessageById(targetId);
    //     if (found) return found;
    //   }
    //   return null;
    // };

    const updateState = (messageId: string, state: any, status?: string) => {
      const workbench = self.workbenches.find((wb) => wb.id === messageId);
      if (!workbench) {
        const workbench = WorkbenchStore.create({
          id: messageId, // mix dmeste modelid_plus+pageid
          status: 'created',
          messageId: messageId,
          tools: [
            ToolStore.create({
              id: 'preview',
              name: 'Preview',
            }),
            ToolStore.create({
              id: 'code',
              name: 'Code',
            }),
          ],
        });
        workbench.updateState(state, status);
        self.workbenches.push(workbench);
      } else {
        workbench.updateState(state, status);
      }
    };

    const startStream = () => {
      // TODO it's test
      const tasks = self.messages
        .filter((msg) => msg.role === 'group')
        .map((msg) =>
          msg.children
            .filter(
              (msg) => msg.status === 'created' && msg.role === 'assistant',
            )
            .map((m) => m.generateStreaming(m.streamCallback))
            .flat(),
        )
        .flat();
      //

      // Теперь дожидаемся выполнения всех вызовов в параллель
      Promise.all(tasks);
    };

    return {
      addWorkbench,
      startStream,
      addMessage,
      setProcessing,
      createChat,
      updateState,
    };
  });

export type IBoxStore = Instance<typeof BoxStore>;
export type IBoxStoreSnapshotIn = SnapshotIn<typeof BoxStore>;
export type IBoxStoreSnapshotOut = SnapshotOut<typeof BoxStore>;

export function initializeBoxStore(snapshot: IBoxStoreSnapshotIn) {
  try {
    const _store =
      boxStore ?? BoxStore.create(snapshot ?? (boxStore as any)?.getSnapshot());

    // If your page has Next.js data fetching methods that use a Mobx store, it will
    // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
    if (snapshot) {
      applySnapshot(_store, snapshot);
    }
    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store;
    // Create the store once in the client
    if (!boxStore) boxStore = _store;

    return boxStore;
  } catch (e) {
    console.error(e);
    return {};
  }
}
