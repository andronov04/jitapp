import { Metadata, ResolvingMetadata } from 'next';
import { FaqView } from '@/components/common/faq-view';

export async function generateMetadata(
  _params: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const p = await parent;
  return {
    title: 'FAQ',
    description: '',
    robots: 'noindex, nofollow',
    openGraph: {
      ...(p.openGraph ?? {}),
      title: 'FAQ',
      description: '',
      url: 'https://jit.dev/terms',
    },
  };
}

export default function Page() {
  return (
    <div className="main">
      <FaqView />
    </div>
  );
}
