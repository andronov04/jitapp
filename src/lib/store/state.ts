import {
  getParent,
  getRoot,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
} from 'mobx-state-tree';
import { nanoid } from 'nanoid';

const StateItemStore = types
  .model({
    key: types.identifier, // pathFile
    pathFile: types.optional(types.string, ''),
    content: types.optional(types.string, ''),
    type: types.optional(types.string, ''),
    prevContent: types.optional(types.string, ''),
    changed: false,
  })
  .views((self) => {
    return {
      get repo() {
        return getRoot(self) as any;
      },
      get parent() {
        return getParent(getParent(self)) as any;
      },
    };
  })
  .actions((self) => {
    return {
      updateContent(content: string, force = true) {
        self.content = content;
        // force && self.parent.setIndex(nanoid());
      },
      setChanged() {
        if (!self.changed) {
          self.prevContent = self.content;
        }
        self.changed = true;
      },
      setUnchanged() {
        self.changed = false;
        self.prevContent = '';
      },
    };
  });

// Snapshot state
export const StateStore = types
  .model({
    id: types.identifier,
    state: types.map(StateItemStore),
  })
  .views((self) => ({
    get getFiles() {
      return Array.from(self.state.values()).filter(
        (item: any) => item.type === 'file',
      );
    },
  }))
  .actions((self) => {
    const updateState = (state: any) => {
      if (Array.isArray(state)) {
        state.forEach((item: any) => {
          const key = item.filePath || item.key;
          if (!key) return;
          const stateItem = self.state.get(key);
          if (stateItem) {
            stateItem.updateContent(item.content || '', true);
          } else {
            self.state.put(
              StateItemStore.create({
                key,
                content: item.content ?? '',
                type: item.type ?? 'unknown',
                filePath: item.filePath,
              }),
            );
          }
        });
      }
    };

    return { updateState };
  });

export type IStateStore = Instance<typeof StateStore>;
export type IStateStoreSnapshotIn = SnapshotIn<typeof StateStore>;
export type IStateStoreSnapshotOut = SnapshotOut<typeof StateStore>;
