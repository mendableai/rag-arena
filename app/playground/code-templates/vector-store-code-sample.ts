export type VectorStoreOption = "supabase" | "pinecone" | "mongodb" | "in_memory";

export type LanguageOption = "python" | "typescript";


export async function getVectorStoreCode(splitOption: VectorStoreOption, language: LanguageOption, variable: string): Promise<string> {

    const dynamicPart = variable ? `dynamicPart = ${variable};` : '';

    const codeTemplates = {
        supabase: {
            python: `# Python code for Supabase vector store
            Not done yet!`,
            typescript: `// Typescript code for Supabase vector store
            Not done yet!`,
        },
        pinecone: {
            python: `# Python code for Pinecone vector store
            Not done yet!`,
            typescript: `// Typescript code for Pinecone vector store
            Not done yet!`,
        },
        mongodb: {
            python: `# Python code for MongoDB vector store
            Not done yet!`,
            typescript: `// Typescript code for MongoDB vector store
            Not done yet!`,
        },
        in_memory: {
            python: `# Python code for in memory vector store
            from langchain_openai import ChatOpenAI
            from langchain.prompts import (
                ChatPromptTemplate,
                MessagesPlaceholder,
                SystemMessagePromptTemplate,
                HumanMessagePromptTemplate,
            )
            from langchain.chains import LLMChain
            from langchain.memory import ConversationBufferMemory
            
            
            llm = ChatOpenAI()
            prompt = ChatPromptTemplate(
                messages=[
                    SystemMessagePromptTemplate.from_template(
                        "You are a nice chatbot having a conversation with a human."
                    ),
                    # The "variable_name" here is what must align with memory
                    MessagesPlaceholder(variable_name="chat_history"),
                    HumanMessagePromptTemplate.from_template("{question}")
                ]
            )
            # Notice that we "return_messages=True" to fit into the MessagesPlaceholder
            # Notice that "chat_history" aligns with the MessagesPlaceholder name.
            memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
            conversation = LLMChain(
                llm=llm,
                prompt=prompt,
                verbose=True,
                memory=memory
            )
            
            # Notice that we just pass in the "question" variables - "chat_history" gets populated by memory
            conversation({"question": "hi"})`,
            typescript: `// Typescript code for in memory vector store
            import { MemoryVectorStore } from "langchain/vectorstores/memory";
            import { OpenAIEmbeddings } from "@langchain/openai";
            import { TextLoader } from "langchain/document_loaders/fs/text";
            
            // Create docs with a loader
            const loader = new TextLoader("src/document_loaders/example_data/example.txt");
            const docs = await loader.load();
            
            // Load the docs into the vector store
            const vectorStore = await MemoryVectorStore.fromDocuments(
              docs,
              new OpenAIEmbeddings()
            );
            
            // Search for the most similar document
            const resultOne = await vectorStore.similaritySearch("hello world", 1);
            
            console.log(resultOne);`,
        },
    };

    return codeTemplates[splitOption]?.[language] || '';
}

export const VectorStoreLanguages = {
    supabase: [{
        language: "python",
        link: "https://python.langchain.com/docs/integrations/vectorstores/supabase/",
    },
    {
        language: "typescript",
        link: "https://js.langchain.com/docs/integrations/vectorstores/supabase",
    }],
    pinecone: [{
        language: "python",
        link: "https://python.langchain.com/docs/integrations/vectorstores/pinecone/",
    },
    {
        language: "typescript",
        link: "https://js.langchain.com/docs/integrations/vectorstores/pinecone",
    }],
    mongodb: [{
        language: "python",
        link: "https://python.langchain.com/docs/integrations/vectorstores/mongodb_atlas/",
    },
    {
        language: "typescript",
        link: "https://js.langchain.com/docs/integrations/vectorstores/mongodb_atlas",
    }],
    in_memory: [{
        language: "python",
        link: "https://python.langchain.com/docs/modules/memory/",
    },
    {
        language: "typescript",
        link: "https://js.langchain.com/docs/modules/memory/",
    }],
};

