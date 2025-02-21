import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import {
  CoreAssistantMessage,
  CoreMessage,
  CoreToolMessage,
  Message,
  ToolInvocation,
} from 'ai';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== 'assistant') return message;

    if (!message.toolInvocations) return message;

    const toolResultIds: Array<string> = [];

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === 'result') {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      (toolInvocation) =>
        toolInvocation.state === 'result' ||
        toolResultIds.includes(toolInvocation.toolCallId),
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 ||
      (message.toolInvocations && message.toolInvocations.length > 0),
  );
}

interface ApplicationError extends Error {
  info: {
    code: string | number;
    message: string;
  };
  status: number;
}

export const generateId = () => {
  return nanoid().replace(/[^a-zA-Z0-9]/g, '');
};

export const generateUuid = () => {
  return uuidv4();
};

export const createFetchError = async (res: Response) => {
  const error = new Error(
    'An error occurred while fetching the data.',
  ) as ApplicationError;

  try {
    error.info = await res.clone().json();
  } catch (e) {
    error.info = {
      code: res.status,
      message: await res.text(),
    };
  }
  error.status = res.status;
  return error;
};

export const fetcher = async (
  url: string,
  body: any,
): Promise<{ data: any; error: ApplicationError | null }> => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await createFetchError(res);
    // throw error;
    return {
      data: null,
      error,
    };
  }

  return {
    data: await res.json(),
    error: null,
  };
};

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): Array<Message> {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId,
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: 'result',
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}

export function convertToUIMessages(messages: Array<any>): Array<Message> {
  return messages.reduce((chatMessages: Array<Message>, message) => {
    if (message.role === 'tool') {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = '';
    const toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === 'string') {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === 'text') {
          textContent += content.text;
        } else if (content.type === 'tool-call') {
          toolInvocations.push({
            state: 'call',
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    chatMessages.push({
      id: message.id,
      role: message.role as Message['role'],
      content: textContent,
      toolInvocations,
    });

    return chatMessages;
  }, []);
}

export function sanitizeResponseMessages(
  messages: Array<CoreToolMessage | CoreAssistantMessage>,
): Array<CoreToolMessage | CoreAssistantMessage> {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === 'tool') {
      for (const content of message.content) {
        if (content.type === 'tool-result') {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== 'assistant') return message;

    if (typeof message.content === 'string') return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === 'tool-call'
        ? toolResultIds.includes(content.toolCallId)
        : content.type === 'text'
          ? content.text.length > 0
          : true,
    );

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0,
  );
}

export function getMostRecentUserMessage(messages: Array<CoreMessage>) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

export function getMessageIdFromAnnotations(message: Message) {
  if (!message.annotations) return message.id;

  const [annotation] = message.annotations;
  if (!annotation) return message.id;

  // @ts-expect-error messageIdFromServer is not defined in MessageAnnotation
  return annotation.messageIdFromServer;
}

export const isAdmin = (email?: string) => {
  return ['andron.andr@gmail.com', 'ndrnv4@gmail.com'].includes(email ?? '');
};

type AnyRecord = {
  [key: string]: any;
};

export function findRecursive<T extends AnyRecord>(
  items: T[],
  targetValue: any,
  idKey: string = 'id',
  childrenKey: string = 'children',
): T | undefined {
  for (const item of items) {
    if (item[idKey] === targetValue) {
      return item;
    }

    const children = item[childrenKey];
    if (Array.isArray(children)) {
      const found = findRecursive(children, targetValue, idKey, childrenKey);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

export function filterRecursive<T extends AnyRecord>(
  items: T[],
  targetValue: any,
  idKey: string = 'id',
  childrenKey: string = 'children',
): T[] {
  let results: T[] = [];

  for (const item of items) {
    if (item[idKey] === targetValue) {
      results.push(item);
    }

    const children = item[childrenKey];
    if (Array.isArray(children)) {
      // Рекурсивно фильтруем вложенные элементы и добавляем их в общий список
      results = results.concat(
        filterRecursive(children, targetValue, idKey, childrenKey),
      );
    }
  }

  return results;
}
