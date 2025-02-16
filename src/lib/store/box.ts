import { applySnapshot, flow, getParent, getRoot, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree";
import { values } from "mobx";
import {IWorkbenchStore, WorkbenchStore} from "@/lib/store/workbench";
import {IMessageStore, MessageStore} from "@/lib/store/message";
import {fetcher, generateUuid} from "@/lib/utils";
import {ToolStore} from "@/lib/store/tool";

let boxStore: IBoxStore | undefined;

export const BoxStore = types
  .model({
    id: types.identifier,
    isProcessing: types.optional(types.boolean, false), // for
    name: types.optional(types.string, ""),
    workbenches: types.array(WorkbenchStore),
    messages: types.array(MessageStore),
    isFirst: types.optional(types.boolean, true),
  })
  .views((self) => ({
    // get getWorkbenches() {
    //   return Array.from(self.workbenches.values());//.sort((a, b) => b.created.getTime() - a.created.getTime());
    // },
  }))
  .actions((self) => {
    // const setLoadingCommits = (val: boolean) => {
    //   self.isLoadingCommits = val;
    // };

    const setId = () => {
      self.id = generateUuid();
    };

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
      const messages = self.messages.map(m => {
        return {
          id: m.id,
          role: m.role,
          children: m.children?.map(c => {
            return {
              id: c.id,
              role: c.role,
            };
          }),
        };
      });
      console.log("createChat", messages);

      const { data, error } = yield fetcher(`/api/v1/chat/create`, {
        input,
        boxId: self.id,
        messages,
      });
      if (error) {
        console.error("createChat", error);
        return;
      }
      self.isFirst = false;
      const { box, messages: newMessages } = data;
      for (const message of newMessages) {
        const msg = self.messages.find((m) => m.id === message.id);
        if (msg) {
          msg.updateMessage({
            status: message.status,
          });
        }
        if (message.children) {
          for (const child of message.children) {
            const childMsg = self.messages.find((m) => m.id === child.id);
            if (childMsg) {
              childMsg.updateMessage({
                status: child.status,
              });
            }
          }
        }
      }
      console.log("createChat", data, error);
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
      self.isProcessing = false;

      // setTimeout(() => {
      //   generateStreaming(generateUuid()).then(console.log).catch(console.error);
      // }, 2000);
    });


    const updateState = (messageId: string, state: any) => {
      const workbench = self.workbenches.find((wb) => wb.id === messageId);
      if (!workbench) {
        const workbench = WorkbenchStore.create({
          id: messageId, // mix dmeste modelid_plus+pageid
          status: "created",
          tools: [
            ToolStore.create({
              id: "code",
              name: "Code",
            }),
          ]
        });
        workbench.updateState(state);
        self.workbenches.push(workbench);
      } else {
        workbench.updateState(state);
      }
    }

    return { addWorkbench, addMessage, setProcessing, setId, createChat, updateState };
  });

export type IBoxStore = Instance<typeof BoxStore>;
export type IBoxStoreSnapshotIn = SnapshotIn<typeof BoxStore>;
export type IBoxStoreSnapshotOut = SnapshotOut<typeof BoxStore>;

export function initializeBoxStore(snapshot: IBoxStoreSnapshotIn) {
  try {
    const _store = boxStore ?? BoxStore.create(snapshot ?? (boxStore as any)?.getSnapshot());

    // If your page has Next.js data fetching methods that use a Mobx store, it will
    // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
    if (snapshot) {
      applySnapshot(_store, snapshot);
    }
    // For SSG and SSR always create a new store
    if (typeof window === "undefined") return _store;
    // Create the store once in the client
    if (!boxStore) boxStore = _store;

    return boxStore;
  } catch (e) {
    console.error(e);
    return {};
  }
}
