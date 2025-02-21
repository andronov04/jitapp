import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SymbolBlock from '@/components/common/symbol-block';

export default function GeneratorItem({ item }: { item: any }) {
  return (
    <div
      className="flex aspect-square w-full flex-col items-center justify-center rounded-md border p-4"
      key={item.id}
    >
      <div className="relative flex w-full items-end gap-1 text-left">
        <SymbolBlock
          symbol={item.meta.code ?? 'UN'}
          fill={item.meta.color ?? 'red'}
        />
        <p className="text-sm">{item.meta.shortName}</p>
      </div>
      <div className="flex-1">{/*content*/}</div>
      <div className="w-full">
        <Link href={`/${item.slug}`}>
          <Button className="flex w-full gap-1 shadow-none">
            <span>Generate</span>{' '}
            <span style={{ color: item.meta.color ?? 'red' }} className="py-2">
              {item.meta.tab}
            </span>{' '}
            code
          </Button>
        </Link>
      </div>
    </div>
  );
}
