'use client';

import { cn, generateId, generateUuid } from '@/lib/utils';
import { MultimodalInput } from '@/components/chat/multimodal-input';
import { useState } from 'react';
import type { Attachment } from 'ai';
import { useBlockSelector } from '@/hooks/use-block';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/hooks/useStores';
import { useRouter } from 'next/navigation';

const FormView = observer(
  ({
    id,
  }: {
    id?: string;
  }) => {
    const { app } = useStores();

    const router = useRouter();
    const isReadonly = false;

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

    const handleSubmit = async (event: any) => {
      event?.preventDefault?.();
      if (!app.currentBox?.id) {
        //  === id
        console.log('handleSubmit', input, event, app);
        return;
      }

      router.push(`/i/${id || app.currentBox?.id}${!id ? '?t=1' : ''}`);
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
        userId: app.currentUser?.id,
        status: 'initial',
      });
      const oneId = generateUuid();
      app.currentBox?.addMessage({
        id: oneId,
        role: 'group',
        content: '',
        status: 'initial',
        userId: app.currentUser?.id,
        children: [
          {
            id: generateUuid(),
            role: 'assistant',
            status: 'initial',
            modelId: simpleModel?.id,
            userId: app.currentUser?.id,
            generatorId,
            parentId: oneId,
            content: ``,
          },
          // {
          //   "id": generateUuid(),
          //   "role": "assistant",
          //   status: 'created',
          //   modelId: simpleModel2?.id,
          //   userId: app.currentUser?.id,
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
      <div>
        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id || app.currentBox?.id || generateUuid()}
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
  },
);

export default FormView;
