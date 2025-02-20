import BaseHeader from '@/components/common/base-header';
import LogoBlock from '@/components/common/logo-block';

export default function PageLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <main className="">
      <BaseHeader>
        <LogoBlock />
      </BaseHeader>
      {children}
    </main>
  );
}
