import { DocumentInterface } from "@langchain/core/documents";
import { type AttributeInfo } from "langchain/schema/query_constructor";

export const attributeInfo: AttributeInfo[] = [
  {
    name: "genre",
    description: "The genre of the movie",
    type: "string or array of strings",
  },
  {
    name: "year",
    description: "The year the movie was released",
    type: "number",
  },
  {
    name: "director",
    description: "The director of the movie",
    type: "string",
  },
  {
    name: "rating",
    description: "The rating of the movie (1-10)",
    type: "number",
  },
  {
    name: "length",
    description: "The length of the movie in minutes",
    type: "number",
  },
];


export const CONDENSE_QUESTION_TEMPLATE = (chat_history: any[], question: string, sources: DocumentInterface<Record<string, any>>[]) => {
  return `Given the chat history and the sources found, answer the current input in its original language.

  <Sources>
  ${!sources ?? "No sources found."}
  ${sources.map((source, index) => {
    return `${index}: source content: ${source.pageContent}\n
    source metadata: ${JSON.stringify(source.metadata, null, 2)}`
  }).join("\n")}
  </Sources>
  
  <chat_history>
    ${chat_history.map((message) => {
    return `\nrole: ${message.role}
      \ncontent: ${message.content}`
  }).join("\n")}
    
  </chat_history>
  
  Current Input: ${question}`
};
