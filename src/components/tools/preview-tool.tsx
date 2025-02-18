'use client';
import { observer } from 'mobx-react-lite';
import { IStateStore } from '@/lib/store/state';
import { ExternalLink, Maximize2 } from 'lucide-react';
import { PREVIEW_URL_TMPL } from '@/constants';
import { Skeleton } from '@/components/ui/skeleton';

const PreviewTool = observer(
  ({ state, status }: { state: IStateStore | null; status: string }) => {
    const previewUrl =
      'https://id-preview--44283e82-135e-4a77-a8d0-871163300657.lovable.app/?forceHideBadge=true';

    const url = PREVIEW_URL_TMPL.replace('{uuid}', state?.id ?? '');
    const isStreaming = status === 'pending';
    return (
      <div className={`w-full h-full`}>
        <div className="bg-gray-200 h-full dark:bg-gray-800 overflow-hidden">
          {/* Toolbar */}
          <div className="bg-white dark:bg-gray-900 px-4 py-2 flex items-center space-x-4">
            {/*<div className="flex space-x-2">*/}
            {/*  <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">*/}
            {/*    <ChevronLeft size={20} />*/}
            {/*  </button>*/}
            {/*  <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">*/}
            {/*    <ChevronRight size={20} />*/}
            {/*  </button>*/}
            {/*</div>*/}
            <div className="flex-grow">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-1 flex items-center">
                <span className="text-green-600 dark:text-green-400 mr-2">
                  ●
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {url}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  window.open(url, '_blank');
                }}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                title="Open in new tab"
              >
                <ExternalLink size={20} />
              </button>
              <button
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                title="Fullscreen"
              >
                <Maximize2 size={20} />
              </button>
              {/*<button*/}
              {/*  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"*/}
              {/*  title="Toggle dark mode"*/}
              {/*  onClick={toggleDarkMode}*/}
              {/*>*/}
              {/*  /!*{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}*!/*/}
              {/*</button>*/}
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white dark:bg-gray-900 flex-grow h-full">
            <div className="w-full relative h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              {/*Web content would be displayed here*/}
              {/*{state}*/}
              {/*status-{status}*/}
              {isStreaming && (
                <Skeleton className="w-full h-full absolute rounded-none z-10 flex items-center justify-center">
                  <Skeleton className="w-24 h-24 rounded-full delay-100" />
                </Skeleton>
              )}
              <iframe
                title="Preview"
                width="100%"
                id="iframe_preview"
                height="100%"
                src={!isStreaming ? url : ''}
                className="h-full"
                sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default PreviewTool;
