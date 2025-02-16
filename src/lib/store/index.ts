import { useMemo } from "react";
import {IBoxStore, initializeBoxStore} from "@/lib/store/box";
import {IAppStore, initializeAppStore} from "@/lib/store/app";

export function useStore(initialState?: { app?: any; box?: any }): { box: IBoxStore, app: IAppStore } {
  return useMemo(() => {
    return {
      box: initializeBoxStore(initialState?.box) as IBoxStore,
      app: initializeAppStore(initialState?.app) as IAppStore,
    };
  }, [initialState]);
}
