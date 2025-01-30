'use client';

import { CodeEditor } from '@/components/chat/code-editor';

export function CodeView() {
  const isCurrentVersion = true;
  const currentVersionIndex = 0;

  return (
    <div>
      <CodeEditor
        content={
          isCurrentVersion
            ? "print('Hello, world!');\n" +
              'while True:\n' +
              "    print('Hello, world!')\n" +
              '    sleep(1)\n' +
              ''
            : ''
        }
        isCurrentVersion={isCurrentVersion}
        currentVersionIndex={currentVersionIndex}
        status={'idle'}
        saveContent={() => {}}
        suggestions={[]}
      />
    </div>
  );
}
