import os

import openai
from llama_index.core import VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.retrievers import QueryFusionRetriever
from llama_index.llms.openai import OpenAI
from llama_index.retrievers.bm25 import BM25Retriever
from supabase_functions.get_documents import get_documents
from transformations.docs_to_llama_index import docs_to_llama_index

openai.api_key = os.environ["OPENAI_API_KEY"]

def get_vector_retriever(query):
    splitter = SentenceSplitter(chunk_size=1024)
    documents = docs_to_llama_index(get_documents())
    index = VectorStoreIndex.from_documents(documents, transformations=[splitter])

    retriever = index.as_retriever(similarity_top_k=2)
    
    retrieved_nodes = retriever.retrieve(query)
    
    content_metadata_pairs = [
        {"content": node.node.text, "metadata": node.node.metadata} 
        for node in retrieved_nodes
    ]
    return {"documents": content_metadata_pairs}


