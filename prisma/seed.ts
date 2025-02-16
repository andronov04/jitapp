import { PrismaClient, BoxMode, MessageRole, MessageKind } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1) Создадим несколько моделей:
  const [gpt4, deepSeek] = await Promise.all([
    prisma.model.create({
      data: {
        name: 'GPT-4',
        provider: 'OpenAI',
        params: {
          maxTokens: 2000,
          temperature: 0.7,
        },
      },
    }),
    prisma.model.create({
      data: {
        name: 'DeepSeek',
        provider: 'CustomAI',
        params: {
          maxTokens: 1500,
          temperature: 0.8,
        },
      },
    }),
  ]);

  // 2) Создадим несколько генераторов:
  const [bootstrapUI, materialUI] = await Promise.all([
    prisma.generator.create({
      data: {
        name: 'BootstrapUI',
        description: 'Generate code using Bootstrap components',
        params: {
          version: '5.3',
        },
      },
    }),
    prisma.generator.create({
      data: {
        name: 'MaterialUI',
        description: 'Generate code using MaterialUI components',
        params: {
          version: '5.0',
        },
      },
    }),
  ]);

  // -----------------------------------------------
  // (A) Box #1: BASIC Mode (один Workbench)
  // -----------------------------------------------
  const boxBasic = await prisma.box.create({
    data: {
      name: 'Calculator (Basic Mode)',
      description: 'Simple calculator with one generator',
      mode: BoxMode.BASIC,
    },
  });

  // Создадим один Workbench (GPT-4 + BootstrapUI):
  const wbBasic = await prisma.workbench.create({
    data: {
      boxId: boxBasic.id,
      modelId: gpt4.id,          // Допустим, дефолт GPT-4
      generatorId: bootstrapUI.id,
      config: { theme: 'light' },
    },
  });

  // Пример нескольких сообщений в BASIC-режиме:
  // - Пользователь задаёт вопрос
  // - Ответ ассистента (привязан к Workbench, модель GPT-4)
  await prisma.message.createMany({
    data: [
      {
        boxId: boxBasic.id,
        role: MessageRole.USER,
        kind: MessageKind.USER,
        content: {
          text: 'Create a simple calculator with 2 inputs and an Add button',
        },
      },
      {
        boxId: boxBasic.id,
        workbenchId: wbBasic.id,
        modelId: gpt4.id, // Фиксируем, что ответ от GPT-4
        role: MessageRole.ASSISTANT,
        kind: MessageKind.AI,
        content: {
          text: 'Sure, here is the code using Bootstrap...',
          code: '<html>...Bootstrap Code...</html>',
        },
      },
    ],
  });

  // -----------------------------------------------
  // (B) Box #2: COMPARISON Mode (два Workbench)
  // -----------------------------------------------
  const boxCompare = await prisma.box.create({
    data: {
      name: 'Calculator (Compare Mode)',
      description: 'Compare GPT-4 vs DeepSeek with different UI generators',
      mode: BoxMode.COMPARISON,
    },
  });

  // Создаём два Workbench:
  // WB#1: GPT-4 + MaterialUI
  // WB#2: DeepSeek + BootstrapUI
  const [wbCompare1, wbCompare2] = await Promise.all([
    prisma.workbench.create({
      data: {
        boxId: boxCompare.id,
        modelId: gpt4.id,
        generatorId: materialUI.id,
        config: { colorScheme: 'indigo' },
      },
    }),
    prisma.workbench.create({
      data: {
        boxId: boxCompare.id,
        modelId: deepSeek.id,
        generatorId: bootstrapUI.id,
        config: { theme: 'dark' },
      },
    }),
  ]);

  // Теперь создаём чат-сообщения:
  // 1) Одна пользовательская реплика (общая для Box)
  // 2) Два ассистентских ответа (по одному от каждого Workbench)
  const userMsg = await prisma.message.create({
    data: {
      boxId: boxCompare.id,
      role: MessageRole.USER,
      kind: MessageKind.USER,
      content: {
        text: 'Create an advanced calculator with memory function',
      },
    },
  });

  // Два ответа (GPT-4/MaterialUI и DeepSeek/BootstrapUI):
  await prisma.message.create({
    data: {
      boxId: boxCompare.id,
      workbenchId: wbCompare1.id,
      modelId: gpt4.id,
      parentMessageId: userMsg.id,
      role: MessageRole.ASSISTANT,
      kind: MessageKind.AI,
      content: {
        text: 'Sure, using MaterialUI for a memory-based calculator...',
        files: [
          {
            filename: 'Calculator.jsx',
            content: '// MaterialUI-based React code here',
          },
        ],
      },
    },
  });

  await prisma.message.create({
    data: {
      boxId: boxCompare.id,
      workbenchId: wbCompare2.id,
      modelId: deepSeek.id,
      parentMessageId: userMsg.id,
      role: MessageRole.ASSISTANT,
      kind: MessageKind.AI,
      content: {
        text: 'Here is a memory-based calculator using Bootstrap...',
        files: [
          {
            filename: 'Calculator.html',
            content: '<!-- Bootstrap HTML code here -->',
          },
        ],
      },
    },
  });

  console.log('Seed data has been successfully created!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
