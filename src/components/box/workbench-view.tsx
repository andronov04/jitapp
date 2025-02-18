'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IWorkbenchStore } from '@/lib/store/workbench';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'framer-motion';
import PreviewTool from '@/components/tools/preview-tool';

const WorkbenchView = observer(
  ({ workbench }: { workbench: IWorkbenchStore }) => {
    const previewUrl = '';
    // const previewUrl = "https://id-preview--44283e82-135e-4a77-a8d0-871163300657.lovable.app/?forceHideBadge=true";
    return (
      <AnimatePresence>
        <motion.div
          className=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div key={workbench.id} className=" h-[600px] flex flex-col w-full">
            {/*<div className="px-2 mb-1 font-normal">{workbench.model?.name}/{workbench.generator?.name}</div>*/}
            <div className="bg-secondary overflow-hidden w-full flex-grow rounded-lg">
              <Tabs defaultValue="preview" className="w-full h-full">
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

                {workbench.tools?.map((item) => (
                  <TabsContent
                    style={{
                      height: 'calc(100% - 44px)',
                    }}
                    value={item.id}
                    key={item.id}
                    className="w-full"
                  >
                    {item.id === 'preview' && (
                      <PreviewTool
                        status={workbench.status}
                        state={workbench.currentState}
                      />
                    )}

                    {item.id === 'code' && (
                      <div>
                        {workbench.currentState?.getFiles.map((file) => (
                          <div key={file.key}>
                            {file.key}-<pre>{file.content}</pre>
                          </div>
                        ))}
                      </div>
                    )}

                    {/*{workbench.currentState?.getFiles.map(file => <div key={file.key}>{file.key}-<pre>{file.value}</pre></div>)}*/}

                    {/*<iframe title="Preview" width="100%" id="iframe_preview" height="100%"*/}
                    {/*        src={previewUrl}*/}
                    {/*        className="h-full"*/}
                    {/*        sandbox="allow-scripts allow-forms allow-same-origin allow-modals"></iframe>*/}
                  </TabsContent>
                ))}

                {/*<TabsContent style={{*/}
                {/*  height: "calc(100% - 44px)",*/}
                {/*}} value="account" className="w-full">*/}
                {/*  <iframe title="Preview" width="100%" id="iframe_preview" height="100%"*/}
                {/*          src={previewUrl}*/}
                {/*          className="h-full"*/}
                {/*          sandbox="allow-scripts allow-forms allow-same-origin allow-modals"></iframe>*/}
                {/*</TabsContent>*/}
                {/*<TabsContent style={{*/}
                {/*  height: "calc(100% - 44px)",*/}
                {/*}} value="password" className="w-full h-full">*/}
                {/*  <iframe title="Preview" width="100%" id="iframe_preview" height="100%"*/}
                {/*          src={"http://localhost:5173/"}*/}
                {/*          className="h-full"*/}
                {/*          sandbox="allow-scripts allow-forms allow-same-origin allow-modals"></iframe>*/}
                {/*</TabsContent>*/}
              </Tabs>

              {/*<div className="flex h-12 top-0 py-1.5 items-center px-2 md:px-2 gap-2">*/}
              {/*  <Tabs defaultValue="account" className="w-[400px]">*/}
              {/*    <TabsList>*/}
              {/*      <TabsTrigger value="account">Preview</TabsTrigger>*/}
              {/*      <TabsTrigger value="password">Code</TabsTrigger>*/}
              {/*      <TabsTrigger value="compiler">Compiler</TabsTrigger>*/}
              {/*      <TabsTrigger value="graph">Graph</TabsTrigger>*/}
              {/*      <TabsTrigger value="summary">Summary</TabsTrigger>*/}
              {/*    </TabsList>*/}
              {/*    <TabsContent value="account" className="w-full h-full">*/}
              {/*      <iframe title="Preview" width="100%" id="iframe_preview" height="100%"*/}
              {/*              src={previewUrl}*/}
              {/*              className="h-full"*/}
              {/*              sandbox="allow-scripts allow-forms allow-same-origin allow-modals"></iframe>*/}
              {/*    </TabsContent>*/}
              {/*    <TabsContent value="password" className="w-full h-full">*/}
              {/*      code*/}
              {/*    </TabsContent>*/}
              {/*  </Tabs>*/}
              {/*</div>*/}

              {/*<div className="h-full">*/}
              {/*  /!*<iframe title="Preview" width="100%" id="iframe_preview" height="100%"*!/*/}
              {/*  /!*        src={previewUrl}*!/*/}
              {/*  /!*        className="h-full"*!/*/}
              {/*  /!*        sandbox="allow-scripts allow-forms allow-same-origin allow-modals"></iframe>*!/*/}
              {/*</div>*/}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  },
);

export default WorkbenchView;
