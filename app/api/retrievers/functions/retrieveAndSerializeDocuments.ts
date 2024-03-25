import { CustomRetriever } from "@/lib/types";
import { DocumentInterface } from "@langchain/core/documents";

export async function retrieveAndSerializeDocuments(retriever: any, currentMessageContent: string): Promise<{ serializedSources: string; retrievedDocs: DocumentInterface<Record<string, any>>[] }> {
    let retrievedDocs: DocumentInterface<Record<string, any>>[] = [];

    if (retriever instanceof CustomRetriever) {
        retrievedDocs = retriever.documents;
    } else {
        retrievedDocs = await retriever.getRelevantDocuments(currentMessageContent);
    }

    let serializedSources = "";
    try {
        serializedSources = Buffer.from(
            JSON.stringify(
                retrievedDocs.map((doc) => ({
                    pageContent: doc.pageContent.slice(0, 150) + "...",
                    metadata: doc.metadata,
                })),
            ),
        ).toString("base64");
    } catch (e: any) {
        console.error("Error serializing sources.", e);
    }

    return { serializedSources, retrievedDocs };
}