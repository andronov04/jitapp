'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ChatView from '@/components/box/chat-view';
import WorkbenchView from '@/components/box/workbench-view';
import { EllipsisVerticalIcon, EyeIcon, HeartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import millify from 'millify';
import LogoBlock from '@/components/common/logo-block';
import { observer } from 'mobx-react-lite';
import BoxIcon from '@/components/common/box-icon';
import AuthBlock from '@/components/app/auth-header';
import { useStores } from '@/hooks/useStores';
import { generateUuid } from '@/lib/utils';
import { useDebounceValue, useLocalStorage, useUnmount } from 'usehooks-ts';
import { setCookies } from '@/lib/actions/cookies';
import BaseHeader from '@/components/common/base-header';
import Link from 'next/link';

const Box = observer(({ data, config }: { data?: any; config?: any }) => {
  const { app } = useStores();
  // Use localStorage to remember the split percentage
  const [chatWidth, setChatWidth] = useLocalStorage(
    'jit-box-section-w',
    config?.boxSectionWidth ?? 33,
  );

  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useUnmount(() => {
    // Cleanup logic here
    app.currentBox?.clearBox();
  });

  // Populate store from incoming data
  useEffect(() => {
    if (data?.box) {
      app.updateCurrentBox(data.box);
      if (data.messageStates) {
        data.messageStates.forEach((state: any) => {
          app.currentBox?.updateState(state.id, state.data?.data);
        });
      }
    }
  }, []);

  useEffect(() => {
    isDragging
      ? document.body.classList.add('g-is-drag')
      : document.body.classList.remove('g-is-drag');
  }, [isDragging]);

  // When mouse goes down on the divider, start dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    // Attach global listeners to capture mouse even if it leaves container
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  }, []);

  // Handle mouse move (global listener)
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;

      let newPercentage = (mouseX / containerWidth) * 100;
      // Constrain between 23% and 77% (adjust as you like)
      newPercentage = Math.max(23, Math.min(77, newPercentage));

      setChatWidth(newPercentage);
    },
    [setChatWidth],
  );

  // Handle mouse up (global listener)
  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    // Remove global listeners
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  return (
    <div className="flex flex-col">
      <BaseHeader>
        <>
          <LogoBlock />
          <BoxIcon />
          <div className="text-sm flex flex-col">
            {app.currentBox?.name || data?.box?.name}
            {app.currentBox?.user && (
              <div className="text-muted-foreground">
                by{' '}
                <Link
                  className="dark:text-white text-black hover:underline"
                  href={`/@${app.currentBox.user.username}`}
                >
                  @{app.currentBox.user.username}
                </Link>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start shadow-none"
          >
            <HeartIcon className="h-4 w-4" />
            <span className="text-xs text-gray-400">
              {millify(app.currentBox?.numLikes || 0)}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start pointer-events-none shadow-none"
          >
            <EyeIcon className="h-4 w-4" />
            <span className="text-xs text-gray-400">
              {millify(app.currentBox?.numLikes || 0)}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start shadow-none"
          >
            <EllipsisVerticalIcon className="h-4 w-4" />
          </Button>
          {/*{app.currentUser?.id && app.currentUser?.id === app.currentBox?.userId ? <div>*/}
          {/*  <Button*/}
          {/*    variant="ghost"*/}
          {/*    size="sm"*/}
          {/*    className="justify-start shadow-none"*/}
          {/*  >*/}
          {/*    <EllipsisVerticalIcon className="h-4 w-4" />*/}
          {/*  </Button>*/}
          {/*</div> : null}*/}
        </>
      </BaseHeader>

      {/* CONTAINER for the two panes */}
      <div
        ref={containerRef}
        className="flex flex-col md:flex-row h-full relative"
        // We no longer handle onMouseMove / onMouseUp here
      >
        {/* Left Pane (Chat) */}
        <section
          className="relative overflow-hidden z-10 h-full"
          style={{ width: `${chatWidth}%` }}
        >
          <div
            style={{ top: '-1000px', left: '-1000px' }}
            className={'absolute'}
          >
            {chatWidth}
          </div>
        </section>

        <section
          className="fixed overflow-hidden z-10"
          style={{ width: `${chatWidth}%` }}
        >
          <ChatView
            id={data?.box?.id || app.currentBox?.id || generateUuid()}
            isReadonly={false}
          />
        </section>

        {/* The Divider */}
        <div
          className="w-1 bg-transparent mx-0.5 hover:bg-blue-400 cursor-col-resize active:bg-blue-600 transition-colors"
          onMouseDown={handleMouseDown}
        />

        {/* Right Pane (Workbench) */}
        <section className="flex-grow" style={{ width: `${100 - chatWidth}%` }}>
          <div className="flex flex-col p-4 space-y-4">
            {app.currentBox?.workbenches?.map((item) => (
              <WorkbenchView
                key={item.id}
                count={app.currentBox?.workbenches?.length ?? 0}
                workbench={item}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
});

export default Box;
