import FormView from '@/components/box/form';
import { Metadata, ResolvingMetadata } from 'next';
import { ThemeModeToggle } from '@/components/common/theme-toggle';

export async function generateMetadata(
  _params: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const p = await parent;
  return {
    robots: 'index, follow',
    openGraph: {
      ...(p.openGraph ?? {}),
      url: 'https://jit.dev',
    },
  };
}

export default async function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-2xl mx-auto w-full">
        <FormView kind={'main'} />
      </div>
      <div className="hidden">
        <ThemeModeToggle />
      </div>
    </div>
  );
}
