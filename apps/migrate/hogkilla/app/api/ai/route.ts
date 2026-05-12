import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: UIMessage[] };
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const latestUserText = latestUserMessage?.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n");

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system:
      "You are a helpful assistant embedded in a demo app called hogkilla. " +
      "Keep responses brief (1-2 sentences). Be witty.",
    messages: await convertToModelMessages(messages),
    experimental_telemetry: {
      isEnabled: true,
      metadata: {
        feature: "braintrust-demo-chat",
        prompt: latestUserText ?? "",
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
