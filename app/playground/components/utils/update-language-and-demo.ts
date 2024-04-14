import { getLlmCode, LLMLanguageOption, LLMOption } from "../../code-templates/get-llm-code-sample";
import { getRetrieverCode, RetrieverOption } from "../../code-templates/retriever-code-sample";
import { getTextSplitterCode } from "../../code-templates/text-splitter-code-sample";
import { getVectorStoreCode, VectorStoreOption } from "../../code-templates/vector-store-code-sample";
import { LanguageOption, SplitOption } from "../../lib/types";

export async function updateLanguageAndDemo(
  name: string,
  languageKey: LanguageOption,
  selectedSplitOption: SplitOption | undefined,
  selectedVectorStore: VectorStoreOption | undefined,
  selectedPlaygroundRetriever: RetrieverOption | undefined,
  selectedPlaygroundLlm: LLMOption | undefined,
  setLanguageDemo: React.Dispatch<React.SetStateAction<string>>,
  setLanguage: React.Dispatch<React.SetStateAction<string>>
) {
  let newLanguageDemo = "";

  switch (name) {
    case "Text Splitter":
      if (selectedSplitOption) {
        newLanguageDemo = await getTextSplitterCode(
          selectedSplitOption,
          languageKey,
          ""
        );
      }
      break;
    case "Vector Store":
      if (selectedVectorStore) {
        newLanguageDemo = await getVectorStoreCode(
          selectedVectorStore,
          languageKey,
          ""
        );
      }
      break;
    case "Retriever":
      if (selectedPlaygroundRetriever) {
        newLanguageDemo = await getRetrieverCode(
          selectedPlaygroundRetriever,
          languageKey,
          ""
        );
      }
      break;
    case "LLM":
      if (selectedPlaygroundLlm) {
        newLanguageDemo = await getLlmCode(
          selectedPlaygroundLlm,
          languageKey as LLMLanguageOption,
          ""
        );
      }
      break;
    default:
      console.log("No code to update");
      return;
  }

  setLanguageDemo(newLanguageDemo);
  setLanguage(languageKey);
}