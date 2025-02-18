import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request: Request) {
  const { input }: { input: string } = await request.json();

  // const session = await auth();
  //
  // if (!session || !session.id) {
  //   return new Response('Unauthorized', { status: 401 });
  // }
  //
  // const model = models.find((model) => model.id === modelId);
  //
  // if (!model) {
  //   return new Response('Model not found', { status: 404 });
  // }

  return NextResponse.json({ ok: true }, { status: 200 });
}
