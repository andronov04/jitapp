import React, { memo } from 'react';
import { NewMarkdown } from '@/components/chat/new-markdown';

const NonPreMemoizedMarkdown = ({ content }: { content: string }) => {
  let result: string | any[] = content;

  if (Array.isArray(result)) {
    return (
      <div>
        {result.map((item, index) => (
          <div key={index}>
            {item.id}
            <NewMarkdown html>{item.content || item}</NewMarkdown>
          </div>
        ))}
      </div>
    );
  }

  return <NewMarkdown html>{result}</NewMarkdown>;
};

export const PreMarkdown = memo(
  NonPreMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.content === nextProps.content,
);
