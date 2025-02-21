'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IWorkbenchStore } from '@/lib/store/workbench';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'framer-motion';
import PreviewTool from '@/components/tools/preview-tool';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import CodeTool from '@/components/tools/code-tool';
import { useStores } from '@/hooks/useStores';
import ModelItem from '@/components/app/model-item';

const WorkbenchView = observer(
  ({ workbench, count }: { workbench: IWorkbenchStore; count: number }) => {
    const { app } = useStores();
    const [activeTab, setActiveTab] = useState('preview');
    const previewUrl = '';
    // const previewUrl = "https://id-preview--44283e82-135e-4a77-a8d0-871163300657.lovable.app/?forceHideBadge=true";
    const currentModel = useMemo(
      () => app.getModelByStateId(workbench.currentState?.id ?? ''),
      [workbench.currentState?.id],
    );

    return (
      <AnimatePresence>
        <motion.div
          className=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            data-id={workbench.id}
            key={workbench.id}
            className={cn(
              count > 1
                ? 'wb-part-min-height wb-part-max-height'
                : 'wb-full-min-height wb-full-max-height',
              'h-full  flex workbench flex-col w-full',
            )}
          >
            {/*<div className="px-2 mb-1 font-normal">{workbench.message}</div>*/}
            <div className="bg-secondary flex flex-col overflow-hidden w-full flex-grow rounded-lg">
              <div className="flex w-full justify-between items-center">
                <Tabs
                  onValueChange={setActiveTab}
                  defaultValue={activeTab}
                  className="w-full"
                >
                  <TabsList>
                    {workbench.tools?.map((item) => (
                      <TabsTrigger key={item.id} value={item.id}>
                        {item.name}
                      </TabsTrigger>
                    ))}
                    {/*<TabsTrigger value="account">Preview</TabsTrigger>*/}
                    {/*<TabsTrigger value="password">Code</TabsTrigger>*/}
                    {/*<TabsTrigger value="compiler">Compiler</TabsTrigger>*/}
                    {/*<TabsTrigger value="graph">Graph</TabsTrigger>*/}
                    {/*<TabsTrigger value="summary">Summary</TabsTrigger>*/}
                  </TabsList>
                </Tabs>
                <div className="pr-2">
                  {currentModel?.id && <ModelItem model={currentModel} />}
                </div>
              </div>

              <div className="flex-grow w-full flex flex-col flex-nowrap">
                {workbench.tools?.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      item.id === activeTab ? 'flex' : 'hidden',
                      ' basis-full flex-grow flex-col h-full w-full',
                    )}
                  >
                    {item.id === 'preview' && (
                      <PreviewTool
                        status={workbench.status}
                        state={workbench.currentState}
                      />
                    )}

                    {item.id === 'code' && (
                      <div
                        className={cn(
                          item.id === activeTab ? 'flex' : 'hidden',
                          'basis-full flex-grow flex-col h-full w-full',
                        )}
                      >
                        <CodeTool
                          status={workbench.status}
                          state={workbench.currentState}
                        />
                        {/*{workbench.currentState?.getFiles.map((file) => (*/}
                        {/*  <div key={file.key}>*/}
                        {/*    {file.key}-<pre>{file.content}</pre>*/}
                        {/*  </div>*/}
                        {/*))}*/}
                      </div>
                    )}

                    {/*{workbench.currentState?.getFiles.map(file => <div key={file.key}>{file.key}-<pre>{file.value}</pre></div>)}*/}

                    {/*<iframe title="Preview" width="100%" id="iframe_preview" height="100%"*/}
                    {/*        src={previewUrl}*/}
                    {/*        className="h-full"*/}
                    {/*        sandbox="allow-scripts allow-forms allow-same-origin allow-modals"></iframe>*/}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  },
);

export default WorkbenchView;
