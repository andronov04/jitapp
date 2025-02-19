'use client';
import { Chat } from '@/components/chat/chat';
import { generateId } from '@/lib/utils';
import { DEFAULT_MODEL_NAME } from '@/lib/ai/models';
import LogoBlock from '@/components/common/logo-block';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

//  <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2"></header

export function ContainerView({
  initialMessages,
  isCreating,
  chatId,
}: { initialMessages: any; isCreating?: boolean; chatId: string }) {
  return (
    <div className="min-h-screen flex flex-col flex-1">
      <header className="flex h-10 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
        <LogoBlock size={30} />
        {/*<Button variant="secondary" size="sm">*/}
        {/*  <PlusIcon />*/}
        {/*  New*/}
        {/*</Button>*/}
      </header>
      <div className="flex-grow flex">
        <div
          style={{
            flex: '35 1 0px',
          }}
          className="collapsed:md:min-w-[28rem] collapsed:lg:min-w-[32rem] h-full md:min-w-[18rem] lg:min-w-[24rem] xl:min-w-[32rem]"
        >
          <div>
            <Chat
              key={chatId}
              id={chatId}
              isCreating={isCreating}
              initialMessages={initialMessages ?? []}
              selectedModelId={DEFAULT_MODEL_NAME}
              selectedVisibilityType="private"
              isReadonly={false}
            />
          </div>
        </div>
        <div
          style={{
            flex: '65 1 0px',
            overflow: 'clip',
          }}
          className="w-full block sticky top-0 h-full min-w-[420px] text-sm z-10"
        >
          <header className="flex h-12 border-b  sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
            <Tabs defaultValue="password" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="account">Preview</TabsTrigger>
                <TabsTrigger value="password">Code</TabsTrigger>
                <TabsTrigger value="compiler">Compiler</TabsTrigger>
                <TabsTrigger value="graph">Graph</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              {/*<TabsContent value="account">Make changes to your account here.</TabsContent>*/}
              {/*<TabsContent value="password">Change your password here.</TabsContent>*/}
            </Tabs>
          </header>

          <div>
            {/*<CodeView />*/}
          </div>
        </div>
      </div>
    </div>
  );
}
