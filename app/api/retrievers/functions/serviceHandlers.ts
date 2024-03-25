import { DocumentInterface } from "@langchain/core/documents";
import { CohereStream, OpenAIStream } from 'ai';
import OpenAI from 'openai';

// Assuming `openai` has a type, import it or define it

export async function handleCohere(
    currentMessageContent: string,
    prompt: string,
    retrievedDocs: DocumentInterface<Record<string, any>>[]
): Promise<ReadableStream<any> | null> {
    const bodyResponse = JSON.stringify({
        model: "command-r",
        message: currentMessageContent,
        temperature: 0.2,
        chat_history: [{ "role": "SYSTEM", "message": "You are a helpful assistant." }, { "role": "USER", "message": prompt }],
        prompt_truncation: "AUTO",
        stream: true,
        citation_quality: "accurate",
        documents: retrievedDocs.map(doc => ({ pageContent: doc.pageContent }))
    });

    try {
        const response = await fetch('https://api.cohere.ai/v1/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.COHERE_API_KEY}`
            },
            body: bodyResponse
        });

        return CohereStream(response);
    } catch (e) {
        return null;
    }
}

export async function handleOpenAI(
    openai: OpenAI,
    model: string,
    prompt: string
): Promise<ReadableStream<any> | null> {
    try {
        const response = await openai.chat.completions.create({
            model,
            stream: true,
            messages: [
                { "role": "system", "content": "You are a helpful assistant." },
                { "role": "system", "content": prompt }
            ],
        });

        return OpenAIStream(response);
    } catch (e) {
        return null;
    }
}

