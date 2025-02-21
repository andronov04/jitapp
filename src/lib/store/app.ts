import {
  applySnapshot,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
} from 'mobx-state-tree';
import { values } from 'mobx';
import { BoxStore } from '@/lib/store/box';
import { IModelStore, ModelStore } from '@/lib/store/model';
import { IUserStore, UserStore } from '@/lib/store/user';
import { GeneratorStore } from '@/lib/store/generator';
import { findRecursive } from '../utils';

let appStore: IAppStore | undefined;

const AppStore = types
  .model({
    currentBox: types.maybeNull(BoxStore),
    models: types.array(ModelStore),
    users: types.array(UserStore),
    generators: types.array(GeneratorStore),
    currentUser: types.safeReference(UserStore),
    authLoaded: false,
    modalState: types.optional(types.string, ''),
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
        .map((msg: any) => [msg, ...msg.children.flat()])
        .flat()
        .map((a: any) => a.user)
        .filter((a: any) => a);
      console.log('userss', users);
      users.map((a: any) => addOrUpdateUser(a));
      console.log('{ ...box, originalId: box.id }', {
        ...box,
        originalId: box.id,
      });
      self.currentBox = { ...box, originalId: box.id };
      self.currentBox?.recalculateMsgStatus();
    };

    const updateFirstCurrentBox = (box: any) => {
      self.currentBox = { ...box, originalId: box.id };
    };

    const setModalState = (state: string) => {
      self.modalState = state;
    };

    const getModelByStateId = (stateId: string): IModelStore | null => {
      const msg = findRecursive(self.currentBox?.messages ?? [], stateId);
      if (!msg) return null;
      return self.models.find((model) => model.id === msg.modelId) || null;
      // return self.models.find((model) => model.stateId === stateId);
    };

    return {
      getModelByStateId,
      setModalState,
      updateCurrentBox,
      updateFirstCurrentBox,
      addOrUpdateUser,
    };
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
  if (typeof window === 'undefined') return _store;
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
