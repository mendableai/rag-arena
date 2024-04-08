export type RetrieverOption = "vector_store" | "multi_query";

export type LanguageOption = "python" | "typescript";


export async function getRetrieverCode(splitOption: RetrieverOption, language: LanguageOption, variable: string): Promise<string> {

    const dynamicPart = variable ? `dynamicPart = ${variable};` : '';

    const codeTemplates = {
        vector_store: {
            python: `Not done yet!`,
            typescript: `Not done yet!`,
        },
        multi_query: {
            python: `aaaa`,
            typescript: `aaaaaaaa`,
        }
    };

    return codeTemplates[splitOption]?.[language] || '';
}

export const RetrieverLanguages = {
    vector_store: ["python", "typescript"],
    multi_query: ["python", "typescript"],
};

