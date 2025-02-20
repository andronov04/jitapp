import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const models = [
    {
      id: '505680da-28ba-4dc9-873b-036387fa938f',
      modelKey: 'gpt-4o-mini',
      modelLabel: 'gpt-4o-mini',
      providerLabel: 'OpenAI',
      providerKey: 'openai',
      headline: '',
      description:
        'GPT-4o mini from OpenAI is their most advanced and cost-efficient small model. It is multi-modal (accepting text or image inputs and outputting text) and has higher intelligence than gpt-3.5-turbo but is just as fast.',
      tags: [],
      order: 1,
      active: true,
      params: {},
    },
    {
      id: '775e4c03-fa51-43e9-bfa8-7d5030d49dc5',
      modelKey: 'deepseek-reasoner',
      modelLabel: 'DeepSeek R1',
      providerLabel: 'DeepSeek',
      providerKey: 'deepseek',
      headline: '',
      description:
        "DeepSeek Reasoner is a specialized model developed by DeepSeek that uses Chain of Thought (CoT) reasoning to improve response accuracy. Before providing a final answer, it generates detailed reasoning steps that are accessible through the API, allowing users to examine and leverage the model's thought process, served by Fireworks AI.\n",
      tags: [],
      order: 2,
      active: true,
      params: {},
    },
    {
      id: '3537a564-cbaa-40c5-b514-1877ebe48fd7',
      modelKey: 'claude-3.5-sonnet',
      modelLabel: 'claude-3.5-sonnet',
      providerLabel: 'Anthropic',
      providerKey: 'anthropic',
      headline: '',
      description:
        'Claude 3.5 Sonnet strikes the ideal balance between intelligence and speed—particularly for enterprise workloads. It delivers strong performance at a lower cost compared to its peers, and is engineered for high endurance in large-scale AI deployments.',
      tags: [],
      order: 3,
      active: true,
      params: {},
    },
    {
      id: '4058eb62-28c2-4131-8633-1f2a844c25f8',
      modelKey: 'o3-mini',
      modelLabel: 'o3-mini (High)',
      providerLabel: 'OpenAI',
      providerKey: 'openai',
      headline: '',
      description:
        'o3-mini with high reasoning effort - enhanced reasoning power exceeding o1 in many STEM domains.',
      tags: [],
      order: 4,
      active: true,
      params: {},
    },
  ];

  await Promise.all(
    models.map((model) => prisma.model.create({ data: model as any })),
  );

  // 2) Создадим несколько генераторов:
  const [bootstrapUI, materialUI] = await Promise.all([
    prisma.generator.create({
      data: {
        id: '3427c255-f170-4696-8800-97d4966f9287',
        name: 'BootstrapUI',
        description: 'Generate code using Bootstrap components',
        params: {
          version: '5.3',
        },
      },
    }),
    prisma.generator.create({
      data: {
        id: '086d2374-de38-4f08-afe5-8c202623a382',
        name: 'MaterialUI',
        description: 'Generate code using MaterialUI components',
        params: {
          version: '5.0',
        },
      },
    }),
  ]);

  prisma.user.create({
    data: {
      id: '69edfe7e-cace-4b9c-b4d1-e3d8f6c46ded',
      username: 'andronov04',
      email: 'andronov04@gmail.com',
    },
  });
  // prisma.user.create({
  //   data: {
  //     username: 'elonmusk',
  //     email: 'elonmusk@gmail.com',
  //   },
  // });

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
