import CodeMirror from '@uiw/react-codemirror';
import { html as htmlCode } from '@codemirror/lang-html';
import { javascript as jsCode } from '@codemirror/lang-javascript';
import { css as cssCode } from '@codemirror/lang-css';
import { python as pythonCode } from '@codemirror/lang-python';
import { java as javaCode } from '@codemirror/lang-java';
import { cpp as cppCode } from '@codemirror/lang-cpp';
import { php as phpCode } from '@codemirror/lang-php';
import { rust as rustCode } from '@codemirror/lang-rust';
import { go as goCode } from '@codemirror/lang-go';
// @ts-ignore
import { csharp as csharpCode } from '@replit/codemirror-lang-csharp';
import { basicLight, basicDark } from '@uiw/codemirror-theme-basic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toast } from 'sonner';
// @ts-ignore
import { debounce } from 'lodash';
import { useTheme } from 'next-themes';
import { useStores } from '@/hooks/useStores';
import { useWindowSize } from 'usehooks-ts';

function detectLanguage(fileName: string) {
  const name = fileName.trim();

  if (
    name.endsWith('.html') ||
    name.endsWith('.htm') ||
    name.endsWith('.svg')
  ) {
    return [htmlCode()];
  } else if (
    name.endsWith('.js') ||
    name.endsWith('.ts') ||
    name.endsWith('.jsx') ||
    name.endsWith('.tsx')
  ) {
    return [jsCode()];
  } else if (
    name.endsWith('.css') ||
    name.endsWith('.scss') ||
    name.endsWith('.less')
  ) {
    return [cssCode()];
  } else if (name.endsWith('.java') || name.endsWith('.scale')) {
    return [javaCode()];
  } else if (name.endsWith('.py') || name.endsWith('.python')) {
    return [pythonCode()];
  } else if (name.endsWith('.cpp') || name.endsWith('.h')) {
    return [cppCode()];
  } else if (name.endsWith('.cs')) {
    return [csharpCode()];
  } else if (name.endsWith('.php')) {
    return [phpCode()];
  } else if (name.endsWith('.rs') || name.endsWith('.rust')) {
    return [rustCode()];
  } else if (name.endsWith('.go')) {
    return [goCode()];
  }

  return [];
}

const debounceAllowed = debounce(() => {
  toast.warning('To continue, you need to fork this Code Generation.');
}, 500);

const CodeView = observer(
  ({
    code,
    fileName,
    theme,
    changeCode,
  }: {
    code: string;
    theme?: string;
    fileName: string;
    changeCode: Function;
  }) => {
    const { app } = useStores();
    const th = useTheme();
    const refContainer = useRef<HTMLDivElement | null>(null);
    const size = useWindowSize();
    const [height, setHeight] = useState(0);
    const [language] = useState(() => detectLanguage(fileName));
    const onChange = useCallback(
      (val: string) => {
        // if (repo.ownerId !== app.currentUser?.id) {
        //   debounceAllowed();
        //   return;
        // }
        changeCode(val);
      },
      [changeCode],
    );

    useEffect(() => {
      setHeight(refContainer.current?.clientHeight || 0);
    }, [size, refContainer, setHeight]);

    return (
      <div
        ref={refContainer}
        className="code-view code-view-light h-full w-full"
      >
        <CodeMirror
          theme={theme || th.resolvedTheme === 'dark' ? basicDark : basicLight}
          value={code}
          readOnly={false}
          // readOnly={repo.isBusy || repo.isGenerating || !app.isAuthenticated}
          height={`${height}px`}
          basicSetup={{
            lineNumbers: false,
          }}
          extensions={language}
          onChange={onChange}
        />
      </div>
    );
  },
);

export default CodeView;
