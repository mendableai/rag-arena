import { CustomRetriever } from "@/lib/types";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { AIMessage, ChatMessage, HumanMessage } from "@langchain/core/messages";
import { BaseRetriever } from "@langchain/core/retrievers";
import { ChatOpenAI } from "@langchain/openai";
import { Message as VercelChatMessage } from "ai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { BaseRetrieverLI, ContextualCompression, MultiQuery, MultiVector, ParentDocument, SelfQuery, SimilarityScore, TimeWeighted, VectorStore } from "./functions";



export async function dynamicRetrieverUtility(
    retrieverSelected: string,
    model: ChatOpenAI,
    vectorstore: SupabaseVectorStore | MemoryVectorStore,
    currentMessageContent: string,
): Promise<BaseRetriever | CustomRetriever> {

    if (retrieverSelected.includes("-li")) {
        return BaseRetrieverLI({
            query: currentMessageContent,
            retrieverId: retrieverSelected,
        })
    }

    switch (retrieverSelected) {
        case "contextual-compression":
            return ContextualCompression(
                model,
                vectorstore,
            );
        case "multi-query":
            return MultiQuery(
                model,
                vectorstore,
            );
        case "parent-document":
            return ParentDocument(
                vectorstore,
                currentMessageContent,
            );
        case "self-query":
            return SelfQuery(
                model,
                vectorstore,
                currentMessageContent,
            );
        case "similarity-score":
            return SimilarityScore(
                vectorstore,
            );
        case "time-weighted":
            return TimeWeighted(
                vectorstore,
                currentMessageContent,
            );
        case "vector-store":
            return VectorStore(
                vectorstore,
            )
        case "multi-vector":
            return MultiVector(
                vectorstore,
            )
        default:
            throw new Error("Invalid retriever selection");
    }
}

export const vercelToLangchainMessage = (message: VercelChatMessage) => {
    if (message.role === "user") {
        return new HumanMessage(message.content);
    } else if (message.role === "assistant") {
        return new AIMessage(message.content);
    } else {
        return new ChatMessage(message.content, message.role);
    }
};

export const combineDocumentsFn = (docs: Document[]) => {
    const serializedDocs = docs.map((doc) => doc.pageContent);
    return serializedDocs.join("\n\n");
};


export const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
    const formattedDialogueTurns = chatHistory.map((message) => {
        if (message.role === "user") {
            return `Human: ${message.content}`;
        } else if (message.role === "assistant") {
            return `Assistant: ${message.content}`;
        } else {
            return `${message.role}: ${message.content}`;
        }
    });
    return formattedDialogueTurns.join("\n");
};
