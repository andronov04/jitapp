'use server';

import { type CoreUserMessage, generateText } from 'ai';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import prisma from '@/prisma';

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

export async function getMessageForStream(id: string): Promise<any> {
  return prisma.message.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      boxId: true,
      model: {
        select: {
          id: true,
          key: true,
        },
      },
      generator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getMessagesForStream(boxId: string): Promise<any> {
  const selector = {
    id: true,
    content: true,
    // createdAt: true,
    userId: true,
    role: true,
    status: true,
  };

  return prisma.message.findMany({
    where: {
      boxId,
      parentMessageId: null,
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      ...selector,
      // parentMessageId: true,
      children: {
        select: {
          ...selector,
        },
      },
    },
  });
}
