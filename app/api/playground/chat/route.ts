import { ChatOpenAI } from '@langchain/openai';
import { experimental_StreamData, OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { dynamicRetrieverUtility } from '../../chat/utilities/config';
import { retrieveAndSerializeDocuments } from '../../chat/utilities/retrieveAndSerializeDocuments';
import { selectVectorStore } from '../../chat/utilities/selectVectorStore';
import { CONDENSE_QUESTION_TEMPLATE } from '../../chat/utilities/variables';
import { initializeOpenAIPlayground } from './initializeOpenAIPlayground';

export const runtime = 'edge';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {

    try {
        const { messages, selectedPlaygroundLlm, inMemory, selectedVectorStore, customPlaygroundChunks, selectedPlaygroundRetriever } = await req.json();

        console.log(selectedPlaygroundLlm);


        if (messages.length > 10) {
            return NextResponse.json({ error: "Too many messages" }, { status: 400 });
        }

        const { openai, modelConfig } = initializeOpenAIPlayground(selectedPlaygroundLlm);
        const embeddingModel = new ChatOpenAI({
            modelName: 'gpt-3.5-turbo-1106',
            temperature: 0,
            streaming: true,
        });

        const vectorstore = await selectVectorStore(customPlaygroundChunks);

        const currentMessageContent = messages[messages.length - 1]?.content || '';
        const retriever = await dynamicRetrieverUtility(selectedPlaygroundRetriever, embeddingModel, vectorstore, currentMessageContent, customPlaygroundChunks);

        const { serializedSources, retrievedDocs } = await retrieveAndSerializeDocuments(retriever, currentMessageContent);
        const prompt = CONDENSE_QUESTION_TEMPLATE(messages.slice(0, -1), currentMessageContent, retrievedDocs);


        const data = new experimental_StreamData();
        const response = await openai.chat.completions.create({
            model: modelConfig.modelName,
            stream: true,
            messages: [
                { "role": "system", "content": "You are a helpful assistant." },
                { "role": "system", "content": prompt }
            ],
        });

        data.append({
            serializedSources,
        });

        const stream = OpenAIStream(response, {
            onFinal() {
                data.close(); 
            },
            experimental_streamData: true,
        });

        if (!stream) {
            return NextResponse.json({ error: "Error handling response stream" }, { status: 500 });
        }


        return new StreamingTextResponse(stream, {}, data);
    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: "Error while retrieving and serializing documents" }, { status: 500 });
    }
}