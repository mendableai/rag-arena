
import aplyToast from "@/lib/aplyToaster";
import { getLlmCode, LLMLanguages, LLMOption } from "../../code-templates/get-llm-code-sample";
import { getRetrieverCode, RetrieverLanguages, RetrieverOption } from "../../code-templates/retriever-code-sample";
import { getTextSplitterCode, SplitOptionLanguages } from "../../code-templates/text-splitter-code-sample";
import { getVectorStoreCode, VectorStoreLanguages } from "../../code-templates/vector-store-code-sample";
import { LanguageOption, SplitOption, VectorStoreOption } from "../../lib/types";

export const findLanguageLink = (name: string, selectedOption: any, codeExampleLanguage: string) => {
    let optionLinks;
    switch (name) {
        case "Text Splitter":
            optionLinks = SplitOptionLanguages[selectedOption as SplitOption];
            break;
        case "Vector Store":
            optionLinks = VectorStoreLanguages[selectedOption as VectorStoreOption];
            break;
        case "Retriever":
            optionLinks = RetrieverLanguages[selectedOption as RetrieverOption];
            break;
        case "LLM":
            optionLinks = LLMLanguages[selectedOption as LLMOption];
            break;
        default:
            return "";
    }

    const languageLink = optionLinks?.find((option: any) => option.language === codeExampleLanguage)?.link;
    if (!languageLink) {
        aplyToast("No link found");
    }
    return languageLink || "";
};

export const updateLanguageDemo = async (name: string, selectedOption: any, languageKey: LanguageOption) => {
    let newLanguageDemo = "";
    switch (name) {
        case "Text Splitter":
            newLanguageDemo = await getTextSplitterCode(selectedOption as SplitOption, languageKey, "");
            break;
        case "Vector Store":
            newLanguageDemo = await getVectorStoreCode(selectedOption as VectorStoreOption, languageKey, "");
            break;
        case "Retriever":
            newLanguageDemo = await getRetrieverCode(selectedOption as RetrieverOption, languageKey, "");
            break;
        case "LLM":
            newLanguageDemo = await getLlmCode(selectedOption as LLMOption, languageKey as any, "");
            break;
        default:
            console.log("No code to update");
    }
    return newLanguageDemo;
};