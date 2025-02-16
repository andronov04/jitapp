import {getParent, getRoot, Instance, SnapshotIn, SnapshotOut, types} from "mobx-state-tree";
import {nanoid} from "nanoid";

const FilesStore = types
  .model({
    key: types.identifier, // pathFile
    attrs: types.optional(types.frozen(), {}),
    content: types.optional(types.string, ""),
    // pathFile: types.optional(types.string, ""),
    prevValue: types.optional(types.string, ""),
    value: types.string, // content
    changed: false,
  })
  .views((self) => {
    return ({
      get repo() {
        return getRoot(self) as any;
      },
      get parent() {
        return getParent(getParent(self)) as any;
      },
    });
  })
  .actions((self) => {
    return {
      updateValue(value: string, force = true) {
        self.value = value;
        // force && self.parent.setIndex(nanoid());
      },
      setChanged() {
        if (!self.changed) {
          self.prevValue = self.value;
        }
        self.changed = true;
      },
      setUnchanged() {
        self.changed = false;
        self.prevValue = "";
      },
    };
  });

// Snapshot state
export const StateStore = types
  .model({
    id: types.identifier,
    files: types.map(FilesStore),
  })
  .views((self) => ({
    get getFiles() {
      return Array.from(self.files.values());
    },
  }))
  .actions((self) => {

    const updateState = (state: any) => {
      console.log("updateStateupdateState", state);
      if (Array.isArray(state)) {
        state.forEach((item: any) => {
          item.files.forEach((f: any) => {
            const key = f.attrs.filePath;
            const file = self.files.get(key);
            if (file) {
              file.updateValue(f.content || file.value || "", true);
            } else {
              self.files.put(FilesStore.create({ key, value: f.content ?? "" }));
            }
            // const fileStore = self.files.get(file.attrs.filePath);
            // if (fileStore) {
            //   fileStore.updateValue(file.content);
            // }
          });
        });
      }
      console.log("updateStateupdateState2222", self.getFiles.length);
    };

    return { updateState };
  });

export type IStateStore = Instance<typeof StateStore>;
export type IStateStoreSnapshotIn = SnapshotIn<typeof StateStore>;
export type IStateStoreSnapshotOut = SnapshotOut<typeof StateStore>;
