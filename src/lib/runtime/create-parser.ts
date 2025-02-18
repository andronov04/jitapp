import { StreamingMessageParser } from '@/lib/runtime/message-parser';

export const createMessageParser = () => {
  return new StreamingMessageParser({
    callbacks: {
      onArtifactOpen: (data) => {
        // const existingWorkbench = appStore.currentBox?.workbenches.find((wb) => wb.id === parseInt(data.messageId));
        // console.log('onArtifactOpen', data, existingWorkbench); //, getAppStore()
        // if (!existingWorkbench) {
        //   appStore.currentBox?.addWorkbench({
        //     id: parseInt(data.messageId),
        //     status: "streaming",
        //   })
        // }
        // workbenchStore.showWorkbench.set(true);
        // workbenchStore.addArtifact(data);
      },
      onArtifactClose: (data) => {
        // console.log('onArtifactClose');
        // workbenchStore.updateArtifact(data, { closed: true });
      },
      onActionOpen: (data) => {
        // console.log('onActionOpen', data.action);
        // we only add shell actions when when the close tag got parsed because only then we have the content
        // if (data.action.type !== 'shell') {
        //   workbenchStore.addAction(data);
        // }
      },
      onActionClose: (data) => {
        // console.log('onActionClose', data.action);
        //
        // if (data.action.type === 'shell') {
        //   workbenchStore.addAction(data);
        // }
        //
        // workbenchStore.runAction(data);
      },
    },
  });
};
