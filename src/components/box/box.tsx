'use client';

import { useState, useRef, useCallback } from 'react';
import ChatView from "@/components/box/chat-view";
import WorkbenchView from "@/components/box/workbench-view";
import {BoxIcon, EyeIcon, HeartIcon, MessageCircleIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import millify from "millify";
import LogoBlock from "@/components/common/logo-block";

export function Box() {
  const [chatWidth, setChatWidth] = useState(33); // Default 30%
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((e: any) => {
    isDragging.current = true;
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: any) => {
    if (!isDragging.current || !containerRef.current) return;

    const containerRect = (containerRef.current as any).getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;

    // Calculate percentage
    let newPercentage = (mouseX / containerWidth) * 100;

    // Constrain between 33% and 67%
    newPercentage = Math.max(23, Math.min(77, newPercentage));

    setChatWidth(newPercentage);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className="flex flex-col">
      <header className="h-12 sticky top-0 bg-background z-10 border-b flex justify-between items-center px-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <LogoBlock />
          <BoxIcon className="text-muted-foreground" /> <div className="text-sm">Create bank account landing page</div>
          <Button variant="ghost" size="sm" className="justify-start  shadow-none">
            <HeartIcon className="h-4 w-4"/>
            <span className="text-xs text-gray-400">{millify(2344)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="justify-start  shadow-none">
            <EyeIcon className="h-4 w-4"/>
            <span className="text-xs text-gray-400">{millify(43567)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="justify-start  shadow-none">
            <MessageCircleIcon className="h-4 w-4"/>
            <span className="text-xs text-gray-400">{millify(3)}</span>
          </Button>
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex flex-col md:flex-row h-full relative"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <section
          className="relative overflow-hidden z-10"
          style={{width: `${chatWidth}%`}}
        >
          <ChatView />
        </section>

        <div
          className="w-0.5 bg-transparent hover:bg-blue-400 cursor-col-resize active:bg-blue-600 transition-colors"
          onMouseDown={handleMouseDown}
        />

        <section
          className=" flex-grow"
          style={{width: `${100 - chatWidth}%`}}
        >
          <WorkbenchView />
        </section>
      </div>
    </div>
  );
}

export default Box;
