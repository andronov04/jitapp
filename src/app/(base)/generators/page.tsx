import { Metadata, ResolvingMetadata } from 'next';
import { getActiveGenerators } from '@/lib/actions/generator';
import GeneratorItem from '@/components/app/generator-item';

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
  const items = await getActiveGenerators();

  return (
    <main className="main">
      <div>
        <h1 className="text-2xl font-medium">
          Generators.{' '}
          <span className="text-muted-foreground font-normal">
            The smart way to code with AI.
          </span>
        </h1>
      </div>
      <div className="grid mt-2 w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <div key={item.id}>
            <GeneratorItem key={item.id} item={item} />
          </div>
        ))}
      </div>
    </main>
  );
}
