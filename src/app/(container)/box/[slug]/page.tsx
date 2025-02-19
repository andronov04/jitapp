import { notFound } from 'next/navigation';
import prisma from '@/prisma';
import Box from '@/components/box/box';
import { getBoxStateBySlug } from '@/lib/actions/box';
import { getMessageState } from '@/lib/actions/state';

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const box = await getBoxStateBySlug(slug);
  const lastMessage = box.messages[box.messages.length - 1];
  const states = lastMessage?.children
    ? await Promise.all(
        lastMessage.children.map(async (child: any) => {
          return getMessageState(child.id);
        }),
      )
    : [];

  // const stateId = "d006ba4b-adee-46b5-92d3-8620b0ca02e0";
  // const messageState = await getMessageState(stateId);
  // console.log("messageState", messageState, "states", states);
  // const workbenches = [
  //   {
  //     id: stateId,
  //     status: "created",
  //     currentState:  messageState,
  //     tools: [
  //       {
  //         id: "code",
  //         name: "Code",
  //       },
  //     ]
  //   }
  // ]
  // box.workbenches = workbenches;
  //id: messageId, // mix dmeste modelid_plus+pageid
  //           status: "created",
  //           tools: [
  //             ToolStore.create({
  //               id: "code",
  //               name: "Code",
  //             }),
  //           ]

  return (
    <>
      <Box data={{ box, messageStates: states.filter((a) => a) }} />
    </>
  );
}
