import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const ModelStore = types
  .model({
    id: types.identifier,
    modelKey: types.string,
    modelLabel: types.string,
    providerLabel: types.string,
    providerKey: types.string,
    headline: types.optional(types.string, ''),
    description: types.optional(types.string, ''),
    tags: types.optional(types.array(types.string), []),
    order: types.optional(types.number, 0),
    active: types.optional(types.boolean, true),
    params: types.optional(types.frozen(), {}),
    selected: types.optional(types.boolean, false),
  })
  .views((self) => ({
    // get getFiles() {
    //   return Array.from(self.files.values());
    // },
  }))
  .actions((self) => {
    const setSelected = () => {
      self.selected = !self.selected;
    };

    return { setSelected };
  });

export type IModelStore = Instance<typeof ModelStore>;
export type IModelStoreSnapshotIn = SnapshotIn<typeof ModelStore>;
export type IModelStoreSnapshotOut = SnapshotOut<typeof ModelStore>;
