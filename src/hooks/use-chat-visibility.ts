'use client';

import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { VisibilityType } from '@/components/chat/visibility-selector';

export function useChatVisibility({
  chatId,
  initialVisibility,
}: {
  chatId: string;
  initialVisibility: VisibilityType;
}) {
  const { mutate, cache } = useSWRConfig();
  const history: Array<any> = cache.get('/api/history')?.data;

  const { data: localVisibility, mutate: setLocalVisibility } = useSWR(
    `${chatId}-visibility`,
    null,
    {
      fallbackData: initialVisibility,
    },
  );

  const visibilityType = useMemo(() => {
    if (!history) return localVisibility;
    const chat = history.find((chat) => chat.id === chatId);
    if (!chat) return 'private';
    return chat.visibility;
  }, [history, chatId, localVisibility]);

  const setVisibilityType = (updatedVisibilityType: VisibilityType) => {
    // setLocalVisibility(updatedVisibilityType);
    //
    // mutate<Array<Chat>>(
    //   '/api/history',
    //   (history) => {
    //     return history
    //       ? history.map((chat) => {
    //           if (chat.id === chatId) {
    //             return {
    //               ...chat,
    //               visibility: updatedVisibilityType,
    //             };
    //           }
    //           return chat;
    //         })
    //       : [];
    //   },
    //   { revalidate: false },
    // );
    //
    // updateChatVisibility({
    //   chatId: chatId,
    //   visibility: updatedVisibilityType,
    // });
  };

  return { visibilityType, setVisibilityType };
}
