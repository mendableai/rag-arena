import { StreamingTextResponse, Message as VercelChatMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { createRetrieverTool } from "langchain/tools/retriever";

import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { dynamicRetrieverUtility, vercelToLangchainMessage } from "./tools/config";
import { documentPromise } from "./tools/functions";
import { AGENT_SYSTEM_TEMPLATE } from "./tools/variables";

export const runtime = "edge";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const messages = (body.messages ?? []).filter(
            (message: VercelChatMessage) =>
                message.role === "user" || message.role === "assistant",
        );

        const retrieverSelected = body.retrieverSelection;

        const previousMessages = messages
            .slice(0, -1)
            .map(vercelToLangchainMessage);
        const currentMessageContent = messages[messages.length - 1].content;

        const chatModel = new ChatOpenAI({
            modelName: "gpt-3.5-turbo-1106",
            temperature: 0.2,
            streaming: true,
        });

        const client = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PRIVATE_KEY!,
        );

        const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
            client,
            tableName: "documents",
            queryName: "match_documents",
        });

        const retriever = dynamicRetrieverUtility(retrieverSelected, chatModel, vectorstore, currentMessageContent);



        const tool = createRetrieverTool(retriever, {
            name: "search_latest_knowledge",
            description: "Searches and returns up-to-date general information.",
        });

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", AGENT_SYSTEM_TEMPLATE],
            new MessagesPlaceholder("chat_history"),
            ["human", "{input}"],
            new MessagesPlaceholder("agent_scratchpad"),
        ]);

        const agent = await createOpenAIFunctionsAgent({
            llm: chatModel,
            tools: [tool],
            prompt,
        });

        const agentExecutor = new AgentExecutor({
            agent,
            tools: [tool],
        });

        const logStream = agentExecutor.streamLog({
            input: currentMessageContent,
            chat_history: previousMessages,
        });

        const textEncoder = new TextEncoder();
        const transformStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of logStream) {
                        if (chunk.ops?.length > 0 && chunk.ops[0].op === "add") {
                            const addOp = chunk.ops[0];
                            if (
                                addOp.path.startsWith("/logs/ChatOpenAI") &&
                                typeof addOp.value === "string" &&
                                addOp.value.length
                            ) {

                                controller.enqueue(textEncoder.encode(addOp.value));
                            }
                        }
                    }
                    controller.close();
                } catch (e) {
                    return NextResponse.json({ error: "Error in chunking" }, { status: 500 });
                }
            },
        });
        const response = new StreamingTextResponse(transformStream);


        
        try {

            const documents = await documentPromise;
            const serializedSources = Buffer.from(
                JSON.stringify(
                    documents.map((doc) => {
                        return {
                            pageContent: doc.pageContent.slice(0, 50) + "...",
                            metadata: doc.metadata,
                        };
                    }),
                ),
            ).toString("base64");

            response.headers.set('x-sources', serializedSources);

            return response;
        } catch (e) {
            return response;
        }


    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
    }
}
