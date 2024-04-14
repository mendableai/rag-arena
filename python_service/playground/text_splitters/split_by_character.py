from langchain_text_splitters import CharacterTextSplitter


def create_document_from_text(text: str, metadata: list[dict[str, str]], chunk_size: int, chunk_overlap: int):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=500,
        chunk_overlap=200,
        length_function=len, 
        is_separator_regex=False,
    )

    split_documents = text_splitter.create_documents([text])

    documents_with_metadata = []
    for doc in split_documents:
        additional_metadata = {item['parameter']: item['value'] for item in metadata}
        doc_with_metadata = {
            **doc,
            "metadata": {**doc.get("metadata", {}), **additional_metadata},
        }
        documents_with_metadata.append(doc_with_metadata)

    return documents_with_metadata
