'use client';



import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";

export function WorkbenchView() {

  const workbenches = [
    {
      id: 1,
      name: "03-mini / BootstrapUI",
      description: "A minimal layout for a three-column layout",
      previewUrl: "https://id-preview--44283e82-135e-4a77-a8d0-871163300657.lovable.app/?forceHideBadge=true",
    },
    {
      id: 2,
      name: "DeepSeek R1 / MaterialUI",
      description: "A large layout for a four-column layout",
      previewUrl: "https://id-preview--44283e82-135e-4a77-a8d0-871163300657.lovable.app/?forceHideBadge=true",
    }
  ]

  return (
    <div className="flex flex-col p-4 space-y-4 ">

      {workbenches.map((workbench) => (
        <div key={workbench.id} className=" h-[600px] flex flex-col w-full">
          <div className="px-2 mb-1 font-normal">{workbench.name}</div>
          <div className="bg-secondary overflow-hidden w-full flex-grow rounded-lg">

            <div className="flex h-12 top-0 py-1.5 items-center px-2 md:px-2 gap-2">
              <Tabs defaultValue="account" className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="account">Preview</TabsTrigger>
                  <TabsTrigger value="password">Code</TabsTrigger>
                  <TabsTrigger value="compiler">Compiler</TabsTrigger>
                  <TabsTrigger value="graph">Graph</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>
                {/*<TabsContent value="account">Make changes to your account here.</TabsContent>*/}
                {/*<TabsContent value="password">Change your password here.</TabsContent>*/}
              </Tabs>
            </div>

            <div className="h-full">
              <iframe title="Preview" width="100%" id="iframe_preview" height="100%"
                      src={workbench.previewUrl}
                      className="h-full"
                      sandbox="allow-scripts allow-forms allow-same-origin allow-modals"></iframe>
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}

export default WorkbenchView;
