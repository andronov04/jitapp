import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { StateStore } from '@/lib/store/state';
import { ToolStore } from '@/lib/store/tool';

export const WorkbenchStore = types
  .model({
    id: types.identifier,
    status: types.optional(types.string, 'created'), // streaming, ready
    currentState: types.maybeNull(StateStore),
    tools: types.array(ToolStore),
    // messageId: types.optional(types.string, ''),
  })
  .views((self) => ({
    // get message() {
    //   return self.messageId // getRoot(self).messages.find(m => m.id === self.messageId)?.content;
    // },
  }))
  .actions((self) => {

    const updateState = (state: any, status?: string) => {
      self.status = status ?? self.status;
      if (!self.currentState?.id) {
        self.currentState = StateStore.create({
          id: self.id,
        });
      }
      self.currentState.updateState(state);
    };

    return { updateState };
  });

export type IWorkbenchStore = Instance<typeof WorkbenchStore>;
export type IWorkbenchStoreSnapshotIn = SnapshotIn<typeof WorkbenchStore>;
export type IWorkbenchStoreSnapshotOut = SnapshotOut<typeof WorkbenchStore>;
