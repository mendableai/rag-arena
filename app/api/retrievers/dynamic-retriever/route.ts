import supabase from "@/lib/supabase";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { BytesOutputParser, StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { combineDocumentsFn, dynamicRetrieverUtility, formatVercelMessages } from "./tools/config";
import { answerPrompt, condenseQuestionPrompt } from "./tools/variables";

export const runtime = "edge";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})
const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(50, "180 m"),
});

function getClientIp(req: NextRequest) {
    return req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for') ?? req.ip;
}

export async function POST(req: NextRequest) {
    const identifier = getClientIp(req);

    console.log(identifier);
    
    if (!identifier) {
        return NextResponse.json({ error: 'No identifier found' }, { status: 400 })
    }
    const result = await ratelimit.limit(identifier);
    
    if (!result.success) {
        
        return NextResponse.json({ error: 'Rate limit achieved' }, { status: 429 })
    }

    try {
        const body = await req.json();
        const messages = body.messages ?? [];

        const previousMessages = messages.slice(0, -1);
        const currentMessageContent = messages[messages.length - 1].content;

        const retrieverSelected = body.retrieverSelection;

        const model = new ChatOpenAI({
            modelName: "gpt-3.5-turbo-1106",
            temperature: 0.2,
            streaming: true,
        });


        const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
            client: supabase,
            tableName: "documents",
            queryName: "match_documents",
        });


        const standaloneQuestionChain = RunnableSequence.from([
            condenseQuestionPrompt,
            model,
            new StringOutputParser(),
        ]);

        const retriever = dynamicRetrieverUtility(retrieverSelected, model, vectorstore, currentMessageContent);

        const retrievedDocs = await retriever.getRelevantDocuments(
            currentMessageContent,
        );

        const retrievalChain = retriever.pipe(combineDocumentsFn);

        const answerChain = RunnableSequence.from([
            {
                context: RunnableSequence.from([
                    (input) => input.question,
                    retrievalChain,
                ]),
                chat_history: (input) => input.chat_history,
                question: (input) => input.question,

            },
            answerPrompt,
            model,
        ]);


        const conversationalRetrievalQAChain = RunnableSequence.from([
            {
                question: standaloneQuestionChain,
                chat_history: (input) => input.chat_history,

            },
            answerChain,
            new BytesOutputParser(),

        ]);

        const stream = await conversationalRetrievalQAChain.stream({
            question: currentMessageContent,
            chat_history: formatVercelMessages(previousMessages),
        });

        let serializedSources = "";
        try {
            serializedSources = Buffer.from(
                JSON.stringify(
                    retrievedDocs.map((doc) => {
                        return {
                            pageContent: doc.pageContent.slice(0, 50) + "...",
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
