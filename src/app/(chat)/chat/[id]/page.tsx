import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models';
import { convertToUIMessages } from '@/lib/utils';
import { auth } from '@/lib/supabase/auth';
import { getChatById } from '@/lib/actions/chat';
import { getMessagesByChatId } from '@/lib/actions/message';
import { Chat } from '@/components/chat/chat';
import { DataStreamHandler } from '@/components/chat/data-stream-handler';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById(id);

  if (!chat) {
    notFound();
  }

  const session = await auth();
  if (chat.visibility === 'private') {
    if (!session || !session.id) {
      return notFound();
    }

    if (session.id !== chat.user_id) {
      return notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId(id);

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;
  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={convertToUIMessages(messagesFromDb)}
        selectedModelId={selectedModelId}
        selectedVisibilityType={chat.visibility}
        isReadonly={session?.id !== chat.user_id}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
