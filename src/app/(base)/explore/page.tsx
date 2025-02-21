import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import ExploreView from '@/components/app/explore-view';
import { getFeaturedBoxes } from '@/lib/actions/box';

export async function generateMetadata(
  _params: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const p = await parent;
  return {
    title: 'Explore Chatboxes',
    description: 'Explore code, AI trends, and connect with the JIT community.',
    robots: 'index, follow',
    openGraph: {
      ...(p.openGraph ?? {}),
      title: 'Explore Chatboxes',
      description:
        'Explore code, AI trends, and connect with the JIT community.',
      url: 'https://jit.dev/explore',
    },
  };
}

export default async function Page() {
  const items = await getFeaturedBoxes();
  return (
    <main className="main">
      <ExploreView items={items} />
    </main>
  );
}
