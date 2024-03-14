import { DocumentInterface } from "@langchain/core/documents";

export class CustomRetriever {
  isCustom: boolean;
  documents: DocumentInterface<Record<string, any>>[];

  constructor(
    isCustom: boolean,
    documents: DocumentInterface<Record<string, any>>[]
  ) {
    this.isCustom = isCustom;
    this.documents = documents;
  }
}
