import { DocumentInterface } from "@langchain/core/documents";
import { type AttributeInfo } from "langchain/schema/query_constructor";

export const attributeInfo: AttributeInfo[] = [
  {
    name: "title",
    description: "The title of the article",
    type: "string",
  },
  {
    name: "author",
    description: "The author of the article",
    type: "string",
  },
  {
    name: "date",
    description: "The date of the article",
    type: "string",
  }
];




export const VALID_MODELS: { [key: string]: { apiKeyEnv: string, modelName: string } } = {
  'mistral': { apiKeyEnv: 'GROQ_API_KEY', modelName: 'mixtral-8x7b-32768' },
  'gpt-3.5-turbo': { apiKeyEnv: 'OPENAI_API_KEY', modelName: 'gpt-3.5-turbo-1106' },
  'command-r': { apiKeyEnv: 'COHERE_API_KEY', modelName: 'command-r' },
};


export const COHERE_RAG_PREAMBLE = "You are a helpful assistant. Given a question and a set of provided documents, answer the question in English based on the documents. Be concise in your answer. If an answer is not found or derivable from the documents, try your best to answer based on the documents. You must use the documents to formulate your answer, they are the only source of truth!"
export const CONDENSE_QUESTION_TEMPLATE = (chat_history: any[], question: string, sources: DocumentInterface<Record<string, any>>[]) => {
  return `Given the chat history and the sources found, answer the current input in English. Be concise in your answer. If an answer is not found or derivable from the sources, try your best to answer based on the sources. YOU MUST USE THE SOURCES TO FORMULATE YOUR ANSWER, they are the only source of truth! 

  Here are the sources found (The only source of truth, no matter what, use them to answer the question):

  <Sources>
  ${!sources ?? "No sources found."}
  ${sources.map((source, index) => {
    const cleanedContent = source.pageContent.replace(/> Source \(Doc id: [^\)]+\): /g, '> Source: ');
    const cleanedMetadata = typeof source.metadata === 'string' ? (source.metadata as string).replace(/Doc id: [^\)]+\)/g, '') : source.metadata;
    return `${index}: source content: ${cleanedContent}\n
    source metadata: ${JSON.stringify(cleanedMetadata, null, 2)}`
  }).join("\n")}
  </Sources>

  Here are the chat history:

  <chat_history>
    ${chat_history.map((message) => {
    return `\nrole: ${message.role}
      \ncontent: ${message.content}`
  }).join("\n")}
  </chat_history>
  
  Current Input: ${question}

  REMEMBER: YOU MUST USE THE SOURCES TO FORMULATE YOUR ANSWER.
  
  Begin!`
};
