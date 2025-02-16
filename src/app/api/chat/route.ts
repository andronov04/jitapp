import {
  type Message,
  convertToCoreMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';

import { models } from '@/lib/ai/models';
import {
  generateId,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

// import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { auth } from '@/lib/supabase/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import { customModel } from '@/lib/ai';
import { deleteChatById, getChatById, saveChat } from '@/lib/actions/chat';
import { saveMessages } from '@/lib/actions/message';
import {getSystemPrompt} from "@/lib/llm/llm/prompts";

export const maxDuration = 60;

type AllowedTools =
  | 'createDocument'
  | 'updateDocument'
  | 'requestSuggestions'
  | 'getWeather';

const blocksTools: AllowedTools[] = [
  'createDocument',
  'updateDocument',
  'requestSuggestions',
];

const weatherTools: AllowedTools[] = ['getWeather'];
const allTools: AllowedTools[] = [...blocksTools, ...weatherTools];

export async function POST(request: Request) {
  const {
    id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const chat = await getChatById(id);

  if (!chat) {
    const title = id; //await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.id, title });
  }

  const userMessageId = generateId();

  await saveMessages({
    messages: [{ ...userMessage, id: userMessageId, chat_id: id }],
  });

  return createDataStreamResponse({
    execute: async (dataStream) => {
      dataStream.writeData({
        type: 'user-message-id',
        content: userMessageId,
      });

      const msg1 = "123";
      const msg2 = "456";

      // Создаем промисы для обоих стримов
      const streamPromise1 = new Promise((resolve) => {
        const result1 = streamText({
          model: customModel(model.apiIdentifier),
          system: getSystemPrompt("/home/user/"),
          messages: [
            {
              role: 'user',
              content: 'simple hello world',
            }
          ],
          maxSteps: 1,
          experimental_transform: smoothStream({ chunking: 'word' }),
          onChunk: async ({chunk}) => {
            chunk.textDelta = `<jitMsg data-id="${msg1}">${chunk.textDelta}</jitMsg>`
            // chunk.textDelta = `${msg1}-${chunk.textDelta}` //JSON.stringify({ "msgId": 1, text: chunk.textDelta })
            // chunk.args = { msgId: msg1 }
            console.log("chunk", chunk);
          },
          onFinish: async ({ response }) => {
            // if (session?.id) {
            //   try {
            //     const responseMessagesWithoutIncompleteToolCalls =
            //       sanitizeResponseMessages(response.messages);
            //
            //     await saveMessages({
            //       messages: responseMessagesWithoutIncompleteToolCalls.map(
            //         (message) => {
            //           const messageId = generateId();
            //           if (message.role === 'assistant') {
            //             dataStream.writeMessageAnnotation({
            //               messageIdFromServer: messageId,
            //             });
            //           }
            //           console.log("onFinish 1", message, messageId);
            //           return {
            //             id: messageId,
            //             chat_id: id,
            //             role: message.role,
            //             content: message.content,
            //           };
            //         },
            //       ),
            //     });
            //   } catch (error) {
            //     console.error('Failed to save chat');
            //   }
            // }
            resolve(true);
          },
          experimental_telemetry: {
            isEnabled: true,
            functionId: 'stream-text',
          },
        });
        result1.mergeIntoDataStream(dataStream);
      });

      // const streamPromise2 = new Promise((resolve) => {
      //   const result2 = streamText({
      //     model: customModel(model.apiIdentifier),
      //     system: getSystemPrompt("/home/user/"),
      //     messages: [
      //       {
      //         role: 'system',
      //         content: 'You are a helpful assistant.',
      //       },
      //       {
      //         role: 'user',
      //         content: 'write hello world in JavaScript',
      //       }
      //     ],
      //     maxSteps: 1,
      //     experimental_transform: smoothStream({ chunking: 'word' }),
      //     onChunk: async ({chunk}) => {
      //       chunk.textDelta = `<jitMsg data-id="${msg2}">${chunk.textDelta}</jitMsg>` //JSON.stringify({ "msgId": 2, text: chunk.textDelta })//
      //       // chunk.args = { msgId: msg2} //JSON.stringify({ "msgId": 2, text: chunk.textDelta })
      //       // console.log("chunk", chunk);
      //     },
      //     onFinish: async ({ response }) => {
      //       // if (session?.id) {
      //       //   try {
      //       //     const responseMessagesWithoutIncompleteToolCalls =
      //       //       sanitizeResponseMessages(response.messages);
      //       //
      //       //     await saveMessages({
      //       //       messages: responseMessagesWithoutIncompleteToolCalls.map(
      //       //         (message) => {
      //       //           const messageId = generateId();
      //       //           if (message.role === 'assistant') {
      //       //             dataStream.writeMessageAnnotation({
      //       //               messageIdFromServer: messageId,
      //       //             });
      //       //           }
      //       //           console.log("onFinish 2", message, messageId);
      //       //           return {
      //       //             id: messageId,
      //       //             chat_id: id,
      //       //             role: message.role,
      //       //             content: message.content,
      //       //           };
      //       //         },
      //       //       ),
      //       //     });
      //       //   } catch (error) {
      //       //     console.error('Failed to save chat');
      //       //   }
      //       // }
      //       resolve(true);
      //     },
      //     experimental_telemetry: {
      //       isEnabled: true,
      //       functionId: 'stream-text',
      //     },
      //   });
      //   result2.mergeIntoDataStream(dataStream);
      // });

      // Ждем завершения обоих стримов
      await Promise.all([streamPromise1]); //streamPromise2
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById(id);

    if (chat.userId !== session.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById(id);

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
