'use server';

import prisma from '@/prisma';

export async function getMessageState(id: string): Promise<any> {
  return prisma.state.findUnique({
    where: {
      id,
    },
  });
}
