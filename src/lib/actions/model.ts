'use server';

import prisma from '@/prisma';

export async function getModels() {
  const _models = await prisma.model.findMany();
  return _models.map((model, i) => ({
    id: model.id,
    modelKey: model.modelKey,
    modelLabel: model.modelLabel,
    providerLabel: model.providerLabel,
    providerKey: model.providerKey,
    headline: model.headline,
    description: model.description,
    tags: model.tags,
    order: model.order,
    active: model.active,
    selected: i === 0,
    params: model.params,
  }));
}
