import { NextResponse } from "next/server";
import {streamText} from "ai";
import {getSystemPrompt} from "@/lib/llm/llm/prompts";
import {createOpenAI} from "@ai-sdk/openai";
import {parseArtifacts} from "@/lib/llm/utils/parser";
import prisma from "@/prisma";

export const maxDuration = 60;


const openAi = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET(request: Request) {
  // Получаем `messageId` из query параметров
  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get("messageId");
  const MODEL = "gpt-4o-mini";

  // // // Создаём ReadableStream для потока
  // const stream = new ReadableStream({
  //   async start(controller) {
  //     try {
  //       for (let i = 1; i <= 1; i++) {
  //         const message = `Here is a simple \"Hello World\" project using HTML, CSS, and JavaScript.\n\n<jitProject id=\"hello-world\" title=\"Hello World Project\">\n  <jitFile type="file" filePath=\"package.json\">\n    {\n      \"name\": \"hello-world\",\n      \"private\": true,\n      \"version\": \"0.0.0\",\n      \"scripts\": {\n        \"dev\": \"vite\"\n      }\n    }\n  </jitFile>\n\n  <jitFile type="file" filePath=\"index.html\">\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n      <meta charset=\"UTF-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Hello World</title>\n      <link rel=\"stylesheet\" href=\"style.css\">\n    </head>\n    <body>\n      <h1 id=\"greeting\">Hello, World!</h1>\n      <script src=\"script.js\"></script>\n    </body>\n    </html>\n  </jitFile>\n\n  <jitFile type="file" filePath=\"style.css\">\n    body {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      height: 100vh;\n      background-color: #f0f0f0;\n      font-family: Arial, sans-serif;\n    }\n\n    h1 {\n      color: #333;\n    }\n  </jitFile>\n\n  <jitFile type="file" filePath=\"script.js\">\n    console.log('Hello, World!');\n  </jitFile>\n</jitProject>`
  //         controller.enqueue(new TextEncoder().encode(message));
  //         await new Promise((resolve) => setTimeout(resolve, 1000)); // Эмуляция задержки
  //       }
  //       controller.close();
  //     } catch (error) {
  //       controller.error(error);
  //     }
  //   },
  // });
  //
  // return new NextResponse(stream, {
  //   status: 200,
  //   headers: {
  //     "Content-Type": "text/plain; charset=utf-8",
  //     "Cache-Control": "no-cache",
  //     "X-Accel-Buffering": "no",
  //     "Connection": "keep-alive",
  //   },
  // });


  try {
    let contentText = "";
    console.log("streamText");
    const result = streamText({
      model: openAi(MODEL),
      system: getSystemPrompt("/home/user"),
      messages: [{
        role: "user",
        content: `Create a simple "Hello World" project using HTML, CSS, and JavaScript.`,
      }],
      onChunk: async ({ chunk }) => {
        if (chunk.type === "text-delta") {
          contentText += chunk.textDelta || "";
          // const data = parseArtifacts(contentText);
          // console.log("onChunk", JSON.stringify(data, null, 2));
          // Merge state
        }
        // console.log("chunk", chunk);
      },
      // onError: async (error: any) => {
      //   console.log("onError", error);
      //   // reject(error);
      // },
      onFinish: async () => {
        console.log("onFinish");
        const data = parseArtifacts(contentText);
        console.log("onFinish", JSON.stringify(data?.[0], null, 2));
        await prisma.state.create({
          data: {
            id: messageId ?? "",
            data: {
              messageId: messageId,
              data
            }
          },
        });

        // resolve("Stream finished"); // Разрешаем промис после завершения потока
      },
    });
    // for await (const textPart of textStream) {
    //   // process.stdout.write(textPart);
    // }
    return result.toTextStreamResponse();
  } catch (error) {
    console.log("error", error);
    // reject(error); // Отлавливаем ошибки
  }
}
