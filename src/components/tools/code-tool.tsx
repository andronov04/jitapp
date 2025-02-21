'use client';
import { observer } from 'mobx-react-lite';
import { IStateStore } from '@/lib/store/state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeView from './code/code-view';
import { MessageCircleWarningIcon } from 'lucide-react';

const CodeTool = observer(
  ({ state, status }: { state: IStateStore | null; status: string }) => {
    const firstFile = state?.getFiles.find(
      (a) => a.pathFile.includes('index') || a.pathFile.includes('main'),
    );
    return (
      <div className="bg-gray-200 flex-grow flex flex-col h-full w-full dark:bg-gray-800 overflow-hidden">
        <Tabs
          defaultValue={
            firstFile?.key || state?.getFiles?.[0]?.key || 'index.html'
          }
          className="w-full"
        >
          <TabsList className="bg-gray-200 h-9 dark:bg-gray-900 shadow-none w-full p-0 justify-start rounded-none">
            {/*<TabsTrigger value="account">Account</TabsTrigger>*/}

            {state?.getFiles.map((file) => (
              <TabsTrigger
                className="data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-none h-full rounded-none shadow-none"
                value={file.key}
              >
                {file.pathFile || file.key}
              </TabsTrigger>
            ))}
          </TabsList>
          {state?.getFiles.map((file) => (
            <TabsContent className="p-0 m-0" value={file.key}>
              <div className="flex h-full w-full flex-col">
                <div className="h-6 flex items-center w-full text-xs truncate  justify-start border-t px-0.5 bg-yellow-500 text-black">
                  The code editing feature is temporarily disabled and will be
                  available again soon. Stay tuned!
                </div>
                <CodeView
                  code={file.content}
                  fileName={file.pathFile || file.key}
                  changeCode={(newContent: string) => {
                    console.log(newContent);
                    // handleCodeChange(f.key, newContent);
                  }}
                />
                <div className="flex h-6 min-h-6 w-full  items-center  justify-end border-t px-0.5">
                  {/*<CopyTooltip text={f.value} />*/}
                  {/*Temporarily edit code disabled, soon will be available, stay tuned!*/}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  },
);

export default CodeTool;
