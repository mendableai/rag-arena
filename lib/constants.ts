export const arrayOfRetrievers = [
  "vector-store",
  "contextual-compression",
  "multi-query",
  // "multi-vector",
  "parent-document",
  // "self-query",
  "similarity-score",
  // "time-weighted",
  "bm-25-li",
  "vector-store-li",
  "reciprocal-rerank-fusion-li",
  "auto-merging-retriever-li",
  "graph-rag-li"
];

export const retrieverInfo = {
  "vector-store": {
    description: "Simplest method, creates text embeddings.",
    fullName: "Vector Store",
    link: "https://js.langchain.com/docs/modules/data_connection/retrievers/vectorstore",
  },
  "contextual-compression": {
    description: "Extracts most relevant information from documents.",
    fullName: "Contextual Compression",
    link: "https://js.langchain.com/docs/modules/data_connection/retrievers/contextual_compression",
  },
  "multi-query": {
    description: "Generates multiple queries from one, for complex questions.",
    fullName: "Multi-Query Retriever",
    link: "https://js.langchain.com/docs/modules/data_connection/retrievers/multi-query-retriever",
  },
  "multi-vector": {
    description: "Creates multiple vectors per document for better relevance.",
    fullName: "Multi Vector",
    link: "https://js.langchain.com/docs/modules/data_connection/retrievers/multi-vector-retriever",
  },
  "parent-document": {
    description: "Indexes multiple chunks, retrieves whole document.",
    fullName: "Parent Document",
    link: "https://js.langchain.com/docs/modules/data_connection/retrievers/parent-document-retriever",
  },
  "self-query": {
    description: "Transforms user input for metadata-focused RAG.",
    fullName: "Self Query",
    link: "https://js.langchain.com/docs/modules/data_connection/retrievers/self_query",
  },
  "similarity-score": {
    description: "Scores documents based on similarity to user input.",
    fullName: "Similarity Score",
    link: "https://js.langchain.com/docs/modules/data_connection/retrievers/similarity-score-threshold-retriever",
  },
  "time-weighted": {
    description: "Combines semantic similarity and document recency.",
    fullName: "Time-Weighted Vectorstore",
    link: "https://js.langchain.com/docs/modules/data_connection/retrievers/time_weighted_vectorstore",
  },
  "bm-25-li": {
    description: "BM25 is a ranking function used to estimate the relevance of documents.",
    fullName: "BM 25",
    link: "https://docs.llamaindex.ai/en/stable/examples/retrievers/bm25_retriever.html"
  },
  "vector-store-li": {
    description: "Vector stores contain embedding vectors of ingested document chunks.",
    fullName: "Llama Vector Store",
    link: "https://docs.llamaindex.ai/en/latest/examples/vector_stores/AsyncIndexCreationDemo.html",
  },
  "reciprocal-rerank-fusion-li": {
    description: "Retrieved nodes will be reranked according to the Reciprocal Rerank Fusion.",
    fullName: "Reciprocal Rerank Fusion",
    link: "https://docs.llamaindex.ai/en/stable/examples/retrievers/reciprocal_rerank_fusion.html"
  },
  "auto-merging-retriever-li": {
    description: "Looks at a set of leaf nodes and recursively “merges” subsets of leaf nodes.",
    fullName: "Auto Merging Retriever",
    link: "https://docs.llamaindex.ai/en/stable/examples/retrievers/auto_merging_retriever.html"
  },
  "graph-rag-li": {
    description: "Knowledge-enabled RAG approach to retrieve information from Knowledge Graph.",
    fullName: "Knowledge Graph RAG",
    link: "https://docs.llamaindex.ai/en/stable/examples/query_engine/knowledge_graph_rag_query_engine.html"
  }

}
