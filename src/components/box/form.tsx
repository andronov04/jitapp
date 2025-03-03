'use client';

import { cn, generateId, generateUuid } from '@/lib/utils';
import { MultimodalInput } from '@/components/chat/multimodal-input';
import { useState } from 'react';
import type { Attachment } from 'ai';
import { useBlockSelector } from '@/hooks/use-block';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/hooks/useStores';
import { useRouter } from 'next/navigation';
import ModelSelector from '@/components/app/model-selector';
import { FailedAlert } from '@/components/app/failed-alert';

const FormView = observer(
  ({
    id,
    kind = 'form',
  }: {
    id?: string;
    kind?: string;
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
      const selectedModels = app.models.filter((model) => model.selected);
      if (!selectedModels.length) {
        return;
      }
      const firstGenerator = app.generators[0];
      if (!firstGenerator) {
        return;
      }

      console.log('handleSubmit', input, event);
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
        children: selectedModels.map((model) => ({
          id: generateUuid(),
          role: 'assistant',
          status: 'initial',
          modelId: model?.id,
          userId: app.currentUser?.id,
          generatorId: firstGenerator.id,
          parentMessageId: oneId,
          content: ``,
        })) as any,
      });

      await app.currentBox?.createChat(input);
      setInput('');
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
        <div
          className={
            'relative flex flex-col mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl'
          }
        >
          {app.currentBox?.failed && (
            <FailedAlert data={app.currentBox.failed} />
          )}

          <div className="absolute left-0 px-4 w-full -top-12 h-10">
            <ModelSelector kind={kind} />
          </div>
          <form className={'w-full'}>
            {!isReadonly && (
              <MultimodalInput
                chatId={id || app.currentBox?.id || generateUuid()}
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                isLoading={app.currentBox?.isProcessing || false}
                isBusy={app.currentBox?.isBusy || false}
                stop={() => {}}
                attachments={[]}
                setAttachments={() => {}}
                messages={[]}
                setMessages={() => {}}
                append={() => {}}
              />
            )}
          </form>
          {/*<div className="absolute left-0 px-4 w-full -bottom-8 h-10">*/}
          {/*  <ModelSelector />*/}
          {/*</div>*/}
        </div>
      </div>
    );
  },
);

export default FormView;
