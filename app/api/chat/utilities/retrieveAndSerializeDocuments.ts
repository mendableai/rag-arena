import { CustomRetriever } from "@/lib/types";
import { DocumentInterface } from "@langchain/core/documents";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

export async function retrieveAndSerializeDocuments(retriever: any, currentMessageContent: string): Promise<{ serializedSources: string; retrievedDocs: DocumentInterface<Record<string, any>>[] }> {
    let retrievedDocs: DocumentInterface<Record<string, any>>[] = [];

    if (retriever instanceof CustomRetriever) {
        retrievedDocs = retriever.documents;
    } else {
        retrievedDocs = await retriever.getRelevantDocuments(currentMessageContent);
    }

    try {
        const rerankResponse = await cohere.rerank({
            documents: retrievedDocs.map(doc => ({ text: doc.pageContent })),
            query: currentMessageContent,
            topN: 3,
        });

        retrievedDocs = rerankResponse.results.map(result => ({
            ...retrievedDocs[result.index],
            metadata: {
                ...retrievedDocs[result.index].metadata,
                relevanceScore: result.relevanceScore
            }
        }));
    } catch (e) {
        console.error("Error reranking documents with Cohere.", e);
        retrievedDocs = retrievedDocs.slice(0, 3);
    }
 
    let serializedSources = "";
    try {
        serializedSources = Buffer.from(
            JSON.stringify(
                retrievedDocs.map((doc) => ({
                    pageContent: doc.pageContent.slice(0, 150) + "...",
                    metadata: {
                        ...doc.metadata,
                        relevanceScore: doc.metadata.relevanceScore, 
                    },
                })),
            ),
        ).toString("base64");
    } catch (e: any) {
        console.error("Error serializing sources.", e);
    }

    return { serializedSources, retrievedDocs };
}