import { notFound } from 'next/navigation';
import prisma from '@/prisma';
import Box from '@/components/box/box';
import { getBoxStateBySlug } from '@/lib/actions/box';
import { getMessageState } from '@/lib/actions/state';
import { setCookies } from '@/lib/actions/cookies';
import { cookies } from 'next/headers';

export default async function Post({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const temp = (await searchParams).t;
  let data = {};
  if (!temp) {
    const box = await getBoxStateBySlug(slug);
    const lastMessage = box.messages[box.messages.length - 1];
    const states = lastMessage?.children
      ? await Promise.all(
          lastMessage.children.map(async (child: any) => {
            return getMessageState(child.id);
          }),
        )
      : [];
    data = { box, messageStates: states.filter((a) => a) };
  }

  const cookieStore = await cookies();
  const boxSectionWidth = cookieStore.get('jit-box-section-width');

  return (
    <>
      <Box
        data={data}
        config={{ boxSectionWidth: parseFloat(boxSectionWidth?.value ?? '33') }}
      />
    </>
  );
}
