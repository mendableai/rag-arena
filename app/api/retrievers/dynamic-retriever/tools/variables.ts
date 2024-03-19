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


export const CONDENSE_QUESTION_TEMPLATE = (chat_history: any[], question: string, sources: DocumentInterface<Record<string, any>>[]) => {
  return `Given the chat history and the sources found, answer the current input in English. Be concise in your answer. If an answer is not found or derivable from the sources, try your best to answer based on the sources. YOU MUST USE THE SOURCES TO FORMULATE YOUR ANSWER, they are the only source of truth! 

  Here are the sources found (The only source of truth, no matter what, use them to answer the question):

  <Sources>
  ${!sources ?? "No sources found."}
  ${sources.map((source, index) => {
    return `${index}: source content: ${source.pageContent}\n
    source metadata: ${JSON.stringify(source.metadata, null, 2)}`
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
