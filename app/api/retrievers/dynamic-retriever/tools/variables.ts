import { type AttributeInfo } from "langchain/schema/query_constructor";

export const AGENT_SYSTEM_TEMPLATE = `You should only answer based on what you find in the documents. If you don't know how to answer a question just say you can't. Try to be concise and to the point.`;

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