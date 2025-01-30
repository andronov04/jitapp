'use server';

import { type CoreUserMessage, generateText } from 'ai';
// import { cookies } from 'next/headers'

import { customModel } from '@/lib/ai';
import { VisibilityType } from '@/components/chat/visibility-selector';
import { createAdminClient } from '@/lib/supabase/admin';

// export async function saveModelId(model: string) {
//   const cookieStore = await cookies()
//   cookieStore.set('model-id', model)
// }

export async function generateTitleFromUserMessage({
  message,
}: {
  message: CoreUserMessage;
}) {
  const { text: title } = await generateText({
    model: customModel('gpt-4o-mini'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  const supabaseAdmin = createAdminClient();
  await supabaseAdmin
    .from('chat_model')
    .update({ visibility })
    .eq('id', chatId);
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}

export const getChatById = async (id: string) => {
  const supabaseAdmin = createAdminClient();
  const { data: chat, error } = await supabaseAdmin
    .from('chat_model')
    .select('*')
    .eq('id', id)
    .single();
  if (!chat) return null;
  return chat;
};

export async function getChatsByUserId(userId: string) {
  const supabaseAdmin = createAdminClient();
  const { data: chats, error } = await supabaseAdmin
    .from('chat_model')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) {
    console.error('Failed to get chats by user from database');
    throw error;
  }
  return chats;
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  const supabaseAdmin = createAdminClient();

  const { data: chat, error } = await supabaseAdmin
    .from('chat_model')
    .insert({
      id,
      user_id: userId,
      title,
    })
    .single();
  if (error) {
    console.error('Failed to save chat in database');
    throw error;
  }
  return chat;
}

export async function deleteChatById(id: string) {
  const supabaseAdmin = createAdminClient();
  const { error: errorMsg } = await supabaseAdmin
    .from('message')
    .delete()
    .eq('chat_id', id);
  if (errorMsg) {
    console.error('Failed to delete messages by chat id from database');
    throw errorMsg;
  }
  const { error: errorChat } = await supabaseAdmin
    .from('chat_model')
    .delete()
    .eq('id', id);
  if (errorChat) {
    console.error('Failed to delete chat by id from database');
    throw errorChat;
  }
}
