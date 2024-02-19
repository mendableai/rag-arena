import { Message, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { HttpResponseOutputParser } from "langchain/output_parsers";

export const runtime = "edge";

const formatMessage = (message: Message) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a helpful AI assistant. When asked about previous messages you should be able to recall them from the current conversation.

Current conversation:
{chat_history}

User: {input}
AI:`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);


    const model = new ChatOpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo-1106",
    });

    const outputParser = new HttpResponseOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);



    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}