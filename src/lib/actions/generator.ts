'use server';

import prisma from '@/prisma';

export async function getSimpleGenerators() {
  const _generators = await prisma.generator.findMany({
    where: {
      active: true,
      published: true,
    },
    select: {
      id: true,
      tools: true,
      slug: true,
      order: true,
      meta: true,
    },
  });
  return _generators.map((item, i) => ({
    id: item.id,
    tools: item.tools,
    slug: item.slug,
    order: parseFloat(item.order),
    meta: item.meta,
  }));
}
