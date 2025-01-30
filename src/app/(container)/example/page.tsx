import { ContainerView } from '@/components/app/container-view';
import { getChatById } from '@/lib/actions/chat';
import { notFound } from 'next/navigation';
import { getMessagesByChatId } from '@/lib/actions/message';
import { convertToUIMessages } from '@/lib/utils';

export const metadata = {
  title: 'Example',
  description: 'Example page',
};

export default async function Page() {
  const id = 'ro0GuQbpsYstVyVPjdPf';
  const chat = await getChatById(id);

  if (!chat) {
    notFound();
  }

  const messagesFromDb = await getMessagesByChatId(id);
  const initialMessages = convertToUIMessages(messagesFromDb);

  return (
    <>
      <ContainerView chatId={id} initialMessages={initialMessages} />
    </>
  );
}
