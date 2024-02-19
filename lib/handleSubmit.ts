import { Message } from "ai";

export async function handleSubmit({ input, chatHistory, setChatHistory }: {
    input: string;
    chatHistory: Message[];
    setChatHistory: (chatHistory: Message[] | ((prevChatHistory: Message[]) => Message[])) => void;
}) {
    const newUserEntry: Message = {
        id: `${Math.random().toString(36).substring(7)}`,
        role: "user",
        content: input,
        createdAt: new Date(),
    };

    const newChatHistory = [...chatHistory, newUserEntry];

    setChatHistory(newChatHistory);

    let receivedContent = "";

    await fetch("api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: newChatHistory,
        }),
    }).then(async (response: any) => {
        const reader = response.body?.getReader();

        const aiMessageId = `${Math.random().toString(36).substring(7)}`;

        const newAiMessage: Message = {
            id: aiMessageId,
            role: "assistant",
            content: "",
            createdAt: new Date(),
        };

        setChatHistory((prev: Message[]) => [...prev, newAiMessage]);

        while (true) {
            const { done, value } = await reader?.read();
            if (done) break;
            receivedContent += new TextDecoder().decode(value);

            setChatHistory((prev: Message[]) =>
                prev.map((msg: Message) =>
                    msg.id === aiMessageId ? { ...msg, content: receivedContent } : msg
                )
            );
        }
    });
}
