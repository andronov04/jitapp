'use client';

import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ArtifactView({ messageId }: { messageId: string }) {
  // TODO handle state if not current
  return (
    <Button
      onClick={() => {
        const target = document.querySelector(
          `[data-id="${messageId}"].workbench`,
        );
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      variant="outline"
      className="flex items-center my-1.5 gap-2"
    >
      Show
      <ArrowRightIcon className="mr-2 h-4 w-4" />
    </Button>
  );
}
