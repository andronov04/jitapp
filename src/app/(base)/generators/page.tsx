import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  _params: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const p = await parent;
  return {
    title: 'AI Code Generators',
    description:
      'Empower your projects with AI Code Generators, turning text to code effortlessly. Boost productivity and streamline development with smart, automated solutions.',
    robots: 'index, follow',
    openGraph: {
      ...(p.openGraph ?? {}),
      title: 'AI Code Generators',
      description:
        'Empower your projects with AI Code Generators, turning text to code effortlessly. Boost productivity and streamline development with smart, automated solutions.',
      url: 'https://jit.dev/generators',
    },
  };
}

export default async function Page() {
  return <main className="main">Generators</main>;
}
