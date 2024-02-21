import { StreamingTextResponse, Message as VercelChatMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { type Document } from "@langchain/core/documents";
import { AIMessage, ChatMessage, HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { createRetrieverTool } from "langchain/tools/retriever";

import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";

export const runtime = "edge";

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
    if (message.role === "user") {
        return new HumanMessage(message.content);
    } else if (message.role === "assistant") {
        return new AIMessage(message.content);
    } else {
        return new ChatMessage(message.content, message.role);
    }
};

const AGENT_SYSTEM_TEMPLATE = `You are a stereotypical robot named Robbie and must answer all questions like a stereotypical robot. Use lots of interjections like "BEEP" and "BOOP".

If you don't know how to answer a question, use the available tools to look up relevant information. You should particularly do this for questions about LangChain.`;


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const messages = (body.messages ?? []).filter(
            (message: VercelChatMessage) =>
                message.role === "user" || message.role === "assistant",
        );
        const returnIntermediateSteps = body.show_intermediate_steps;
        const previousMessages = messages
            .slice(0, -1)
            .map(convertVercelMessageToLangChainMessage);
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

        let resolveWithDocuments: (value: Document[]) => void;

        const documentPromise = new Promise<Document[]>((resolve) => {
            resolveWithDocuments = resolve;
        });

        // retriever configuration:

        const retriever = vectorstore.asRetriever({
            callbacks: [
                {
                    handleRetrieverEnd(documents) {
                        resolveWithDocuments(documents);
                    },
                },
            ],
        });

        // end retriever configuration

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
            returnIntermediateSteps,
        });

        if (!returnIntermediateSteps) {

            const logStream = await agentExecutor.streamLog({
                input: currentMessageContent,
                chat_history: previousMessages,
            });


            const textEncoder = new TextEncoder();
            const transformStream = new ReadableStream({
                async start(controller) {
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
                },
            });


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

            const response = new StreamingTextResponse(transformStream);

            response.headers.set('x-sources', serializedSources);

            return response;
        } else {

            const result = await agentExecutor.invoke({
                input: currentMessageContent,
                chat_history: previousMessages,
            });

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

            const response = NextResponse.json(
                { output: result.output, intermediate_steps: result.intermediateSteps },
                { status: 200 },
            );

            response.headers.set('x-sources', serializedSources);
            return response;
        }
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
    }
}
