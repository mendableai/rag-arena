import { Message } from "ai";
interface HandleSubmitParams {
    input: string;
    chatHistory: Message[];
    setChatHistory: (newHistory: Message[] | ((currentHistory: Message[]) => Message[])) => void;
    retrieverSelection: string;
}
export async function handleSubmit({ input, chatHistory, setChatHistory, retrieverSelection }: HandleSubmitParams) {

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

        const response = await fetch(`api/retrievers/dynamic-retriever`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: newChatHistory,
                retrieverSelection,
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

        while (true) {
            const { done, value } = await reader.read();


            if (done) {

                setChatHistory((prev: Message[]) =>
                    prev.map((msg: Message) =>
                        msg.id === aiMessageId ? { ...msg, annotations: sources } : msg
                    )
                );

                break;
            };
            receivedContent += new TextDecoder().decode(value);

            setChatHistory((prev: Message[]) =>
                prev.map((msg: Message) =>
                    msg.id === aiMessageId ? { ...msg, content: receivedContent } : msg
                )
            );


        }

    } catch (error) {
        return "Error while fetching response from retriever."
    }
}
