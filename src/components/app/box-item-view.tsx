import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import ImageSkeleton from '@/components/common/image-skeleton';
import AvatarBlock from '@/components/common/avatar-block';
import BoxItemInfoView from '@/components/app/box-item-info-view';

const BoxItemView = observer(({ item }: { item?: any }) => {
  // const {} = useStores();
  // const toUrl = repo.migrated ? `/${repo.owner.username}/${repo.slug}` : `/i/${repo.slug}`;
  const toUrl = `/i/${item.slug}`;

  return (
    <div className="overflow-hidden rounded-md">
      <Link href={toUrl}>
        <div className="relative aspect-video w-full flex-none overflow-hidden rounded-t-md border">
          <ImageSkeleton
            style={{ width: 'inherit' }}
            src={item.meta?.images?.preview || item.meta?.images?.prevPreview}
            alt={item.name}
            className="select-none h-full object-cover object-top"
          />
        </div>
      </Link>
      <div className="relative h-14 w-full flex-none rounded-b-md border-x	border-b px-2 pb-2 pt-3 ">
        <BoxItemInfoView item={item} />
        <div className="flex items-center gap-0.5 text-xs">
          <p className="truncate">
            <Link href={toUrl} className="truncate hover:underline">
              {item.name}
            </Link>
          </p>
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-xs">
          <AvatarBlock
            customSrc={item.user?.avatar}
            id={item.userId}
            className="h-3.5 w-3.5 rounded-full"
          />
          <Link
            className="truncate text-blue-600 hover:underline"
            href={`/${item.user?.username}`}
          >
            {item.user?.username ?? 'User'}
          </Link>
        </div>
      </div>
    </div>
  );
});

export default BoxItemView;
