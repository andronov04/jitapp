import { StreamingMessageParser } from '@/lib/runtime/message-parser';
import { parseArtifacts } from '@/lib/llm/utils/parser';
import { createMessageParser } from '@/lib/runtime/create-parser';

export async function POST(request: Request) {
  const rawBody = await request.text();
  console.log(rawBody);
  const data = parseArtifacts(rawBody);
  console.log('onFinish', JSON.stringify(data?.[0], null, 2));
  const mParser = createMessageParser();
  const newParsedContent = mParser.parse('uuid', rawBody);
  return Response.json({ data, newParsedContent }, { status: 200 });
}
