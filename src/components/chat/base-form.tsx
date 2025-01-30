'use client';
import { memo, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { generateId } from 'ai';
import { useLocalStorage } from 'usehooks-ts';

function PureBaseForm() {
  const [prompt, setPrompt] = useState('');
  const router = useRouter();
  // const [localStorageInput, setLocalStorageInput] = useLocalStorage(
  //   'input',
  //   '',
  // );

  return (
    <div className="space-y-1.5">
      <Textarea
        placeholder={'Write your prompt here...'}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        className="resize-none !w-[500px] shadow-none"
      />
      <Button
        onClick={() => {
          if (!prompt?.length) return;
          console.log(prompt);
          (window as any).jitPrompt = prompt;
          setPrompt('');
          router.push(`/i/${generateId()}-`);
        }}
      >
        Send
      </Button>
    </div>
  );
}

export const BaseForm = memo(PureBaseForm);
