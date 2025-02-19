'use client';

import type { ChatRequestOptions, Message } from 'ai';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useEffect, useMemo, useState } from 'react';

import { DocumentToolCall, DocumentToolResult } from './document';
// import { MessageActions } from './message-actions';
// import { PreviewAttachment } from './preview-attachment';
// import { Weather } from './weather';
import equal from 'fast-deep-equal';
import { cn } from '@/lib/utils';
import { MessageEditor } from './message-editor';
import { DocumentPreview } from './document-preview';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Markdown } from '@/components/chat/markdown';
import { SparklesIcon } from 'lucide-react';
import { PreviewAttachment } from '@/components/chat/preview-attachment';
import { MessageActions } from '@/components/chat/message-actions';
import { PreMarkdown } from '@/components/chat/pre-markdown';
import { IMessageStore } from '@/lib/store/message';
import MessageChildren from '@/components/chat/message-children';
import AvatarBlock from '@/components/common/avatar-block';
import SparkleIcon from "@/components/common/sparkle-icon";

const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  reload,
  isReadonly,
}: {
  chatId: string;
  message: IMessageStore;
  vote: any | undefined;
  isLoading: boolean;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[]),
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  // useEffect(() => {
  //   console.log('message', message.status, message);
  // }, [message.status]);
  console.log(':::MESSAGE:::', message);

  return (
    <AnimatePresence>
      <motion.div
        className="w-full mx-auto max-w-3xl px-2 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 w-full group-data-[role=user]/message:max-w-2xl',
            {
              'w-full': mode === 'edit',
              'group-data-[role=user]/message:w-fit': mode !== 'edit',
            },
          )}
        >
          {message.role === 'assistant' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            {/*{message.experimental_attachments && (*/}
            {/*  <div className="flex flex-row justify-end gap-2">*/}
            {/*    {message.experimental_attachments.map((attachment) => (*/}
            {/*      <PreviewAttachment*/}
            {/*        key={attachment.url}*/}
            {/*        attachment={attachment}*/}
            {/*      />*/}
            {/*    ))}*/}
            {/*  </div>*/}
            {/*)}*/}

            {message.content && message.role === 'user' && (
              <div className="flex flex-row gap-2 items-start">
                {/*{message.role === 'user' && !isReadonly && (*/}
                {/*  <TooltipProvider>*/}
                {/*    <Tooltip>*/}
                {/*      <TooltipTrigger asChild>*/}
                {/*        <Button*/}
                {/*          variant="ghost"*/}
                {/*          className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"*/}
                {/*          onClick={() => {*/}
                {/*            setMode('edit');*/}
                {/*          }}*/}
                {/*        >*/}
                {/*          /!*<PencilEditIcon />*!/*/}
                {/*        </Button>*/}
                {/*      </TooltipTrigger>*/}
                {/*      <TooltipContent>Edit message</TooltipContent>*/}
                {/*    </Tooltip>*/}
                {/*  </TooltipProvider>*/}
                {/*)}*/}
                <AvatarBlock id={message.user?.id || message.id} />

                <div
                  className={cn('flex flex-col', {
                    'bg-primary text-primary-foreground px-3 py-2 rounded-xl':
                      message.role === 'user',
                  })}
                >
                  <div className="text-green-600">
                    @{message.user?.username ?? 'user'}
                  </div>
                  <PreMarkdown content={message.content as string} />
                </div>
              </div>
            )}

            {message.role === 'group' && (
              <div className="rounded-xl flex flex-row gap-2 items-start">
                {/*<AvatarBlock*/}
                {/*  id={message.id}*/}
                {/*  customSrc={'https://jit.dev/32x32.png'}*/}
                {/*/>*/}
                <div className="w-8 h-8 flex-none flex items-center justify-center rounded-full bg-secondary">
                  <SparkleIcon />
                </div>
                <div
                  className={cn(
                    'flex flex-col bg-secondary px-3 py-2 rounded-xl',
                  )}
                >
                  {message.children.map((msg) => (
                    <div key={msg.id}>
                      <div className="text-green-600">
                        {msg.model?.name || 'AI'}
                      </div>
                      <MessageChildren key={msg.id} message={msg} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/*{message.content && mode === 'edit' && (*/}
            {/*  <div className="flex flex-row gap-2 items-start">*/}
            {/*    <div className="size-8" />*/}

            {/*    <MessageEditor*/}
            {/*      key={message.id}*/}
            {/*      message={message as any}*/}
            {/*      setMode={setMode}*/}
            {/*      setMessages={setMessages}*/}
            {/*      reload={reload}*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*)}*/}

            {/*{!isReadonly && (*/}
            {/*  <MessageActions*/}
            {/*    key={`action-${message.id}`}*/}
            {/*    chatId={chatId}*/}
            {/*    message={message}*/}
            {/*    vote={vote}*/}
            {/*    isLoading={isLoading}*/}
            {/*  />*/}
            {/*)}*/}
            {/*{message.role === 'assistant' && (*/}
            {/*  <div className={"text-muted-foreground text-xs"}>*/}
            {/*  gpt-4o*/}
            {/*  </div>*/}
            {/*)}*/}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.content !== nextProps.message.content) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-2 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
