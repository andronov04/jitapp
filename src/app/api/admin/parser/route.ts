import { StreamingMessageParser } from '@/lib/runtime/message-parser';
import { parseArtifacts } from '@/lib/llm/utils/parser';
import { createMessageParser } from '@/lib/runtime/create-parser';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const data = parseArtifacts(rawBody);
  const mParser = createMessageParser();
  const newParsedContent = mParser.parse('uuid', rawBody);
  return Response.json({ data, newParsedContent }, { status: 200 });
}
