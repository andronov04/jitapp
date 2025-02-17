import { notFound } from "next/navigation";
import prisma from "@/prisma";
import Box from "@/components/box/box";
import {getBoxStateBySlug} from "@/lib/actions/box";
import {getMessageState} from "@/lib/actions/state";

export default async function Post({
                                     params,
                                   }: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("bid:bid", slug);
  const box = await getBoxStateBySlug(slug);
  console.log("boxpage", box);
  const stateId = "91454ed6-a6db-4ffb-8a5f-8b0d2998c384";
  const messageState = await getMessageState(stateId);
  // console.log("messageState", messageState?.data?.data[0]);
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
      <Box data={{ box, messageState: messageState?.data?.data }} />
    </>
  );
}
