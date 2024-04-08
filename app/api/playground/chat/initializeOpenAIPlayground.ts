import OpenAI from 'openai';
import { CustomError } from '../../chat/utilities/config';
import { VALID_MODELS } from '../../chat/utilities/variables';

export function initializeOpenAIPlayground(selectedPlaygroundLlm: string,) {
    if (!(selectedPlaygroundLlm in VALID_MODELS)) {
        throw new CustomError('Invalid model selected', 400);
    }

    const modelConfig = VALID_MODELS[selectedPlaygroundLlm];
    const apiKey = process.env[modelConfig.apiKeyEnv];

    if (!apiKey) {
        throw new CustomError('API key not found for selected model', 404);
    }

    return {
        modelConfig,
        openai: new OpenAI({
            apiKey: apiKey!,
            baseURL: selectedPlaygroundLlm === 'mistral' ? 'https://api.groq.com/openai/v1' : undefined,
        })
    };
}