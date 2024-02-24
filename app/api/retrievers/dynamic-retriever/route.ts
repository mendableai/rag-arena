import { StreamingTextResponse, Message as VercelChatMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import {
    BytesOutputParser,
    StringOutputParser,
} from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { combineDocumentsFn, dynamicRetrieverUtility, formatVercelMessages } from "./tools/config";
import { documentPromise } from "./tools/functions";
import { answerPrompt, condenseQuestionPrompt } from "./tools/variables";

export const runtime = "edge";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const messages = (body.messages ?? []).filter(
            (message: VercelChatMessage) =>
                message.role === "user" || message.role === "assistant",
        );

        const retrieverSelected = body.retrieverSelection;

        const previousMessages = messages.slice(0, -1);
        const currentMessageContent = messages[messages.length - 1].content;

        const model = new ChatOpenAI({
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

        const standaloneQuestionChain = RunnableSequence.from([
            condenseQuestionPrompt,
            model,
            new StringOutputParser(),
        ]);

        const retriever = dynamicRetrieverUtility(retrieverSelected, model, vectorstore, currentMessageContent);

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
            const documents = await documentPromise;
            serializedSources = Buffer.from(
                JSON.stringify(
                    documents.map((doc) => {
                        return {
                            pageContent: doc.pageContent.slice(0, 50) + "...",
                            metadata: doc.metadata,
                        };
                    }),
                ),
            ).toString("base64");
        } catch (e: any) {
            console.log("error serializing sources.");
            serializedSources = "error fetching sources.";
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
