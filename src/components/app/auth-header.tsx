"use client";
import { observer } from "mobx-react-lite";
import { Button } from "@/components/ui/button";
import {useStores} from "@/hooks/useStores";
import CurrentUserDropdown from "@/components/app/current-dropdown-index";


const AuthBlock = observer(() => {
  const { app } = useStores();
  return (
    <div className="flex items-center gap-4">
      {/*{app.isAuthenticated && <BillingBox />}*/}
      {/*<AuthModal />*/}
      {!app.isAuthenticated ? (
        <>
          <Button
            onClick={() => {
              // app.setModalState("authLogin");
            }}
            size="sm"
            variant="ghost"
            className="bg-secondary h-auto rounded-full py-1 hover:opacity-95"
          >
            Log in
          </Button>
          <Button
            onClick={() => {
              // app.setModalState("authSignup");
            }}
            size="sm"
            className="h-auto rounded-full py-1"
          >
            Sign up free
          </Button>
        </>
      ) : (
        <CurrentUserDropdown />
      )}
    </div>
  );
});

export default AuthBlock;
