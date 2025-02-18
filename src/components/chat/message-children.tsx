import { observer } from 'mobx-react-lite';
import { VisibilityType } from '@/components/chat/visibility-selector';
import { IMessageStore } from '@/lib/store/message';
import { useEffect } from 'react';
import { PreMarkdown } from '@/components/chat/pre-markdown';

const MessageChildren = observer(
  ({
    message,
  }: {
    message: IMessageStore;
  }) => {
    // useEffect(() => {
    //   if (message.status === 'created' && message.role === 'assistant') {
    //     message.generateStreaming(message.streamCallback);
    //   }
    // }, [message.status]);

    return (
      <div>
        <PreMarkdown content={message.fullContent} />
        {/*{message.status === 'created' && (*/}
        {/*  <div>*/}
        {/*    Created*/}
        {/*  </div>*/}
        {/*)}*/}
        {/*{message.status === 'streaming' && (*/}
        {/*  <div>*/}
        {/*    Streaming*/}
        {/*  </div>*/}
        {/*)}*/}
        {/*{message.status === 'completed' && (*/}
        {/*  <div>*/}
        {/*    Completed*/}
        {/*  </div>*/}
        {/*)}*/}
        {/*{message.status === 'failed' && (*/}
        {/*  <div>*/}
        {/*    Failed*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    );
  },
);
export default MessageChildren;
