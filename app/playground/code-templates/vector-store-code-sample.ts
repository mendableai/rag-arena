import { LanguageOption, VectorStoreOption } from "../lib/types";


export async function getVectorStoreCode(splitOption: VectorStoreOption, language: LanguageOption, variable: string): Promise<string> {

    const dynamicPart = variable ? `dynamicPart = ${variable};` : '';
    console.log(splitOption, language, variable);
    
    const codeTemplates = {
        supabase: {
            python: `Not done yet!`,
            typescript: `Not done yet!`,
        },
        pinecone: {
            python: `ababa`,
            typescript: `abababa`,
        },
        mongodb: {
            python: `aba`,
            typescript: `ababa`,
        },
        in_memory: {
            python: `Not done yet!`,
            typescript: `
            import { MemoryVectorStore } from "langchain/vectorstores/memory";
            import { OpenAIEmbeddings } from "@langchain/openai";
            import { TextLoader } from "langchain/document_loaders/fs/text";
            
            // Create docs with a loader
            const loader = new TextLoader("src/document_loaders/example_data/example.txt");
            const docs = await loader.load();
            
            // Load the docs into the vector store
            const vectorStore = await MemoryVectorStore.fromDocuments(
              docs,
              new OpenAIEmbeddings()
            );
            
            // Search for the most similar document
            const resultOne = await vectorStore.similaritySearch("hello world", 1);
            
            console.log(resultOne);`,
        },
    };
    
    return codeTemplates[splitOption]?.[language] || '';
}

export const VectorStoreLanguages = {
    supabase: ["python", "typescript"],
    pinecone: ["python", "typescript"],
    mongodb: ["python", "typescript"],
    in_memory: ["python", "typescript"],
};

