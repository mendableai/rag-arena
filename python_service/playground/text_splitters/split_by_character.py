from langchain_text_splitters import CharacterTextSplitter


def split_by_character(text: str, splitOption: int):

    if splitOption == 1:

        text_splitter = CharacterTextSplitter(
            separator="\n\n",
            chunk_size=500,
            chunk_overlap=200,
            length_function=len,
            is_separator_regex=False,
        )

    elif splitOption == 2:
        separator = " "
    elif splitOption == 3:
        separator = "."
    else:
        raise ValueError("Invalid split option provided.")

    texts = text_splitter.create_documents([text])
    print(texts[0])

    return texts
