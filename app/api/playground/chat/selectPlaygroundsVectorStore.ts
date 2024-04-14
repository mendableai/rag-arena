import supabase from "@/lib/supabase";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { DocumentInterface } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export async function selectPlaygroundsVectorStore(customDocuments: DocumentInterface<Record<string, any>>[], inMemory: boolean, selectedVectorStore: string) {

    let vectorstore: SupabaseVectorStore | MemoryVectorStore;

    if (customDocuments.length > 0 && inMemory) {
        vectorstore = await MemoryVectorStore.fromDocuments(
            customDocuments,
            new OpenAIEmbeddings()
        );
    } else {

        switch (selectedVectorStore) {
            case "supabase":
                vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
                    client: supabase,
                    tableName: "documents",
                    queryName: "match_documents",
                });
                break;
            default:
                throw new Error("Invalid vector store selected");
        }
    }

    return vectorstore;
}