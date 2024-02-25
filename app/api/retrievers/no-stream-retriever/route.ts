import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { StreamingTextResponse } from "ai";
import { formatDocumentsAsString } from "langchain/util/document";
import { NextRequest, NextResponse } from "next/server";
import { dynamicRetrieverUtility } from "../dynamic-retriever/tools/config";

export const runtime = "edge";

export async function POST(req: NextRequest) {
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

        const client = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PRIVATE_KEY!,
        );

        const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
            client,
            tableName: "documents",
            queryName: "match_documents",
        });

        const SYSTEM_TEMPLATE = `Use the following pieces of context to answer the users question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
{context}`;

        const messagesvec = [
            SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
            HumanMessagePromptTemplate.fromTemplate("{question}"),
        ];
        const prompt = ChatPromptTemplate.fromMessages(messagesvec);

        const retriever = dynamicRetrieverUtility(retrieverSelected, model, vectorstore, currentMessageContent);

        const chain = RunnableSequence.from([
            {

                sourceDocuments: RunnableSequence.from([
                    (input) => input.question,
                    retriever,
                ]),
                chat_history: (input) => input.chat_history,
                question: (input) => input.question,
            },
            {

                sourceDocuments: (previousStepResult) => previousStepResult.sourceDocuments,
                question: (previousStepResult) => previousStepResult.question,
                context: (previousStepResult) =>
                    formatDocumentsAsString(previousStepResult.sourceDocuments),
            },
            {
                result: prompt.pipe(model).pipe(new StringOutputParser()),
                sourceDocuments: (previousStepResult) => previousStepResult.sourceDocuments,
            },
        ]);


        const transformStreamAndSourcesPromise = new Promise<{ stream: ReadableStream, sourceDocuments: string }>((resolve, reject) => {
            let sourceDocuments: any = [];

            const transformStream = new ReadableStream({
                async start(controller) {
                    try {
                        for await (const chunk of await chain.stream({
                            chat_history: previousMessages,
                            question: currentMessageContent,
                        })) {
                            if (chunk.sourceDocuments) {
                                sourceDocuments = chunk.sourceDocuments;
                            }
                            if (chunk.result !== undefined) {
                                const textChunk = typeof chunk.result === 'string' ? chunk.result : JSON.stringify(chunk.result);
                                controller.enqueue(textChunk);
                            }
                        }
                        controller.close();

                        const sourceDocumentsBase64 = Buffer.from(JSON.stringify(sourceDocuments.map((doc: { pageContent: string; metadata: any; }) => ({
                            pageContent: doc.pageContent.slice(0, 50) + "...",
                            metadata: doc.metadata,
                        }))), 'utf-8').toString('base64');

                        resolve({ stream: transformStream, sourceDocuments: sourceDocumentsBase64 });
                    } catch (error) {
                        reject(error);
                    }
                },
            });
        });

        try {
            const { stream, sourceDocuments } = await transformStreamAndSourcesPromise;
            return new StreamingTextResponse(stream, {
                headers: { 'x-sources': sourceDocuments }
            });
        } catch (e: any) {
            return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
        }


    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
    }
}
