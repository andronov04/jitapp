import { NextResponse } from 'next/server';
import { smoothStream, streamText } from 'ai';
import { getSystemPrompt } from '@/lib/llm/llm/prompts';
import { createOpenAI } from '@ai-sdk/openai';
import prisma from '@/prisma';
import {
  getMessageForStream,
  getMessagesForStream,
} from '@/lib/actions/message';
import { createFireworks } from '@ai-sdk/fireworks';
import { createMessageParser } from '@/lib/runtime/create-parser';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { createAnthropic } from '@ai-sdk/anthropic';

export const maxDuration = 360;

const fireworks = createFireworks({
  apiKey: process.env.FIREWORKS_API_KEY ?? '',
});

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});

const openAi = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.AI_ANTHROPIC_API_KEY ?? '',
});

export async function GET(request: Request) {
  // Получаем `messageId` из query параметров
  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get('messageId');
  if (!messageId) {
    return new Response('messageId is required', { status: 400 });
  }
  const msg = await getMessageForStream(messageId);
  // if (!msg) {
  //   return new Response("messageId is required", { status: 400 });
  // }

  // TODO get history

  // TODO: try catch and update message status

  let model; // TODO switch key by model
  if (msg.model?.modelKey.includes('deepseek')) {
    // model = deepseek('deepseek-reasoner');
    // model = anthropic('claude-3-5-sonnet-latest');
    model = fireworks('accounts/fireworks/models/deepseek-r1');
    // model = fireworks("accounts/fireworks/models/deepseek-v3");
  } else if (msg.model?.modelKey.includes('claude')) {
    model = anthropic('claude-3-5-sonnet-latest');
  } else {
    model = openAi(msg.model.modelKey);
  }
  let system; // TODO switch key by generator
  if (msg.generator) {
    system = getSystemPrompt('/home/user');
    // system = getSystemPrompt(msg.generator.name);
  }

  let fitMessages = [];
  const messages = await getMessagesForStream(msg.boxId);
  for (const message of messages) {
    if (message.role === 'user') {
      fitMessages.push({
        role: 'user',
        content: message.content,
      });
    } else if (message.role === 'assistant') {
      fitMessages.push({
        role: 'assistant',
        content: message.content,
      });
    } else if (message.role === 'group') {
      message.children.forEach((child: any) => {
        if (child.role === 'assistant') {
          fitMessages.push({
            role: 'assistant',
            content: child.content,
          });
        }
      });
    }
  }
  fitMessages = fitMessages.filter((m: any) => m.content.length > 0);
  // throw new Error("Not implemented example");

  try {
    let contentText = '';
    const result = streamText({
      model: model as any,
      system,
      experimental_transform: smoothStream({ chunking: 'word' }),
      // maxSteps: 5, // enable multi-step calls
      // experimental_continueSteps: true,
      messages: fitMessages as any,
      onChunk: async ({ chunk }) => {
        // TODO: reasoning
        if (chunk.type === 'text-delta') {
          contentText += chunk.textDelta || '';
          // const data = parseArtifacts(contentText);
          // console.log("onChunk", JSON.stringify(data, null, 2));
          // Merge state
        }
        // console.log("chunk", chunk);
      },
      // onError: async (error: any) => {
      //   console.log("onError", error);
      //   // reject(error);
      // },
      onFinish: async (event) => {
        const mParser = createMessageParser();
        const result = mParser.parse(messageId, contentText);
        // // const data = parseArtifacts(contentText);
        // console.log("onFinish", JSON.stringify(data?.[0], null, 2));
        if (!result.state?.length) {
          throw new Error('Something went wrong');
        }
        await prisma.state.create({
          data: {
            id: messageId ?? '',
            data: {
              messageId: messageId,
              data: result.state,
            },
          },
        });
        if (messageId) {
          await prisma.message.update({
            where: {
              id: messageId,
            },
            data: {
              status: 'ready',
              content: contentText,
            },
          });
        }

        // resolve("Stream finished"); // Разрешаем промис после завершения потока
      },
    });
    // for await (const textPart of textStream) {
    //   // process.stdout.write(textPart);
    // }
    return result.toTextStreamResponse();
  } catch (error) {
    console.log('error', error);
    // reject(error); // Отлавливаем ошибки
  }
}
