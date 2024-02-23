import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { AIMessage, ChatMessage, HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { Message as VercelChatMessage } from "ai";
import { ContextualCompression, MultiQuery, MultiVector, ParentDocument, SelfQuery, SimilarityScore, TimeWeighted, VectorStore } from "./functions";

export function dynamicRetrieverUtility(
    retrieverSelected: string,
    chatModel: ChatOpenAI,
    vectorstore: SupabaseVectorStore,
    currentMessageContent: string,
) {
    switch (retrieverSelected) {
        case "contextual-compression":
            return ContextualCompression(
                chatModel,
                vectorstore,
            );
        case "multi-query":
            return MultiQuery(
                chatModel,
                vectorstore,
            );
        case "parent-document":
            return ParentDocument(
                vectorstore,
            );
        case "self-query":
            return SelfQuery(
                chatModel,
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