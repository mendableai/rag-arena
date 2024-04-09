type SplitOption = 'split_by_character' | 'recursive_character_text_splitter';
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
      python: `
      with open("../../state_of_the_union.txt") as f:
          state_of_the_union = f.read()
      
      from langchain_text_splitters import RecursiveCharacterTextSplitter
      
      text_splitter = RecursiveCharacterTextSplitter(
          chunk_size=100,
          chunk_overlap=20,
          length_function=len,
          is_separator_regex=False,
      )
      
      texts = text_splitter.create_documents([state_of_the_union])`,
      typescript: `import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

      const text = "Hi./n/nI'm Harrison./n/nHow? Are? You?/nOkay then f f f f";
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 10,
        chunkOverlap: 1,
      });
      
      const output = await splitter.createDocuments([text]);`,
    },
  };

  return codeTemplates[splitOption]?.[language] || '';
}

export const SplitOptionLanguages = {
  split_by_character: [{
    language: "python",
    link: "https://python.langchain.com/docs/modules/data_connection/document_transformers/character_text_splitter/",
  },
  {
    language: "typescript",
    link: "https://js.langchain.com/docs/modules/data_connection/document_transformers/character_text_splitter",
  }
  ],
  recursive_character_text_splitter: [{
    language: "python",
    link: "https://python.langchain.com/docs/modules/data_connection/document_transformers/recursive_text_splitter/",
  },
  {
    language: "typescript",
    link: "https://js.langchain.com/docs/modules/data_connection/document_transformers/recursive_text_splitter",
  }
  ],
};

