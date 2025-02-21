'use client';
import { observer } from 'mobx-react-lite';
import { IStateStore } from '@/lib/store/state';
import {
  ExternalLink,
  EyeClosedIcon,
  EyeIcon,
  Maximize2,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { PREVIEW_URL_TMPL } from '@/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { generateUuid } from '@/lib/utils';

const PreviewTool = observer(
  ({ state, status }: { state: IStateStore | null; status: string }) => {
    const [randomHash, setRandomHash] = useState('');
    const [hide, setHide] = useState(false);

    const url = PREVIEW_URL_TMPL.replace('{uuid}', state?.id ?? '');
    const isStreaming = status === 'streaming';
    return (
      <div className="bg-gray-200 flex-grow flex flex-col h-full w-full dark:bg-gray-800 overflow-hidden">
        {/* Toolbar */}
        <div className=" h-9 dark:bg-gray-900 bg-gray-200 px-2 py-1 flex items-center space-x-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setHide(!hide)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            >
              {!hide ? <EyeIcon size={20} /> : <EyeClosedIcon size={20} />}
            </button>
            <button
              onClick={() => setRandomHash(generateUuid())}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            >
              <RotateCw size={20} />
            </button>
          </div>
          <div className="flex-grow truncate h-full flex items-center">
            <div className="bg-gray-100 w-full  truncate text-sm text-gray-600 dark:text-gray-300  dark:bg-gray-700 rounded-full px-4 py-1 flex items-center">
              {url}
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
            {/*<button*/}
            {/*  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"*/}
            {/*  title="Fullscreen"*/}
            {/*>*/}
            {/*  <Maximize2 size={20}/>*/}
            {/*</button>*/}
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
        <div className="bg-white dark:bg-gray-900 flex-grow flex flex-col h-full">
          <div className="h-full flex-grow relative flex flex-col">
            {/*Web content would be displayed here*/}
            {/*{state}*/}
            {/*status-{status}*/}
            {isStreaming && (
              <Skeleton className="w-full h-full absolute rounded-none z-10 flex items-center justify-center">
                <Skeleton className="w-24 h-24 rounded-full delay-100" />
              </Skeleton>
            )}
            {!hide ? (
              <iframe
                // onLoad={(e) => {
                //   console.log("iframe", e);
                // }}
                title="Preview"
                width="100%"
                id="iframe_preview"
                height="100%"
                src={!isStreaming ? `${url}?i=${randomHash}` : ''}
                className="h-full iframe flex-grow"
                sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
              ></iframe>
            ) : (
              <div className="h-full flex-grow flex-col w-full flex items-center justify-center">
                <p>Preview is hidden</p>
                <div className="text-sm text-muted-foreground">
                  Click the eye icon to show it
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default PreviewTool;
