'use client';

import Link from 'next/link';
import millify from 'millify';
import { useStores } from '@/hooks/useStores';
import { useMemo } from 'react';
import ModelItem from '@/components/app/model-item';

export default function BoxItemInfoView({ item }: { item: any }) {
  const { app } = useStores();
  const usedModels = useMemo(
    () =>
      app.models.filter((m) =>
        (item.useModels ?? []).map((b) => b.id).includes(m.id),
      ),
    [],
  );
  console.log('used models', usedModels, item);
  return (
    <div className="bg-background absolute -top-12 left-2 flex h-10 items-center gap-1.5 rounded-sm border px-1.5 text-sm">
      {/*<div className="absolute -top-4 left-1 text-xs text-muted-foreground">*/}
      {/*  Used models*/}
      {/*</div>*/}
      <div className="flex flex-row items-center gap-3">
        {usedModels.map((model) => (
          <ModelItem model={model} />
        ))}
      </div>
      {/*{repo.page?.meta?.tab && (*/}
      {/*  <Link className="hover:underline" href={`/${repo.page.slug}`}>*/}
      {/*    {repo.page.meta.tab}*/}
      {/*  </Link>*/}
      {/*)}*/}
      {/*{repo.numViews > 1*/}
      {/*  ? [*/}
      {/*    <div key={`${repo.id}-views`} className="bg-secondary h-full w-[1px]" />,*/}
      {/*    <div key={`${repo.id}-c-views`} className="flex items-center gap-1">*/}
      {/*      <EyeOpenIcon className="h-3 w-3" />*/}
      {/*      <span className="text-gray-400">{millify(repo.numViews)}</span>*/}
      {/*    </div>,*/}
      {/*  ]*/}
      {/*  : null}*/}
      {/*{repo.numLikes*/}
      {/*  ? [*/}
      {/*    <div key={`${repo.id}-likes`} className="bg-secondary h-full w-[1px]" />,*/}
      {/*    <div key={`${repo.id}-c-likes`} className="flex items-center gap-1">*/}
      {/*      <HeartIcon className="h-3 w-3" />*/}
      {/*      <span className="text-gray-400">{millify(repo.numLikes)}</span>*/}
      {/*    </div>,*/}
      {/*  ]*/}
      {/*  : null}*/}
      {/*{repo.numForks*/}
      {/*  ? [*/}
      {/*    <div key={`${repo.id}-forks`} className="bg-secondary h-full w-[1px]" />,*/}
      {/*    <div key={`${repo.id}-c-forks`} className="flex items-center gap-1">*/}
      {/*      <ForkIcon className="h-3 w-3" />*/}
      {/*      <span className="text-gray-400">{millify(repo.numForks)}</span>*/}
      {/*    </div>,*/}
      {/*  ]*/}
      {/*  : null}*/}
      {/*{repo.numCommits > 1*/}
      {/*  ? [*/}
      {/*    <div key={`${repo.id}-commits`} className="bg-secondary h-full w-[1px]" />,*/}
      {/*    <div key={`${repo.id}-c-commits`} className="flex items-center gap-1">*/}
      {/*      <CommitIcon className="h-3 w-3" />*/}
      {/*      <span className="text-gray-400">{millify(repo.numCommits)}</span>*/}
      {/*    </div>,*/}
      {/*  ]*/}
      {/*  : null}*/}
    </div>
  );
}
