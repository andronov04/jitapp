import {Instance, SnapshotIn, SnapshotOut, types} from "mobx-state-tree";

export const ModelStore = types
  .model({
    id: types.identifier,
    name: types.string,
    path: types.optional(types.string, ''),
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

    return { };
  });

export type IModelStore = Instance<typeof ModelStore>;
export type IModelStoreSnapshotIn = SnapshotIn<typeof ModelStore>;
export type IModelStoreSnapshotOut = SnapshotOut<typeof ModelStore>;
