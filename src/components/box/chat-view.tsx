'use client';

import { Messages } from '@/components/chat/messages';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/hooks/useStores';
import FormView from '@/components/box/form';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const ChatView = observer(
  ({
    id,
    isReadonly,
  }: {
    id: string;
    isReadonly: boolean;
  }) => {
    const { app } = useStores();
    const searchParams = useSearchParams();

    // const { data: votes } = useSWR<Array<Vote>>(
    //   `/api/vote?chatId=${id}`,
    //   fetcher,
    // );
    const votes: any = [];

    const isBlockVisible = false;

    return (
      <div
        style={{
          height: 'calc(100dvh - 2.5rem)',
        }}
        className="flex flex-col text-sm min-w-0 h-dvh bg-background"
      >
        {/*<ChatHeader*/}
        {/*  chatId={id}*/}
        {/*  isCreating={false}*/}
        {/*  selectedModelId={selectedModelId}*/}
        {/*  selectedVisibilityType={selectedVisibilityType}*/}
        {/*  isReadonly={isReadonly}*/}
        {/*/>*/}

        <Messages
          chatId={id}
          isLoading={app.currentBox?.isProcessing || false}
          votes={votes}
          messages={app.currentBox?.messages ?? []}
          // messages={([] as any).map((message: any, i: any) => {
          //   if (message.role === 'user') {
          //     return message;
          //   }
          //
          //   return {
          //     ...message,
          //     content: parsedMessages[i] || '',
          //   };
          // }) as any}
          setMessages={() => {}}
          reload={() => {}}
          isReadonly={isReadonly}
          isBlockVisible={isBlockVisible}
        />

        <FormView id={id} />
      </div>
    );
  },
);

export default ChatView;
