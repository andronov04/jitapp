'use server';

import { type CoreUserMessage, generateText } from 'ai';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';

export async function getMessagesByChatId(id: string) {
  const supabaseAdmin = createAdminClient();
  const { data: messages, error } = await supabaseAdmin
    .from('message_model')
    .select('*')
    .eq('chat_id', id)
    .order('created_at', { ascending: true })
    .limit(25);
  if (error) throw error;
  return messages;
}

export async function saveMessages({ messages }: { messages: Array<any> }) {
  const supabaseAdmin = createAdminClient();
  const { data: messagesSaved, error } = await supabaseAdmin
    .from('message_model')
    .insert(messages);
  console.log('saveMessages-error', error);
  if (error) throw error;
  return messagesSaved;
}

export async function getMessageById(id: string) {
  const supabaseAdmin = createAdminClient();
  const { data: message, error } = await supabaseAdmin
    .from('message_model')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return message;
}
