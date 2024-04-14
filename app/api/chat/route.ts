import { ChatOpenAI } from "@langchain/openai";
import { StreamingTextResponse } from 'ai';
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "./utilities/checkRateLimit";
import { dynamicRetrieverUtility } from "./utilities/config";
import { getClientIp } from "./utilities/getClientIp";
import { initializeOpenAI } from "./utilities/initializeOpenAI";
import { retrieveAndSerializeDocuments } from "./utilities/retrieveAndSerializeDocuments";
import { selectVectorStore } from "./utilities/selectVectorStore";
import { handleCohere, handleOpenAI } from "./utilities/serviceHandlers";
import { CONDENSE_QUESTION_TEMPLATE } from "./utilities/variables";

export const runtime = "edge";

export async function POST(req: NextRequest): Promise<Response> {
    try {
        const identifier = getClientIp(req);
        if (!identifier) {
            return NextResponse.json({ error: 'No identifier found' }, { status: 400 });
        }

        checkRateLimit(req, identifier);

        const body = await req.json();
        const { messages = [], customDocuments = [], retrieverSelection } = body;

        if (messages.length > 5) {
            return NextResponse.json({ error: "Too many messages" }, { status: 400 });
        }
        
        const { openai, modelConfig } = initializeOpenAI(body);

        const embeddingModel = new ChatOpenAI({
            modelName: 'gpt-3.5-turbo-1106',
            temperature: 0,
            streaming: true,
        });

        const vectorstore = await selectVectorStore(customDocuments);
        const currentMessageContent = messages[messages.length - 1]?.content || '';
        const retriever = await dynamicRetrieverUtility(retrieverSelection, embeddingModel, vectorstore, currentMessageContent, customDocuments);

        const { serializedSources, retrievedDocs } = await retrieveAndSerializeDocuments(retriever, currentMessageContent);
        const prompt = CONDENSE_QUESTION_TEMPLATE(messages.slice(0, -1), currentMessageContent, retrievedDocs);

        const stream = modelConfig.modelName === 'command-r'
            ? await handleCohere(currentMessageContent, retrievedDocs)
            : await handleOpenAI(openai, modelConfig.modelName, prompt);

        if (!stream) {
            return NextResponse.json({ error: "Error handling response stream" }, { status: 500 });
        }

        return new StreamingTextResponse(stream, {
            headers: { "x-sources": serializedSources },
        });
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({ error: "Error while retrieving and serializing documents" }, { status: 500 });
    }
}
