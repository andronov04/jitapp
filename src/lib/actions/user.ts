'use server';

import prisma from '@/prisma';

export async function getUserByUsername(username: string): Promise<any> {
  return prisma.iuser.findUnique({
    where: {
      username,
      deletedAt: null,
    },
  });
}
