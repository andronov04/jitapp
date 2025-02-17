"use client";
import React, { createContext, ReactNode, useEffect } from "react";
import {useStore} from "@/lib/store";
import {IAppStore} from "@/lib/store/app";

export const StoreContext = createContext<{
  app: IAppStore;
}>({
  app: {} as IAppStore,
});

export const StoreWrapper = ({ children, app }: { children: ReactNode; app?: any }) => {
  const store = useStore({ app });

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
