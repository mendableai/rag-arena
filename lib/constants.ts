export const arrayOfRetrievers = [
    "vector-store",
    "contextual-compression",
    "multi-query",
    // "multi-vector",
    "parent-document",
    "self-query",
    "similarity-score",
    "time-weighted",
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
      description: "Transforms user input for metadata-focused retrieval.",
      fullName: "Self Query",
      link: "https://js.langchain.com/docs/modules/data_connection/retrievers/self_query",
    },
    "similarity-score": {
      description: "Custom short description needed.",
      fullName: "Similarity Score",
      link: "https://js.langchain.com/docs/modules/data_connection/retrievers/similarity-score-threshold-retriever",
    },
    "time-weighted": {
      description: "Combines semantic similarity and document recency.",
      fullName: "Time-Weighted Vectorstore",
      link: "https://js.langchain.com/docs/modules/data_connection/retrievers/time_weighted_vectorstore",
    },
  };
  