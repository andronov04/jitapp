import {generateId, Message} from 'ai';
import { useCallback, useState } from 'react';
import {StreamingMessageParser} from "@/lib/runtime/message-parser";
import {parseArtifacts} from "@/lib/llm/utils/parser";
// import { StreamingMessageParser } from '~/lib/runtime/message-parser';
// import { workbenchStore } from '~/lib/stores/workbench';

export const createMessageParser = () => {
  return new StreamingMessageParser({
    callbacks: {
      onArtifactOpen: (data) => {
        // const existingWorkbench = appStore.currentBox?.workbenches.find((wb) => wb.id === parseInt(data.messageId));
        // console.log('onArtifactOpen', data, existingWorkbench); //, getAppStore()
        // if (!existingWorkbench) {
        //   appStore.currentBox?.addWorkbench({
        //     id: parseInt(data.messageId),
        //     status: "streaming",
        //   })
        // }

        // workbenchStore.showWorkbench.set(true);
        // workbenchStore.addArtifact(data);
      },
      onArtifactClose: (data) => {
        console.log('onArtifactClose');

        // workbenchStore.updateArtifact(data, { closed: true });
      },
      onActionOpen: (data) => {
        console.log('onActionOpen', data.action);

        // we only add shell actions when when the close tag got parsed because only then we have the content
        // if (data.action.type !== 'shell') {
        //   workbenchStore.addAction(data);
        // }
      },
      onActionClose: (data) => {
        console.log('onActionClose', data.action);
        //
        // if (data.action.type === 'shell') {
        //   workbenchStore.addAction(data);
        // }
        //
        // workbenchStore.runAction(data);
      },
    },
  });
}


export const messageParser: any = {};

export function parseJitMessages(textDelta: string) {
  const regex = /<jitMsg data-id="([^"]+)">([\s\S]*?)<\/jitMsg>/g;
  const matches = [...textDelta.matchAll(regex)];
  // return matches.map(match => ({ id: match[1], text: match[2] }));
  const grouped: Record<string, string> = {};

  // Проходим по всем совпадениям
  for (const match of matches) {
    const id = match[1];
    const text = match[2];
    // Дополняем уже существующий текст для этого id
    grouped[id] = (grouped[id] || '') + text;
  }
  return Object.entries(grouped).map(([id, content]) => ({id, content}));
}


export function useMessageParser() {
  const [parsedMessages, setParsedMessages] = useState<{ [key: number]: string }>({});

  const parseMessages = useCallback((messages: Message[], isLoading: boolean) => {
    let reset = false;

    if (process.env.DEV && !isLoading) {
      reset = true;
      Object.values(messageParser).forEach((mParser) => (mParser as any).reset());
    }
    // console.log("messages", messages);

    for (const [index, message] of messages.entries()) {
      if (message.role === 'assistant') {
        let result: string | any[] = message.content;
        try {
          result = parseJitMessages(message.content);
        } catch (e) {
          console.log(e);
        }
        let netContent: any = [];
        if (Array.isArray(result)) {
          result.forEach((item, index) => {
            let mParser = messageParser[item.id];
            if (!mParser) {
              messageParser[item.id] = createMessageParser();
              mParser = messageParser[item.id];
            }
            const newParsedContent = mParser.parse(item.id, item.content);
            mParser.content += newParsedContent;
            netContent.push(mParser.content);

            // TODO use mParser if effectively
            console.log("parseArtifacts", parseArtifacts(item.content));
          });
        }

        // const newParsedContent = messageParser.parse(message.id, message.content);
        // console.log("newParsedContent", newParsedContent);

        setParsedMessages((prevParsed) => ({
          ...prevParsed,
          [index]: netContent,//!reset ? (prevParsed[index] || '') + netContent : netContent,
        }));
      }
    }
  }, []);

  return { parsedMessages, parseMessages };
}
