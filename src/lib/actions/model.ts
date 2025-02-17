'use server';

import prisma from "@/prisma";

export async function getModels() {
  const _models = await prisma.model.findMany();
  return _models.map((model) => ({
    id: model.id,
    name: model.name,
    provider: model.provider,
  }));
}
