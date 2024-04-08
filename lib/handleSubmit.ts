import { DocumentInterface } from "@langchain/core/documents";
import { Message } from "ai";

interface HandleSubmitParams {
    customDocuments: DocumentInterface<Record<string, any>>[];
    input: string;
    chatHistory: Message[];
    setChatHistory: (newHistory: Message[] | ((currentHistory: Message[]) => Message[])) => void;
    retrieverSelection: string;
    setLoading: (isLoading: boolean) => void;
    chosenModel: string;
}

export async function handleSubmit({ customDocuments, input, chatHistory, setChatHistory, retrieverSelection, setLoading, chosenModel }: HandleSubmitParams) {
    setLoading(true);

    const newUserEntry: Message = {
        id: `${Math.random().toString(36).substring(7)}`,
        role: "user",
        content: input,
        createdAt: new Date(),
    };

    const newChatHistory = [...chatHistory, newUserEntry];

    setChatHistory(newChatHistory);

    try {
        let receivedContent = "";

        const response = await fetch(`api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: newChatHistory,
                retrieverSelection,
                customDocuments,
                chosenModel
            }),
        });

        const sourcesHeader = response.headers.get("x-sources");
        const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : [];

        const reader = response.body?.getReader();

        const aiMessageId = `${Math.random().toString(36).substring(7)}`;

        const newAiMessage: Message = {
            id: aiMessageId,
            role: "assistant",
            content: "",
            createdAt: new Date(),
            annotations: [],
        };

        setChatHistory((prev: Message[]) => [...prev, newAiMessage]);

        if (!reader) {
            throw new Error("Response body reader is undefined");
        }

        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 10000, { done: true }));
 
        while (true) {
            const result = await Promise.race([
                reader.read(),
                timeoutPromise
            ]);
            const { done, value } = result as { done: boolean; value: Uint8Array };
            if (done) {
                setLoading(false);
                if (receivedContent === "") {
                    setChatHistory((prev: Message[]) =>
                        prev.map((msg: Message) =>
                            msg.id === aiMessageId ? { ...msg, content: "timeout exceeded and no answer was found from the retriever", annotations: sources } : msg
                        )
                    );
                } else {
                    setChatHistory((prev: Message[]) =>
                        prev.map((msg: Message) =>
                            msg.id === aiMessageId ? { ...msg, annotations: sources } : msg
                        )
                    );
                }
                break;
            }
            receivedContent += new TextDecoder().decode(value);

            setChatHistory((prev: Message[]) =>
                prev.map((msg: Message) =>
                    msg.id === aiMessageId ? { ...msg, content: receivedContent } : msg
                )
            );
        }



    } catch (error) {
        setLoading(false);
        return "Error while fetching response from retriever."
    }
}
