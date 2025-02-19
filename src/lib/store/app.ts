import {
  applySnapshot,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
} from 'mobx-state-tree';
import { values } from 'mobx';
import { BoxStore } from '@/lib/store/box';
import { ModelStore } from '@/lib/store/model';
import { IUserStore, UserStore } from '@/lib/store/user';
import { GeneratorStore } from '@/lib/store/generator';

let appStore: IAppStore | undefined;

// const UserModel = types
//   .model({
//     id: types.identifier,
//     avatar: types.maybeNull(types.string),
//     name: types.maybeNull(types.string),
//     username: types.string,
//     email: types.string,
//     plan: types.optional(types.string, "free"),
//     credits: types.optional(types.number, 0),
//     requestedPlan: types.optional(types.boolean, false),
//     role: types.optional(
//       types.model({
//         id: types.number,
//         name: types.maybeNull(types.string),
//       }),
//       {
//         id: 2,
//         name: "user",
//       },
//     ),
//     status: types.optional(
//       types.model({
//         id: types.number,
//         name: types.maybeNull(types.string),
//       }),
//       {
//         id: 1,
//         name: "active",
//       },
//     ),
//   })
//   .actions((self) => {
//     const updateRequestedPlan = (val: boolean) => {
//       self.requestedPlan = val;
//     };
//     return { updateRequestedPlan };
//   });

const AppStore = types
  .model({
    currentBox: types.maybeNull(BoxStore),
    models: types.array(ModelStore),
    users: types.array(UserStore),
    generators: types.array(GeneratorStore),
    currentUser: types.safeReference(UserStore),
    // light: false,
    // authLoaded: false,
    // modalState: types.optional(types.string, ""),
    // currentUser: types.maybeNull(UserModel),
    // layouts: types.optional(types.map(LayoutStore), {}),
    // models: types.optional(
    //   types.array(
    //     types
    //       .model({
    //         id: types.number,
    //         name: types.maybeNull(types.string),
    //         provider: types.maybeNull(types.string),
    //         key: types.maybeNull(types.string),
    //         active: types.maybeNull(types.boolean),
    //         isFree: types.optional(types.boolean, false),
    //         bg: types.optional(types.frozen(), {}),
    //         meta: types.optional(types.frozen(), {}),
    //       })
    //       .views((self) => ({
    //         get index() {
    //           return self.meta.sort || 0;
    //         },
    //       })),
    //   ),
    //   [],
    // ),
  })
  .views((self) => ({
    get isAuthenticated() {
      return Boolean(self.currentUser?.id);
    },
    // get currentLayout() {
    //   return Array.from(self.layouts.values()).find((layout) => layout.active);
    // },
  }))
  .actions((self) => {
    const addOrUpdateUser = (userData: IUserStore) => {
      const user = self.users.find((a) => a.id === userData.id);
      if (user) {
        // applySnapshot(user, userData);
      } else {
        self.users.push(userData); //, либо через `applySnapshot`, либо MST-utility like detach/put
      }
    };

    const updateCurrentBox = (box: any) => {
      // TODO better this and add current user
      const users = box.messages
        .map((msg) => [msg, ...msg.children.flat()])
        .flat()
        .map((a) => a.user)
        .filter((a) => a);
      console.log('userss', users);
      users.map((a) => addOrUpdateUser(a));
      self.currentBox = box;
    };

    const updateFirstCurrentBox = (box: any) => {
      self.currentBox = box;
    }

    // const afterCreate = () => {
    //   // TODO load from database
    //   // self.layouts.put({ id: 4, views: ["web", "code"] });
    // };
    // const addLayout = (layout: any) => {
    //   if (self.layouts.has(layout.id)) return;
    //   self.layouts.put(layout);
    // };
    // const setActiveLayout = (id: number) => {
    //   // const layout = self.layouts.get(id);
    //   // if (layout) {
    //   //   layout.active = true;
    //   // }
    //   (values(self.layouts) as any).forEach((layout: any) => {
    //     layout.active = layout.id === id;
    //   });
    // };
    // const setModalState = (state: string) => {
    //   self.modalState = state;
    // };
    // const setUser = (user?: any) => {
    //   self.currentUser = user;
    //   self.authLoaded = true;
    // };
    // const getModelById = (id: number) => {
    //   return self.models.find((model) => model.id === id);
    // };
    return { updateCurrentBox, updateFirstCurrentBox, addOrUpdateUser };
  });

export type IAppStore = Instance<typeof AppStore>;
export type IAppStoreSnapshotIn = SnapshotIn<typeof AppStore>;
export type IAppStoreSnapshotOut = SnapshotOut<typeof AppStore>;

export function initializeAppStore(snapshot: IAppStoreSnapshotIn) {
  const _store = appStore ?? AppStore.create(snapshot);

  // If your page has Next.js data fetching methods that use a Mobx store, it will
  // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
  if (snapshot) {
    applySnapshot(_store, snapshot);
  }
  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!appStore) appStore = _store;

  return appStore;
}


export function getAppStore(): IAppStore {
  if (!appStore) {
    appStore = initializeAppStore({
      currentBox: null,
    });
  }
  return appStore;
}
