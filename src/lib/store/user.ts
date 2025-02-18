import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const UserStore = types
  .model({
    id: types.identifier, // key
    name: types.optional(types.string, ''),
    username: types.string,
    isCurrentUser: types.optional(types.boolean, false),
    email: types.optional(types.string, ''),
  })
  .views((self) => ({}))
  .actions((self) => {
    return {};
  });

export type IUserStore = Instance<typeof UserStore>;
export type IUserStoreSnapshotIn = SnapshotIn<typeof UserStore>;
export type IUserStoreSnapshotOut = SnapshotOut<typeof UserStore>;
