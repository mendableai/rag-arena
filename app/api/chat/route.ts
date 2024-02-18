import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { LangChainStream, Message, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
    const { messages } = await req.json();

    const { stream, handlers } = LangChainStream();

    const llm = new ChatOpenAI({
        streaming: true,
    });

    llm
        .call(
            (messages as Message[]).map(m =>
                m.role == 'user'
                    ? new HumanMessage(m.content)
                    : new AIMessage(m.content),
            ),
            {},
            [handlers],
        )
        .catch(console.error);

    return new StreamingTextResponse(stream);
}
