'use client';
import { observer } from 'mobx-react-lite';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useStores } from '@/hooks/useStores';
import AuthView from '@/components/app/auth-view';

const AuthModal = observer(() => {
  const {
    app: { modalState, setModalState },
  } = useStores();
  return (
    <Dialog
      onOpenChange={(isOpen) => {
        !isOpen && setModalState('');
      }}
      open={modalState === 'authLogin' || modalState === 'authSignup'}
    >
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="z-[60] max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center justify-center gap-4 text-center">
            <img alt="jit.dev" className="h-12 w-12" src="/jit_icon.png" />
            {/*<svg width="38" height="38" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*  <g clipPath="url(#clip0_27773_497)">*/}
            {/*    <rect width="16" height="16" fill="black" />*/}
            {/*    <path d="M9.99997 9V14H8.99997V9H9.99997Z" fill="white" />*/}
            {/*    <path d="M8 9V12.5L7 13V9H8Z" fill="white" />*/}
            {/*    <path d="M13 9V14H12V9H13Z" fill="white" />*/}
            {/*    <path d="M13.9999 9V10H10.9999V9H13.9999Z" fill="white" />*/}
            {/*    <path*/}
            {/*      d="M8 12.5C8 12.8978 7.84196 13.2794 7.56066 13.5607C7.27936 13.842 6.89782 14 6.5 14C6.10218 14 5.72064 13.842 5.43934 13.5607C5.15804 13.2794 5 12.8978 5 12.5L5.9975 12.5C5.9975 12.6333 6.05044 12.7611 6.14468 12.8553C6.23892 12.9496 6.36673 13.0025 6.5 13.0025C6.63327 13.0025 6.76108 12.9496 6.85532 12.8553C6.94956 12.7611 7.0025 12.6333 7.0025 12.5H8Z"*/}
            {/*      fill="white"*/}
            {/*    />*/}
            {/*  </g>*/}
            {/*  <defs>*/}
            {/*    <clipPath id="clip0_27773_497">*/}
            {/*      <rect width="16" height="16" fill="white" />*/}
            {/*    </clipPath>*/}
            {/*  </defs>*/}
            {/*</svg>*/}
            <span className="min-h-[18px]">
              {modalState === 'authSignup' ? 'Sign up' : ''}
              {modalState === 'authLogin' ? 'Log in' : ''}
            </span>
          </DialogTitle>
          <DialogDescription className=" mt-4 w-full text-center">
            From idea to code in a flash.
          </DialogDescription>
        </DialogHeader>
        <div>
          <AuthView />
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default AuthModal;
