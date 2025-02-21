import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  _params: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const p = await parent;
  const description =
    'Find the plan for you. Start free, no credit card required.';
  return {
    title: 'JIT Pricing',
    description,
    openGraph: {
      ...(p.openGraph ?? {}),
      title: 'JIT Pricing',
      description,
      url: 'https://jit.dev/pricing',
    },
  };
}

export default function Page() {
  return <div className="main">Pricing</div>;
}
