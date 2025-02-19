import { cookies } from 'next/headers';

// import { Chat } from '@/components/chat';
import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models';
import { DataStreamHandler } from '@/components/chat/data-stream-handler';
import { Chat } from '@/components/chat/chat';
import { generateId } from '@/lib/utils';
// import { DataStreamHandler } from '@/components/data-stream-handler';

export default async function Page() {
  const id = generateId();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;

  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedModelId={selectedModelId}
        selectedVisibilityType="private"
        isReadonly={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
