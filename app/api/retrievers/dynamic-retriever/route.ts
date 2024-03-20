import supabase from "@/lib/supabase";
import { CustomRetriever } from "@/lib/types";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { DocumentInterface } from "@langchain/core/documents";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { CohereStream, OpenAIStream, StreamingTextResponse } from 'ai';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';
import { Stream } from "openai/streaming.mjs";
import { dynamicRetrieverUtility } from "./tools/config";
import { CONDENSE_QUESTION_TEMPLATE, VALID_MODELS } from "./tools/variables";

export const runtime = "edge";

function getClientIp(req: NextRequest) {
    return req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for') ?? req.ip;
}

export async function POST(req: NextRequest) {
    const identifier = getClientIp(req);

    if (!identifier) {
        return NextResponse.json({ error: 'No identifier found' }, { status: 400 })
    }

    if (process.env.PRODUCTION === "true") {
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        })
        const ratelimit = new Ratelimit({
            redis: redis,
            limiter: Ratelimit.fixedWindow(50, "180 m"),
        });
        const result = await ratelimit.limit(identifier);
        if (!result.success) {
            return NextResponse.json({ error: 'Rate limit achieved' }, { status: 429 })
        }
    }

    try {
        const body = await req.json();
        const messages = body.messages ?? [];

        if (!(body.chosenModel in VALID_MODELS)) {
            return NextResponse.json({ error: 'Invalid model selected' }, { status: 400 });
        }

        const modelConfig = VALID_MODELS[body.chosenModel];
        const apiKey = process.env[modelConfig.apiKeyEnv];

        if (!apiKey) {
            return NextResponse.json({ error: 'API key not found for selected model' }, { status: 500 });
        }

        const openai = new OpenAI({
            apiKey: apiKey!,
            baseURL: body.chosenModel === 'mistral' ? 'https://api.groq.com/openai/v1' : undefined,
        });

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

        if (customDocuments.length > 0) {
            vectorstore = await MemoryVectorStore.fromDocuments(
                customDocuments,
                new OpenAIEmbeddings()
            );
        } else {
            vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
                client: supabase,
                tableName: "documents",
                queryName: "match_documents",
            });
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

        const prompt = CONDENSE_QUESTION_TEMPLATE(previousMessages, currentMessageContent, retrievedDocs);
        
        let response: Stream<OpenAI.Chat.Completions.ChatCompletionChunk> | null = null;

        let stream: ReadableStream<any> | null = null;


        if (modelConfig.modelName === 'command-r') {

            const bodyResponse = JSON.stringify({
                model: "command-r",
                message: currentMessageContent,
                temperature: 0.2,
                chat_history: [{ "role": "SYSTEM", "message": "You are a helpful assistant." }, { "role": "USER", "message": prompt }],
                prompt_truncation: "AUTO",
                stream: true,
                citation_quality: "accurate",
                documents: retrievedDocs.map(doc => ({ pageContent: doc.pageContent }))
            })


            try {
                const response = await fetch('https://api.cohere.ai/v1/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.COHERE_API_KEY}`
                    },
                    body: bodyResponse
                })

                stream = CohereStream(response);
            } catch (e) {
                console.log(e);
                return NextResponse.json({ error: "Error with Cohere" }, { status: 500 });
            }

        } else {
            response = await openai.chat.completions.create({
                model: modelConfig.modelName,
                stream: true,
                messages: [
                    { "role": "system", "content": "You are a helpful assistant." },
                    { "role": "system", "content": prompt }
                ],
            });

            stream = OpenAIStream(response);
        }

        let serializedSources = "";
        try {
            serializedSources = Buffer.from(
                JSON.stringify(
                    retrievedDocs.map((doc) => {
                        return {
                            pageContent: doc.pageContent.slice(0, 100) + "...",
                            metadata: doc.metadata,
                        };
                    }),
                ),
            ).toString("base64");
        } catch (e: any) {
            console.log("error serializing sources.");
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
