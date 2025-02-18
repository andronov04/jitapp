'use client';

import { cn, generateId, generateUuid } from '@/lib/utils';
import { ChatHeader } from '@/components/chat/chat-header';
import { Messages } from '@/components/chat/messages';
import { MultimodalInput } from '@/components/chat/multimodal-input';
import { useSWRConfig } from 'swr';
import { useState } from 'react';
import type { Attachment } from 'ai';
import { useBlockSelector } from '@/hooks/use-block';
import { VisibilityType } from '@/components/chat/visibility-selector';
import { useStore } from '@/lib/store';
import { observer } from 'mobx-react-lite';

const ChatView = observer(
  ({
    id,
    initialMessages,
    selectedModelId,
    isCreating: isCreatingProp,
    selectedVisibilityType,
    isReadonly,
  }: {
    id: string;
    initialMessages: Array<any>;
    selectedModelId: string;
    isCreating?: boolean;
    selectedVisibilityType: VisibilityType;
    isReadonly: boolean;
  }) => {
    const { mutate } = useSWRConfig();
    const { app } = useStore();

    // const {
    //   messages,
    //   setMessages,
    //   handleSubmit,
    //   input,
    //   setInput,
    //   append,
    //   isLoading,
    //   stop,
    //   reload,
    // } = useChat({
    //   id,
    //   body: { id, modelId: selectedModelId },
    //   initialMessages,
    //   streamProtocol: "data",
    //   experimental_throttle: 100,
    //   // sendExtraMessageFields: true,
    //   onFinish: () => {
    //     // mutate('/api/history');
    //     setIsCreating(false);
    //   },
    //   onError: () => {
    //     setIsCreating(false);
    //   },
    // });
    const [input, setInput] = useState('');

    // const { data: votes } = useSWR<Array<Vote>>(
    //   `/api/vote?chatId=${id}`,
    //   fetcher,
    // );
    const votes: any = [];

    // useEffect(() => {
    //   parseMessages(messages, isLoading);
    //   console.log("parsedMessages", parsedMessages, box?.id);
    //
    //   // if (messages.length > initialMessages.length) {
    //   //   storeMessageHistory(messages).catch((error) => toast.error(error.message));
    //   // }
    // }, [messages, isLoading, parseMessages]);

    // useEffect(() => {
    //   const prompt = (window as any).jitPrompt;
    //   console.log('initChat', (window as any).jitPrompt);
    //   if (prompt) {
    //     setMessages((messages) => messages.concat([{ id: generateId(), content: prompt, role: 'user' }]));
    //     handleSubmit(undefined, {
    //       allowEmptySubmit: true,
    //     });
    //   }
    //   (window as any).jitPrompt = '';
    //   window.history.replaceState({}, '', `/box/${generateId()}`);
    // }, []);

    const handleSubmit = async (event: any) => {
      event?.preventDefault?.();
      // app.currentBox?.setId();
      const simpleModel = app.models.find(
        (model) => model.key === 'gpt-4o-mini',
      );
      const simpleModel2 = app.models.find(
        (model) => model.key === 'deepseek-reasoner',
      );
      const generatorId = 'bd2ca6f1-b6f8-4334-a8fd-1707209281cd';
      console.log('handleSubmit', input, event, simpleModel);
      // setIsLoading(true);
      // T9rNRonmfjoVitJk96LHB - double good
      app.currentBox?.addMessage({
        id: generateUuid(),
        content: input,
        role: 'user',
        status: 'initial',
      });
      const oneId = generateUuid();
      app.currentBox?.addMessage({
        id: oneId,
        role: 'group',
        content: '',
        status: 'initial',
        children: [
          {
            id: generateUuid(),
            role: 'assistant',
            status: 'initial',
            modelId: simpleModel?.id,
            generatorId,
            parentId: oneId,
            content: ``,
          },
          // {
          //   "id": generateUuid(),
          //   "role": "assistant",
          //   status: 'created',
          //   modelId: simpleModel2?.id,
          //   generatorId,
          //   "parentId": oneId,
          //   "content": ``,
          // },
        ] as any,
      });

      await app.currentBox?.createChat(input);
      // setInput("");
      // if ((app.currentBox?.messages?.length || 0) > 0) {
      //   setInput("");
      //   app.currentBox?.startStream();
      //   return;
      // } else {
      //
      //   await app.currentBox?.createChat(input);
      //   setInput("");
      // }

      // setTimeout(() => {
      //   app.currentBox?.generateStreaming(generateUuid()).then(console.log).catch(console.error);
      // }, 3000);
    };

    const [attachments, setAttachments] = useState<Array<Attachment>>([]);
    const isBlockVisible = useBlockSelector((state) => state.isVisible);

    return (
      <div
        style={{
          height: 'calc(100dvh - 2.5rem)',
        }}
        className="flex flex-col text-sm min-w-0 h-dvh bg-background"
      >
        <ChatHeader
          chatId={id}
          isCreating={false}
          selectedModelId={selectedModelId}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

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

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={app.currentBox?.isProcessing || false}
              stop={() => {}}
              attachments={[]}
              setAttachments={() => {}}
              messages={[]}
              setMessages={() => {}}
              append={() => {}}
            />
          )}
        </form>
      </div>
    );

    // return (
    //   <div
    //     style={{
    //       width: 'inherit',
    //       maxHeight: 'calc(100vh - 3rem)',
    //     }}
    //     className="flex flex-col h-full fixed bottom-0"
    //   >
    //     <div className="flex-1 flex flex-col min-w-0 gap-4 px-2 overflow-y-scroll pt-4">
    //       {topLevelMessages.map((message) => (
    //         <Message key={message.id} message={message} />
    //       ))}
    //     </div>
    //
    //     <div className="p-4">
    //       <textarea
    //         className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    //         placeholder="Type your message..."
    //         rows={3}
    //       />
    //     </div>
    //   </div>
    // );
  },
);

export default ChatView;
