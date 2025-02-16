"use client";
import React, { createContext, ReactNode, useEffect } from "react";
import {IBoxStore} from "@/lib/store/box";
import {useStore} from "@/lib/store";
import {IAppStore} from "@/lib/store/app";

export const StoreContext = createContext<{
  app: IAppStore;
  box: IBoxStore;
}>({
  app: {} as IAppStore,
  box: {} as IBoxStore,
});

export const StoreWrapper = ({ children, box, app }: { children: ReactNode; box?: any; app?: any }) => {
  const store = useStore({ box, app });

  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     const repo = store.repo as any;
  //     if (repo.isEditing || repo.isGenerating) {
  //       event.preventDefault();
  //       event.returnValue = "";
  //       return "Are you sure you want to leave?";
  //     }
  //     return null;
  //   };
  //
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  // @ts-ignore
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
