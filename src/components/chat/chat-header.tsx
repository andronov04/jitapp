'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { memo } from 'react';
import { VisibilityType, VisibilitySelector } from './visibility-selector';
import { ModelSelector } from '@/components/chat/model-selector';
import { SidebarToggle } from '@/components/chat/sidebar-toggle';
import { useSidebar } from '@/components/ui/sidebar';
import { PlusIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
  isCreating,
}: {
  chatId: string;
  selectedModelId: string;
  isCreating?: boolean;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const router = useRouter();
  // const { open } = useSidebar();
  const open = false;

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex h-12 sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      {/*<SidebarToggle />*/}
      <div className="flex items-center justify-between gap-2">
        {/*<div>*/}
        {/*  <img*/}
        {/*    className={"rounded-full w-8 h-8 object-cover"}*/}
        {/*    alt={"avatar"} src={"https://lh3.googleusercontent.com/ogw/AF2bZyjr2JhhSdcpPorBzFTwSAPdnONScwaqRTNkryNavtJmQP4=s64-c-mo"} />*/}
        {/*</div>Smooth slideshow creation*/}
        {isCreating ? <Skeleton className={'h-5 w-44 rounded-md'} /> : null}
      </div>

      {/*{(!open || windowWidth < 768) && (*/}
      {/*  <TooltipProvider>*/}
      {/*    <Tooltip>*/}
      {/*      <TooltipTrigger asChild>*/}
      {/*        <Button*/}
      {/*          variant="outline"*/}
      {/*          className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"*/}
      {/*          onClick={() => {*/}
      {/*            router.push('/');*/}
      {/*            router.refresh();*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <PlusIcon />*/}
      {/*          <span className="md:sr-only">New Chat</span>*/}
      {/*        </Button>*/}
      {/*      </TooltipTrigger>*/}
      {/*      <TooltipContent>New Chat</TooltipContent>*/}
      {/*    </Tooltip>*/}
      {/*  </TooltipProvider>*/}
      {/*)}*/}

      {/*{!isReadonly && (*/}
      {/*  <ModelSelector*/}
      {/*    selectedModelId={selectedModelId}*/}
      {/*    className="order-1 md:order-2"*/}
      {/*  />*/}
      {/*)}*/}

      {/*{!isReadonly && (*/}
      {/*  <VisibilitySelector*/}
      {/*    chatId={chatId}*/}
      {/*    selectedVisibilityType={selectedVisibilityType}*/}
      {/*    className="order-1 md:order-3"*/}
      {/*  />*/}
      {/*)}*/}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
