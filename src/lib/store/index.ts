import { useMemo } from 'react';
import { IAppStore, initializeAppStore } from '@/lib/store/app';

export function useStore(initialState?: { app?: any }): { app: IAppStore } {
  return useMemo(() => {
    return {
      app: initializeAppStore(initialState?.app) as IAppStore,
    };
  }, [initialState]);
}
