import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { type Document } from "@langchain/core/documents";
import { ChatOpenAI } from "@langchain/openai";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import { MultiVectorRetriever } from "langchain/retrievers/multi_vector";
import { ParentDocumentRetriever } from "langchain/retrievers/parent_document";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";
import { SelfQueryRetriever } from "langchain/retrievers/self_query";
import { SupabaseTranslator } from "langchain/retrievers/self_query/supabase";
import { TimeWeightedVectorStoreRetriever } from "langchain/retrievers/time_weighted";
import { InMemoryStore } from "langchain/storage/in_memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { attributeInfo } from "./variables";

let resolveWithDocuments: (value: Document[]) => void;

export const documentPromise = new Promise<Document[]>((resolve) => {
    resolveWithDocuments = resolve;
  });

export function ContextualCompression(
    model: ChatOpenAI,
    vectorstore: SupabaseVectorStore,
) {
    const baseCompressor = LLMChainExtractor.fromLLM(model);

    return new ContextualCompressionRetriever({
        baseCompressor,
        baseRetriever: vectorstore.asRetriever(),
        callbacks: [
            {
                handleRetrieverEnd(documents) {
                    resolveWithDocuments(documents);
                },
            },
        ],
    })
}

export function MultiQuery(
    model: ChatOpenAI,
    vectorstore: SupabaseVectorStore,
) {

    return MultiQueryRetriever.fromLLM({
        llm: model,
        retriever: vectorstore.asRetriever(),
        verbose: false,
        callbacks: [
            {
                handleRetrieverEnd(documents) {
                    resolveWithDocuments(documents);
                },
            },
        ],
    });
}

export function ParentDocument(
    vectorstore: SupabaseVectorStore,
) {

    const docstore = new InMemoryStore();

    return new ParentDocumentRetriever({
        vectorstore,
        docstore,
        childSplitter: new RecursiveCharacterTextSplitter(),
        callbacks: [
            {
                handleRetrieverEnd(documents) {
                    resolveWithDocuments(documents);
                },
            },
        ],
    });
}

export function SelfQuery(
    model: ChatOpenAI,
    vectorstore: SupabaseVectorStore,
    currentMessageContent: string,
) {

    return SelfQueryRetriever.fromLLM({
        llm: model,
        vectorStore: vectorstore,
        documentContents: currentMessageContent,
        attributeInfo,
        structuredQueryTranslator: new SupabaseTranslator(),
        callbacks: [
            {
                handleRetrieverEnd(documents) {
                    resolveWithDocuments(documents);
                },
            },
        ],
    })
}

export function SimilarityScore(
    vectorstore: SupabaseVectorStore,
) {

    return ScoreThresholdRetriever.fromVectorStore(vectorstore, {
        minSimilarityScore: 0,
        maxK: 5,
        kIncrement: 2,
        callbacks: [
            {
                handleRetrieverEnd(documents) {
                    resolveWithDocuments(documents);
                },
            },
        ]
    });
}

export async function TimeWeighted(
    vectorstore: SupabaseVectorStore
) {
    const retriever = new TimeWeightedVectorStoreRetriever({
        vectorStore: vectorstore,
        memoryStream: [],
        searchKwargs: 2,
        callbacks: [
            {
                handleRetrieverEnd(documents) {
                    resolveWithDocuments(documents);
                },
            },
        ]
    });

    const documents = [
        "My name is John.",
        "My name is Bob.",
        "My favourite food is pizza.",
        "My favourite food is pasta.",
        "My favourite food is sushi.",
    ].map((pageContent) => ({ pageContent, metadata: {} }));

    await retriever.addDocuments(documents);

    return retriever
}

export function VectorStore(
    vectorstore: SupabaseVectorStore
) {

    return vectorstore.asRetriever({
        callbacks: [
            {
                handleRetrieverEnd(documents) {
                    resolveWithDocuments(documents);
                },
            },
        ],
    });
}

export function MultiVector(
    vectorstore: SupabaseVectorStore,
) {
    const byteStore = new InMemoryStore<Uint8Array>();

    return new MultiVectorRetriever({
        vectorstore,
        byteStore,
        callbacks: [
            {
                handleRetrieverEnd(documents) {
                    resolveWithDocuments(documents);
                },
            },
        ],
    });

}