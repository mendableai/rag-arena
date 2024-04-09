export type RetrieverOption = "vector_store" | "multi_query";

export type LanguageOption = "python" | "typescript";


export async function getRetrieverCode(splitOption: RetrieverOption, language: LanguageOption, variable: string): Promise<string> {

  const dynamicPart = variable ? `dynamicPart = ${variable};` : '';

  const codeTemplates = {
    vector_store: {
      python: `
            from langchain_community.document_loaders import TextLoader

            loader = TextLoader("../../state_of_the_union.txt")
            
            from langchain_community.vectorstores import FAISS
            from langchain_openai import OpenAIEmbeddings
            from langchain_text_splitters import CharacterTextSplitter
            
            documents = loader.load()
            text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
            texts = text_splitter.split_documents(documents)
            embeddings = OpenAIEmbeddings()
            db = FAISS.from_documents(texts, embeddings)
            
            retriever = db.as_retriever()
            
            docs = retriever.get_relevant_documents("what did he say about ketanji brown jackson")`,
      typescript: `
            import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
            import { HNSWLib } from "langchain/vectorstores/hnswlib";
            import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
            import * as fs from "fs";
            
            // Initialize the LLM to use to answer the question.
            const model = new OpenAI({});
            const text = fs.readFileSync("state_of_the_union.txt", "utf8");
            const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
            const docs = await textSplitter.createDocuments([text]);
            
            // Create a vector store from the documents.
            const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
            
            // Initialize a retriever wrapper around the vector store
            const vectorStoreRetriever = vectorStore.asRetriever();
            
            const docs = await retriever.getRelevantDocuments(
              "what did he say about ketanji brown jackson"
            );`,
    },
    multi_query: {
      python: `
            # Build a sample vectorDB
            from langchain_community.document_loaders import WebBaseLoader
            from langchain_community.vectorstores import Chroma
            from langchain_openai import OpenAIEmbeddings
            from langchain_text_splitters import RecursiveCharacterTextSplitter
            
            # Load blog post
            loader = WebBaseLoader("https://lilianweng.github.io/posts/2023-06-23-agent/")
            data = loader.load()
            
            # Split
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
            splits = text_splitter.split_documents(data)
            
            # VectorDB
            embedding = OpenAIEmbeddings()
            vectordb = Chroma.from_documents(documents=splits, embedding=embedding)
            
            from langchain.retrievers.multi_query import MultiQueryRetriever
            from langchain_openai import ChatOpenAI

            question = "What are the approaches to Task Decomposition?"
            llm = ChatOpenAI(temperature=0)
            retriever_from_llm = MultiQueryRetriever.from_llm(
                retriever=vectordb.as_retriever(), llm=llm
            )

            # Set logging for the queries
            import logging

            logging.basicConfig()
            logging.getLogger("langchain.retrievers.multi_query").setLevel(logging.INFO)

            unique_docs = retriever_from_llm.get_relevant_documents(query=question)
            len(unique_docs)`,
      typescript: `
            import { MemoryVectorStore } from "langchain/vectorstores/memory";
            import { CohereEmbeddings } from "@langchain/cohere";
            import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
            import { ChatAnthropic } from "@langchain/anthropic";
            
            const vectorstore = await MemoryVectorStore.fromTexts(
              [
                "Buildings are made out of brick",
                "Buildings are made out of wood",
                "Buildings are made out of stone",
                "Cars are made out of metal",
                "Cars are made out of plastic",
                "mitochondria is the powerhouse of the cell",
                "mitochondria is made of lipids",
              ],
              [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
              new CohereEmbeddings()
            );
            const model = new ChatAnthropic({});
            const retriever = MultiQueryRetriever.fromLLM({
              llm: model,
              retriever: vectorstore.asRetriever(),
              verbose: true,
            });
            
            const query = "What are mitochondria made of?";
            const retrievedDocs = await retriever.getRelevantDocuments(query);`,
    }
  };

  return codeTemplates[splitOption]?.[language] || '';
}

export const RetrieverLanguages = {
  vector_store: [{
    language: "python",
    link: "https://python.langchain.com/docs/modules/data_connection/retrievers/vectorstore/"
  },
  {
    language: "typescript",
    link: "https://js.langchain.com/docs/modules/data_connection/retrievers/self_query/memory-self-query"
  }],
  multi_query: [{
    language: "python",
    link: "https://python.langchain.com/docs/modules/data_connection/retrievers/MultiQueryRetriever/"
  },
  {
    language: "typescript",
    link: "https://js.langchain.com/docs/modules/data_connection/retrievers/multi-query-retriever"
  }]
};

