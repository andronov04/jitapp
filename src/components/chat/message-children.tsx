import { observer } from 'mobx-react-lite';
import { IMessageStore } from '@/lib/store/message';
import { PreMarkdown } from '@/components/chat/pre-markdown';
import { cn } from '@/lib/utils';
import { FailedAlert } from '@/components/app/failed-alert';

const MessageChildren = observer(
  ({
    message,
  }: {
    message: IMessageStore;
  }) => {
    return (
      <div key={message.id} className="pt-1 first:pt-0">
        <div
          className={cn(
            message.status === 'failed' ? 'text-red-600' : 'text-green-600',
            'flex items-center gap-2 font-semibold',
          )}
        >
          {message.model?.modelLabel || 'AI'}
          {message.status === 'streaming' && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-700  opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
            </span>
          )}
        </div>
        <div>
          {message.status === 'failed' ? (
            <div className="mt-1">
              {message.failed && <FailedAlert data={message.failed} />}
            </div>
          ) : (
            <PreMarkdown content={message.fullContent} />
          )}
        </div>
      </div>
    );
  },
);
export default MessageChildren;
