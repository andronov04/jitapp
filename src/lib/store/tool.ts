import {Instance, SnapshotIn, SnapshotOut, types} from "mobx-state-tree";

export const ToolStore = types
  .model({
    id: types.identifier, // key
    name: types.string,
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

export type IToolStore = Instance<typeof ToolStore>;
export type IToolStoreSnapshotIn = SnapshotIn<typeof ToolStore>;
export type IToolStoreSnapshotOut = SnapshotOut<typeof ToolStore>;
