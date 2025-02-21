'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { type } from 'node:os';
import BoxItemView from '@/components/app/box-item-view';

export default function ExploreView({ items }: { items: any[] }) {
  const searchParams = useSearchParams();
  const startFilter = {
    search: searchParams.get('q') || '',
    type: searchParams.get('t') || 'featured',
    generators: (searchParams.get('p')
      ? new Set(searchParams.get('p')?.split(','))
      : new Set()) as Set<string>,
  };
  const [filter, setFilter] = useState<any>(startFilter);
  const [filterDebounced, setDebouncedFilter] = useState<any>(startFilter);

  const onDebounce = () => {
    setDebouncedFilter(filter);
    const searchParams = new URLSearchParams();
    if (filter.search) searchParams.set('q', filter.search);
    if (filter.type === 'all') {
      searchParams.set('t', filter.type);
    } else {
      searchParams.delete('t');
    }
    if (filter.generators && filter.generators?.size > 0)
      searchParams.set('p', Array.from(filter.generators).join(','));

    const q = searchParams.toString();
    const newUrl = `${window.location.pathname}${q ? `?${q}` : ''}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-medium">
          Explore.{' '}
          <span className="text-muted-foreground font-normal">
            Code ideas together.
          </span>
        </h1>
      </div>
      <div className="my-4">
        {/*<ToolbarItems onDebounce={onDebounce} filter={filter} setFilter={setFilter} />*/}
      </div>

      <div className="mt-2 grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        {items.map((item, i) => (
          <BoxItemView key={item.id} item={item} />
        ))}
        {/*<ItemsView featured={filter.type === "featured"} filter={filterDebounced} />*/}
      </div>
    </>
  );
}
