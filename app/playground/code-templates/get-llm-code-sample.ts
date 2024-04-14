export type LLMOption = "mistral" | "gpt_3x5_turbo";

export type LLMLanguageOption = "typescript";


export async function getLlmCode(splitOption: LLMOption, language: LLMLanguageOption, variable: string): Promise<string> {

    const dynamicPart = variable ? `dynamicPart = ${variable};` : '';

    const codeTemplates = {
        mistral: {
            typescript: `# Typescript code for Vercel AI SDK Mistral
            import { MistralStream, StreamingTextResponse } from 'ai';
 
            import MistralClient from '@mistralai/mistralai';
            
            const mistral = new MistralClient(process.env.MISTRAL_API_KEY || '');
            
            export async function POST(req: Request) {
            // Extract the "messages" from the body of the request
            const { messages } = await req.json();
            
            const response = mistral.chatStream({
                model: 'mistral-small',
                maxTokens: 1000,
                messages,
            });
            
            // Convert the response into a friendly text-stream. The Mistral client responses are
            // compatible with the Vercel AI SDK MistralStream adapter.
            const stream = MistralStream(response);
            
            // Respond with the stream
            return new StreamingTextResponse(stream);
            }`,
        },
        gpt_3x5_turbo: {
            typescript: `// Typescript code for Vercel AI SDK OpenAI
            import OpenAI from 'openai';
            import { OpenAIStream, StreamingTextResponse } from 'ai';
            
            // Create an OpenAI API client (that's edge friendly!)
            const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            });
            
            // IMPORTANT! Set the runtime to edge
            export const runtime = 'edge';
            
            export async function POST(req: Request) {
            const { messages } = await req.json();
            
            // Ask OpenAI for a streaming chat completion given the prompt
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                stream: true,
                messages,
            });
            
            // Convert the response into a friendly text-stream
            const stream = OpenAIStream(response);
            // Respond with the stream
            return new StreamingTextResponse(stream);
            }`,
        }
    };

    return codeTemplates[splitOption]?.[language] || '';
}

export const LLMLanguages = {
    mistral: [
        {
            language: "typescript",
            link: "https://sdk.vercel.ai/docs/guides/providers/mistral"
        }],
    gpt_3x5_turbo: [
        {
            language: "typescript",
            link: "https://sdk.vercel.ai/docs/guides/providers/openai"
        }]
};

