'use server';

import prisma from '@/prisma';

export async function getBoxStateBySlug(slug: string) {
  // TODO check some validations
  // 1. Get box
  const box = await prisma.box.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      userId: true,
      // createdAt: true,
    },
  });
  if (!box) {
    throw new Error('Box not found');
  }
  // 2. Get messages
  const selector = {
    id: true,
    content: true,
    // createdAt: true,
    userId: true,
    user: {
      select: {
        id: true,
        username: true,
      },
    },
    role: true,
    status: true,
    modelId: true,
    generatorId: true,
  };
  const messages = await prisma.message.findMany({
    where: {
      boxId: box.id,
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

  return {
    ...box,
    messages,
  };
}

export async function getFeaturedBoxes() {
  const _items = await prisma.box.findMany({
    where: {
      active: true,
      // featured: true,
      risked: false,
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      order: true,
      score: true,
      id: true,
      name: true,
      meta: true,
      featured: true,
      slug: true,
      createdAt: true,
      description: true,
      numLikes: true,
      numMessages: true,
      numViews: true,
      userId: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      useModels: {
        select: {
          id: true,
        },
      },
      useGenerators: {
        select: {
          id: true,
        },
      },
    },
    take: 25,
  });
  return _items.map((item) => ({
    ...item,
    order: parseInt(item.order as any),
    score: parseFloat(item.score as any),
  }));
}
