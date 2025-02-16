import { memo, useMemo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
// import type { BundledLanguage } from 'shiki';
// import { createScopedLogger } from '~/utils/logger';
// import { rehypePlugins, remarkPlugins, allowedHTMLElements } from '~/utils/markdown';
// import { Artifact } from './Artifact';
// import { CodeBlock } from './CodeBlock';

// import styles from './Markdown.module.scss';
import {allowedHTMLElements, rehypePlugins, remarkPlugins} from "@/lib/llm/utils/markdown";

// const logger = createScopedLogger('MarkdownComponent');

interface MarkdownProps {
  children: string;
  html?: boolean;
  limitedMarkdown?: boolean;
}

export const NewMarkdown = memo(({ children, html = false, limitedMarkdown = false }: MarkdownProps) => {
  // logger.trace('Render');

  const components = useMemo(() => {
    return {
      div: ({ className, children, node, ...props }) => {
        console.log("classNamsse", className);
        if (className?.includes('__jitProject__')) {
          const messageId = node?.properties.dataMessageId as string;

          if (!messageId) {
            // logger.error(`Invalid message id ${messageId}`);
          }

          return <div>Artifact-{messageId}</div>;
          // return <Artifact messageId={messageId} />;
        }

        return (
          <div className={className} {...props}>
            {children}
          </div>
        );
      },
      pre: (props) => {
        const { children, node, ...rest } = props;

        const [firstChild] = node?.children ?? [];

        if (
          firstChild &&
          firstChild.type === 'element' &&
          firstChild.tagName === 'code' &&
          firstChild.children[0].type === 'text'
        ) {
          const { className, ...rest } = firstChild.properties;
          const [, language = 'plaintext'] = /language-(\w+)/.exec(String(className) || '') ?? [];

          return <pre {...rest}>{firstChild.children[0].value}</pre>;
          // return <CodeBlock code={firstChild.children[0].value} language={language as BundledLanguage} {...rest} />;
        }

        return <pre {...rest}>{children}</pre>;
      },
    } satisfies Components;
  }, []);

  return (
    <ReactMarkdown
      allowedElements={allowedHTMLElements}
      // className={styles.MarkdownContent}
      components={components}
      remarkPlugins={remarkPlugins(limitedMarkdown)}
      rehypePlugins={rehypePlugins(html)}
    >
      {children}
    </ReactMarkdown>
  );
});
