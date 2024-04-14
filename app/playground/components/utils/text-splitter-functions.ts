import { CharacterTextSplitter, RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function createDocumentFromText(
    text: string,
    metadata: { parameter: string; value: string }[],
    chunkSize: number,
    chunkOverlap: number,
    selectedSplitOption: string
) {
    let splitter;
    switch (selectedSplitOption) {
        case "split_by_character":
            splitter = new CharacterTextSplitter({
                separator: "\n",
                chunkSize: chunkSize,
                chunkOverlap: chunkOverlap,
            });
            break;

        case "recursive_character_text_splitter":
            splitter = new RecursiveCharacterTextSplitter({
                chunkSize: chunkSize,
                chunkOverlap: chunkOverlap,
            });
            break;
        default:
            return null;
    }

    const splitDocuments = await splitter.createDocuments([text]);

    const documentsWithMetadata = splitDocuments.map((doc) => {
        const additionalMetadata = metadata.reduce(
            (acc: Record<string, string>, { parameter, value }) => {
                acc[parameter] = value;
                return acc;
            },
            {}
        );

        return {
            ...doc,
            metadata: { ...doc.metadata, ...additionalMetadata },
        };
    });

    return documentsWithMetadata;
}