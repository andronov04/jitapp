import { NextResponse } from 'next/server';
import { generateId } from '@/lib/utils';
import prisma from '@/prisma';
import { generateTitleFromUserMessage } from '@/lib/actions/chat';
import { auth } from '@/lib/actions/auth';

export const maxDuration = 360;

export async function POST(request: Request) {
  const {
    input,
    boxId,
    messages,
  }: { input: string; boxId: string; messages: any[] } = await request.json();

  const currentUser = await auth();

  if (!currentUser || !currentUser.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  // const ge
  const title = await generateTitleFromUserMessage({
    message: { content: input, role: 'user' },
  });

  let box = await prisma.box.findFirst({
    where: {
      id: boxId,
    }, // TODO: validation by user private and etc
  });
  if (!box) {
    box = await prisma.box.create({
      data: {
        id: boxId,
        name: title,
        userId: currentUser.id,
        description: '',
        createdAt: new Date(),
        slug: generateId(),
      },
    });
  }

  // let userMessageId: string | undefined = undefined;
  const newMessages = [];
  for (const message of messages) {
    if (message.role === 'user') {
      const userMessage = await prisma.message.create({
        data: {
          id: message.id,
          role: 'user' as any,
          kind: 'user' as any,
          content: input,
          userId: currentUser.id,
          status: 'completed',
          createdAt: new Date(),
          boxId: boxId,
        },
      });
      // userMessageId = userMessage.id;
      newMessages.push({
        role: userMessage.role,
        id: userMessage.id,
        status: 'completed',
      });
    } else {
      const parentMessage = await prisma.message.create({
        data: {
          id: message.id,
          role: message.role as any,
          kind: 'group',
          content: '',
          userId: currentUser.id,
          status: 'completed',
          createdAt: new Date(),
          boxId: boxId,
        },
      });
      // console.log("userMessageId", userMessageId);
      await prisma.message.createMany({
        data: message.children?.map((child: any) => ({
          id: child.id,
          role: 'assistant' as any,
          // role: child.role as any,
          kind: 'ai',
          content: '',
          // userMessageId,
          generatorId: child.generatorId,
          userId: currentUser.id,
          modelId: child.modelId,
          createdAt: new Date(),
          boxId: boxId,
          parentMessageId: parentMessage.id,
          status: 'created',
        })),
      });
      newMessages.push({
        role: parentMessage.role,
        id: parentMessage.id,
        status: 'completed',
        children: message.children.map((child: any) => ({
          id: child.id,
          role: child.role as any,
          status: 'ready',
        })),
      });
    }
  }

  /**
   * FLow
   * 1. Check bad data
   * 2. Create user message
   * 3. Create parent assistant message
   * 4. Create box
   */

  return NextResponse.json({ box, messages: newMessages }, { status: 200 });
}
