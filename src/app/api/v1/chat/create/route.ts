import {NextResponse} from "next/server";
import {generateId} from "@/lib/utils";
import prisma from "@/prisma";

export const maxDuration = 60;


export async function POST(request: Request) {
  const {
    input,
    boxId,
    messages,
  }: { input: string; boxId: string; messages: any[] } = await request.json();
  console.log("POST", input, boxId, messages);
  const generatorId = "6c73628c-11bf-4a64-a525-bda25dc0f58e";
  const modelId = "aa3ef862-79f9-4008-ac3f-26a91ae8982b";

  const box = await prisma.box.create({
    data: {
      id: boxId,
      name: "Box 1",
      description: "Box 1 description",
      createdAt: new Date(),
      slug: generateId(),
      data: {},
    },
  })



  // const session = await auth();
  //
  // if (!session || !session.id) {
  //   return new Response('Unauthorized', { status: 401 });
  // }
  const newMessages = [];
  for (const message of messages) {
    if (message.role === "user") {
      const userMessage = await prisma.message.create({
        data: {
          id: message.id,
          role: "user" as any,
          kind: "user" as any,
          content: input,
          status: "created",
          createdAt: new Date(),
          boxId: boxId,
        },
      });
      newMessages.push({
        role: userMessage.role,
        id: userMessage.id,
        status: "created",
      });
    } else {
      const parentMessage = await prisma.message.create({
        data: {
          id: message.id,
          role: message.role as any,
          kind: "group",
          content: "",
          status: "created",
          createdAt: new Date(),
          boxId: boxId,
        },
      });
      await prisma.message.createMany({
        data: message.children?.map((child: any) => ({
          id: child.id,
          role: "assistant" as any,
          // role: child.role as any,
          kind: "ai",
          content: "",
          generatorId,
          modelId,
          createdAt: new Date(),
          boxId: boxId,
          parentMessageId: parentMessage.id,
          status: "created",
        }))
      });
      newMessages.push({
        role: parentMessage.role,
        id: parentMessage.id,
        status: "created",
        children: message.children.map((child: any) => ({
          id: child.id,
          role: child.role as any,
          status: "ready",
        })),
      });
    }
  }

  /**
   * FLow
   * 1. Check bad data
   * 2. Create user message
   * 3. Create parent assistant message
   * 4. Create box
   */

  return NextResponse.json({ box, messages: newMessages }, { status: 200 })
}
