'use client';

import type { Attachment, Message } from 'ai';
import { useChat } from 'ai/react';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { generateId } from '@/lib/utils';

import { Block } from './block';
import { MultimodalInput } from './multimodal-input';
import { VisibilityType } from './visibility-selector';
import { useBlockSelector } from '@/hooks/use-block';
import { ChatHeader } from '@/components/chat/chat-header';
import { Messages } from '@/components/chat/messages';
import { useMessageParser } from '@/hooks/useMessageParser';

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  isCreating: isCreatingProp,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
  isCreating?: boolean;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [isCreating, setIsCreating] = useState(isCreatingProp || false);

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, modelId: selectedModelId },
    initialMessages,
    streamProtocol: 'data',
    experimental_throttle: 100,
    // sendExtraMessageFields: true,
    onFinish: () => {
      // mutate('/api/history');
      setIsCreating(false);
    },
    onError: () => {
      setIsCreating(false);
    },
  });
  const { parsedMessages, parseMessages } = useMessageParser();

  // const { data: votes } = useSWR<Array<Vote>>(
  //   `/api/vote?chatId=${id}`,
  //   fetcher,
  // );
  const votes: any = [];

  useEffect(() => {
    parseMessages(messages, isLoading);
    // console.log("parsedMessages", parsedMessages);

    // if (messages.length > initialMessages.length) {
    //   storeMessageHistory(messages).catch((error) => toast.error(error.message));
    // }
  }, [messages, isLoading, parseMessages]);

  useEffect(() => {
    const prompt = (window as any).jitPrompt;
    console.log('initChat', (window as any).jitPrompt);
    if (prompt) {
      setMessages((messages) =>
        messages.concat([{ id: generateId(), content: prompt, role: 'user' }]),
      );
      handleSubmit(undefined, {
        allowEmptySubmit: true,
      });
    }
    (window as any).jitPrompt = '';
    window.history.replaceState({}, '', `/chat/${generateId()}`);
  }, []);

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isBlockVisible = useBlockSelector((state) => state.isVisible);

  return (
    <>
      <div
        style={{
          height: 'calc(100dvh - 2.5rem)',
        }}
        className="flex flex-col text-sm min-w-0 h-dvh bg-background"
      >
        <ChatHeader
          chatId={id}
          isCreating={isCreating}
          selectedModelId={selectedModelId}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

        <Messages
          chatId={id}
          isLoading={isLoading}
          votes={votes}
          messages={messages.map((message, i) => {
            if (message.role === 'user') {
              return message;
            }

            return {
              ...message,
              content: parsedMessages[i] || '',
            };
          })}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isBlockVisible={isBlockVisible}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </form>
      </div>

      <Block
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  );
}
