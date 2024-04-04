from langchain_text_splitters import CharacterTextSplitter


def split_by_character(text: str, splitOption: int):

    print("got here\n\n\n\n\n")

    if splitOption == 1:

        text_splitter = CharacterTextSplitter(
            separator="\n\n",
            chunk_size=100,
            chunk_overlap=20,
            length_function=len,
            is_separator_regex=False,
        )

    elif splitOption == 2:
        separator = " "
    elif splitOption == 3:
        separator = "."
    else:
        raise ValueError("Invalid split option provided.")

    documents = text_splitter.create_documents([text])

    print(documents)
    return [doc.page_content for doc in documents]

