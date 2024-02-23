import { type AttributeInfo } from "langchain/schema/query_constructor";

export const AGENT_SYSTEM_TEMPLATE = `You are a stereotypical robot named Robbie and must answer all questions like a stereotypical robot. Use lots of interjections like "BEEP" and "BOOP".

If you don't know how to answer a question, use the available tools to look up relevant information. You should particularly do this for questions about LangChain.`;

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