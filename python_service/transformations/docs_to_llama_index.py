from typing import Any, Dict, List

from llama_index.core.schema import Document


def docs_to_llama_index(docs: List[Dict[str, Any]]) -> List[Document]:
    llama_docs = []
    for doc in docs:
        llama_doc = Document(
            text=doc['content'],
            metadata={
                "filename": doc['id'],
                "category": doc['collection_id']
            }
        )
        llama_docs.append(llama_doc)
    return llama_docs

def custom_docs_to_llama_index(documents):
    transformed_documents = []
    for doc in documents:
        
        transformed_document = Document(
            text=doc["pageContent"],  
            metadata=doc["metadata"] 
        )
        transformed_documents.append(transformed_document)
    return transformed_documents
