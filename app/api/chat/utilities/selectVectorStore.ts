import supabase from "@/lib/supabase";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { DocumentInterface } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export async function selectVectorStore(customDocuments: DocumentInterface<Record<string, any>>[]) {
    let vectorstore: SupabaseVectorStore | MemoryVectorStore;

    if (customDocuments.length > 0) {
        vectorstore = await MemoryVectorStore.fromDocuments(
            customDocuments,
            new OpenAIEmbeddings()
        );
    } else {
        vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
            client: supabase,
            tableName: "documents",
            queryName: "match_documents",
        });
    }

    return vectorstore;
}