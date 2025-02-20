'use client';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/hooks/useStores';
import AuthBlock from '@/components/app/auth-header';

const BaseHeader = observer(({ children }: { children?: React.ReactNode }) => {
  const { app } = useStores();
  return (
    <header className="h-12 sticky top-0 gap-2 bg-background z-30 border-b flex justify-between items-center px-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">{children}</div>
      <div className="flex items-center justify-end">
        <AuthBlock />
      </div>
    </header>
  );
});

export default BaseHeader;
