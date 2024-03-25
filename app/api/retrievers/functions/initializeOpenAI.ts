import OpenAI from 'openai';
import { CustomError } from '../dynamic-retriever/tools/config';
import { VALID_MODELS } from '../dynamic-retriever/tools/variables';

export function initializeOpenAI(body: any) {
    if (!(body.chosenModel in VALID_MODELS)) {
        throw new CustomError('Invalid model selected', 400);
    }

    const modelConfig = VALID_MODELS[body.chosenModel];
    const apiKey = process.env[modelConfig.apiKeyEnv];

    if (!apiKey) {
        throw new CustomError('API key not found for selected model', 404);
    }

    return {
        modelConfig,
        openai: new OpenAI({
            apiKey: apiKey!,
            baseURL: body.chosenModel === 'mistral' ? 'https://api.groq.com/openai/v1' : undefined,
        })
    };
}