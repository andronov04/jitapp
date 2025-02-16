import {Instance, SnapshotIn, SnapshotOut, types} from "mobx-state-tree";
import {StateStore} from "@/lib/store/state";
import {ToolStore} from "@/lib/store/tool";
import {MessageStore} from "@/lib/store/message";

export const WorkbenchStore = types
  .model({
    id: types.identifier,
    status: types.optional(types.string, "created"), // streaming, ready
    currentState: types.maybeNull(StateStore),
    tools: types.array(ToolStore),
    // messageId: types.safeReference(MessageStore),
  })
  .views((self) => ({
    // get getFiles() {
    //   return Array.from(self.files.values());
    // },
  }))
  .actions((self) => {

    // const setIndex = (index: string) => {
    //   self.index = index;
    // };
    const updateState = (state: any) => {
      // self.messageId = state.messageId;
      if (!self.currentState?.id) {
        self.currentState = StateStore.create({
          id: self.id,
        });
      }
      self.currentState.updateState(state);
    }

    return { updateState };
  });

export type IWorkbenchStore = Instance<typeof WorkbenchStore>;
export type IWorkbenchStoreSnapshotIn = SnapshotIn<typeof WorkbenchStore>;
export type IWorkbenchStoreSnapshotOut = SnapshotOut<typeof WorkbenchStore>;
