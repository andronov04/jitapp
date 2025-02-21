'use client';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/hooks/useStores';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMemo, useState } from 'react';
import { IModelStore } from '@/lib/store/model';
import ModelItem from '@/components/app/model-item';
import Link from 'next/link';

const ModelSelector = observer(({ kind = 'form' }: { kind?: string }) => {
  const { app } = useStores();
  const [open, setOpen] = useState(false);

  return (
    <div className=" w-full gap-2 flex justify-end items-center h-full ">
      {kind === 'main' && (
        <div className="label-new-feature text-sm">New feature! Compare →</div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-auto shadow-none justify-between h-11 rounded-2xl"
          >
            <div className="flex flex-row items-center gap-4">
              {app.models
                .filter((model) => model.selected)
                .map((model) => (
                  <>
                    <ModelItem model={model} />
                  </>
                ))}
            </div>
            {!app.models.filter((model) => model.selected).length
              ? 'No model selected'
              : ''}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-background shadow-none p-0">
          <Command className="bg-background">
            <CommandInput placeholder="Search models..." />
            <CommandList>
              <CommandEmpty>No model found.</CommandEmpty>
              <CommandGroup>
                {app.models.map((model) => (
                  <CommandItem
                    key={model.id}
                    value={model.modelKey}
                    onSelect={(currentValue) => {
                      model.setSelected();
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        model.selected ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <ModelItem model={model} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="border-t px-4 text-xs py-2">
            How does the compare feature work, and what are its advantages?{' '}
            <Link href="/faq" className="hover:opacity-80 inline underline">
              Learn more
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});

export default ModelSelector;
