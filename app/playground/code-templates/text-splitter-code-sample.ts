type SplitOption = 'split_by_character' | 'recursive_character_text_splitter' | 'semantic_chunking';
type LanguageOption = 'python' | 'typescript';

export async function getTextSplitterCode(splitOption: SplitOption, language: LanguageOption, variable: string): Promise<string> {

  const dynamicPart = variable ? `dynamicPart = ${variable};` : '';

  const codeTemplates = {
    split_by_character: {
      python: `
      from langchain_text_splitters import CharacterTextSplitter
${dynamicPart}
      text_splitter = CharacterTextSplitter(
          separator="/n/n",
          chunk_size=1000,
          chunk_overlap=200,
          length_function=len,
          is_separator_regex=False,
      )

      texts = text_splitter.create_documents("TEXT TO SPLIT")
      print(texts[0])
`,
      typescript: `
      import { Document } from "langchain/document";
      import { CharacterTextSplitter } from "langchain/text_splitter";
      
      const text = "foo bar baz 123";
      const splitter = new CharacterTextSplitter({
        separator: " ",
        chunkSize: 7,
        chunkOverlap: 3,
      });
      const output = await splitter.createDocuments([text]);`,
    },
    recursive_character_text_splitter: {
      python: `aaa`,
      typescript: `bbb`,
    },
    semantic_chunking: {
      python: `aaabbb`,
      typescript: `abababa`,
    },
  };

  return codeTemplates[splitOption]?.[language] || '';
}

export const SplitOptionLanguages = {
  split_by_character: ["python", "typescript"],
  recursive_character_text_splitter: ["python", "typescript"],
  semantic_chunking: ["python", "typescript"],
};