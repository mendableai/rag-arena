import OpenAI from 'openai';
import { CustomError } from './config';
import { VALID_MODELS } from './variables';

export function initializeOpenAI(body: any) {
    const normalizedModel = body.chosenModel.replace(/-/g, '_');
    
    if (!(normalizedModel in VALID_MODELS)) {
        throw new CustomError('Invalid model selecteda', 400);
    }

    const modelConfig = VALID_MODELS[normalizedModel];
    
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