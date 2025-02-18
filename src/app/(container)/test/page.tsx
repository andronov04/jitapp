import { Box } from '@/components/box/box';
import TestView from '@/components/box/test';

export const metadata = {
  title: 'Test',
};

export default async function Page() {
  return (
    <>
      <TestView />
    </>
  );
}
