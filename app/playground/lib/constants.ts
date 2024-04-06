export const retrieversForPlayground = {
    "vector-store": {
        description: "Simplest method, creates text embeddings.",
        fullName: "Vector Store",
        link: "https://js.langchain.com/docs/modules/data_connection/retrievers/vectorstore",
    },
    "multi-query": {
        description: "Generates multiple queries from one, for complex questions.",
        fullName: "Multi-Query Retriever",
        link: "https://js.langchain.com/docs/modules/data_connection/retrievers/multi-query-retriever",
    },
}

export const PLAYGROUND_VECTOR_STORES = [
    {
        id: 1,
        title: "Pinecone",
        value: "pinecone",
    },
    {
        id: 2,
        title: "Supabase (postgres)",
        value: "supabase",
    },
    {
        id: 3,
        title: "MongoDB (atlas)",
        value: "mongodb",
    },
];

export const PLAYGROUND_LLMS: { [key: string]: { apiKeyEnv: string, modelName: string } } = {
    'mistral': { apiKeyEnv: 'GROQ_API_KEY', modelName: 'mixtral-8x7b-32768' },
    'gpt-3.5-turbo': { apiKeyEnv: 'OPENAI_API_KEY', modelName: 'gpt-3.5-turbo-1106' },
    'command-r': { apiKeyEnv: 'COHERE_API_KEY', modelName: 'command-r' },
};