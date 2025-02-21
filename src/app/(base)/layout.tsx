import BaseHeader from '@/components/common/base-header';
import LogoBlock from '@/components/common/logo-block';
import Link from 'next/link';

export default function PageLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <main className="">
      <BaseHeader>
        <LogoBlock />
        <div className="flex w-1/3 items-center justify-start gap-6 md:justify-center">
          <Link className="text-sm font-medium hover:underline" href="/explore">
            Explore
          </Link>
          <Link
            className="hidden text-sm font-medium hover:underline md:inline"
            href="/generators"
          >
            Generators
          </Link>
          <Link className="text-sm font-medium hover:underline" href="/pricing">
            Pricing
          </Link>
        </div>
      </BaseHeader>
      {children}
    </main>
  );
}
