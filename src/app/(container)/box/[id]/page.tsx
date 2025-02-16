import { notFound } from "next/navigation";
import prisma from "@/prisma";
import Box from "@/components/box/box";

export default async function Post({
                                     params,
                                   }: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // const post = await prisma.box.findUnique({
  //   where: { id: parseInt(id) },
  //   select: {
  //     id: true,
  //     name: true,
  //     description: true,
  //     mode: true,
  //     createdAt: true,
  //     workbenches: {
  //       select: {
  //         id: true,
  //         boxId: true,
  //         modelId: true,
  //         model: {
  //           select: {
  //             id: true,
  //             name: true,
  //             provider: true,
  //             params: true,
  //             createdAt: true,
  //           },
  //         },
  //         generatorId: true,
  //         generator: {
  //           select: {
  //             id: true,
  //             name: true,
  //             description: true,
  //             params: true,
  //             createdAt: true,
  //           },
  //         },
  //         config: true,
  //         createdAt: true,
  //         messages: {
  //           select: {
  //             id: true,
  //             role: true,
  //             kind: true,
  //             content: true,
  //             createdAt: true,
  //           },
  //         },
  //       }
  //     },
  //     messages: {
  //       select: {
  //         id: true,
  //         role: true,
  //         kind: true,
  //         content: true,
  //         createdAt: true,
  //         boxId: true,
  //         parentMessageId: true,
  //         model: {
  //           select: {
  //             id: true,
  //             name: true,
  //             provider: true,
  //             params: true,
  //             createdAt: true,
  //           },
  //         },
  //         children: {
  //           select: {
  //             id: true,
  //             role: true,
  //             kind: true,
  //             content: true,
  //             createdAt: true,
  //             boxId: true,
  //             parentMessageId: true,
  //             model: {
  //               select: {
  //                 id: true,
  //                 name: true,
  //                 provider: true,
  //                 params: true,
  //                 createdAt: true,
  //               },
  //             },
  //           }
  //         },
  //       },
  //     }
  //   },
  // });
  //
  // if (!post) {
  //   notFound();
  // }

  return (
    <>
      <Box data={{ id }} />
    </>
  );
}
