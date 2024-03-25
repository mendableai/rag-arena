import { CustomRetriever } from "@/lib/types";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { DocumentInterface } from "@langchain/core/documents";
import { ChatOpenAI } from "@langchain/openai";
import { StreamingTextResponse } from 'ai';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';
import { Stream } from "openai/streaming.mjs";
import { checkRateLimit } from "../functions/checkRateLimit";
import { getClientIp } from "../functions/getClientIp";
import { initializeOpenAI } from "../functions/initializeOpenAI";
import { selectVectorStore } from "../functions/selectVectorStore";
import { handleCohere, handleOpenAI } from "../functions/serviceHandlers";
import { CustomError, dynamicRetrieverUtility } from "./tools/config";
import { CONDENSE_QUESTION_TEMPLATE } from "./tools/variables";

export const runtime = "edge";

export async function POST(req: NextRequest) {
    const identifier = getClientIp(req);

    if (!identifier) {
        return NextResponse.json({ error: 'No identifier found' }, { status: 400 })
    }

    checkRateLimit(req, identifier);

    try {
        const body = await req.json();
        const messages = body.messages ?? [];

        let openai;
        let modelConfig;
        try {
            ({ openai, modelConfig } = initializeOpenAI(body));
        } catch (error) {
            return error instanceof CustomError ? NextResponse.json({ error: error.message }, { status: error.status }) : null;
        }

        const customDocuments: DocumentInterface<Record<string, any>>[] = body.customDocuments ?? [];

        if (messages.length > 5) {
            return NextResponse.json({ error: "Too many messages" }, { status: 400 })
        }

        const previousMessages = messages.slice(0, -1);
        const currentMessageContent = messages[messages.length - 1].content;

        const retrieverSelected = body.retrieverSelection;

        const model = new ChatOpenAI({
            modelName: 'gpt-3.5-turbo-1106',
            temperature: 0,
            streaming: true,
        });

        let vectorstore: SupabaseVectorStore | MemoryVectorStore;

        try {
            vectorstore = await selectVectorStore(customDocuments);
        } catch (error) {
            return error instanceof CustomError ? NextResponse.json({ error: error.message }, { status: error.status }) : null;
        }

        const retriever = await dynamicRetrieverUtility(retrieverSelected, model, vectorstore, currentMessageContent, customDocuments);

        let retrievedDocs: DocumentInterface<Record<string, any>>[] = [];

        if (retriever instanceof CustomRetriever) {
            retrievedDocs = retriever.documents;
        } else {
            retrievedDocs = await retriever.getRelevantDocuments(
                currentMessageContent,
            );
        }

        let serializedSources = "";
        try {
            serializedSources = Buffer.from(
                JSON.stringify(
                    retrievedDocs.map((doc) => {
                        return {
                            pageContent: doc.pageContent.slice(0, 150) + "...",
                            metadata: doc.metadata,
                        };
                    }),
                ),
            ).toString("base64");
        } catch (e: any) {
            console.log("error serializing sources.");
        }

        const prompt = CONDENSE_QUESTION_TEMPLATE(previousMessages, currentMessageContent, retrievedDocs);

        let response: Stream<OpenAI.Chat.Completions.ChatCompletionChunk> | null = null;

        let stream: ReadableStream<any> | null = null;


        stream = modelConfig.modelName === 'command-r'
            ? await handleCohere(currentMessageContent, prompt, retrievedDocs)
            : await handleOpenAI(openai, modelConfig.modelName, prompt);

        if (!stream) {
            return NextResponse.json({ error: "Error handling response stream" }, { status: 500 });
        }



        return new StreamingTextResponse(stream, {
            headers: {
                "x-sources": serializedSources,
            },
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
    }
}
