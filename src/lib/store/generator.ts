import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const GeneratorStore = types
  .model({
    id: types.identifierNumber,
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

    return {};
  });

export type IGeneratorStore = Instance<typeof GeneratorStore>;
export type IGeneratorStoreSnapshotIn = SnapshotIn<typeof GeneratorStore>;
export type IGeneratorStoreSnapshotOut = SnapshotOut<typeof GeneratorStore>;
