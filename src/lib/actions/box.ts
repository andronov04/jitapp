'use server';

import prisma from "@/prisma";

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
      // createdAt: true,
    }
  });
  if (!box) {
    throw new Error("Box not found");
  }
  // 2. Get messages
  const selector = {
    id: true,
    content: true,
    // createdAt: true,
    userId: true,
    role: true,
    status: true,
  }
  const messages = await prisma.message.findMany({
    where: {
      boxId: box.id,
      parentMessageId: null,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      ...selector,
      // parentMessageId: true,
      children: {
        select: {
          ...selector,
        },
      },
    }
  });
  console.log("messages", messages, box);

  return {
    ...box,
    messages,
  };
}
