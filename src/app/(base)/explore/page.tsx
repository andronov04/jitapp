import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  _params: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const p = await parent;
  return {
    title: 'Explore code generations',
    description: 'Explore code, AI trends, and connect with the JIT community.',
    robots: 'index, follow',
    openGraph: {
      ...(p.openGraph ?? {}),
      title: 'Explore code generations',
      description:
        'Explore code, AI trends, and connect with the JIT community.',
      url: 'https://jit.dev/explore',
    },
  };
}

export default async function Page() {
  return <main className="main">Explore</main>;
}
