import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { type Document } from "@langchain/core/documents";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
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
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { attributeInfo } from "./variables";



export function ContextualCompression(
    model: ChatOpenAI,
    vectorstore: SupabaseVectorStore,
) {
    let resolveWithDocuments: (value: Document[]) => void;
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
    let resolveWithDocuments: (value: Document[]) => void;

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

export async function ParentDocument(
    vectorstore: SupabaseVectorStore,
    currentMessageContent: string,
) {

    const temporaryVectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
    const docstore = new InMemoryStore();
    
    const retriever = new ParentDocumentRetriever({
        vectorstore: temporaryVectorStore,
        docstore,

        parentSplitter: new RecursiveCharacterTextSplitter({
            chunkOverlap: 0,
            chunkSize: 500,
        }),
        childSplitter: new RecursiveCharacterTextSplitter({
            chunkOverlap: 0,
            chunkSize: 50,
        }),

        childK: 20,

        parentK: 5,
    });

    const vstoreRetriever = vectorstore.asRetriever();

    const parentDocuments = await vstoreRetriever.getRelevantDocuments(
        currentMessageContent,
    );

    await retriever.addDocuments(parentDocuments);

    return retriever;

}

export function SelfQuery(
    model: ChatOpenAI,
    vectorstore: SupabaseVectorStore,
    currentMessageContent: string,
) {
    let resolveWithDocuments: (value: Document[]) => void;

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
    let resolveWithDocuments: (value: Document[]) => void;

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
    vectorstore: SupabaseVectorStore,
    currentMessageContent: string,
) {
    const vectorstore2 = new MemoryVectorStore(new OpenAIEmbeddings());

    const retriever = new TimeWeightedVectorStoreRetriever({
        vectorStore: vectorstore2,
        memoryStream: [],
        searchKwargs: 2,
    });

    const vstoreRetriever = vectorstore.asRetriever();

    const documents = await vstoreRetriever.getRelevantDocuments(
        currentMessageContent,
    );

   
    await retriever.addDocuments(documents);

    return retriever
}

export function VectorStore(
    vectorstore: SupabaseVectorStore
) {
    let resolveWithDocuments: (value: Document[]) => void;

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
    let resolveWithDocuments: (value: Document[]) => void;
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