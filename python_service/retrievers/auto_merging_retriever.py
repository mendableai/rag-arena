import os

import openai
from llama_index.core import (Settings, StorageContext, VectorStoreIndex,
                              get_response_synthesizer)
from llama_index.core.node_parser import HierarchicalNodeParser, get_leaf_nodes
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.storage.docstore import SimpleDocumentStore
from llama_index.llms.openai import OpenAI
from llama_index.retrievers.bm25 import BM25Retriever
from supabase_functions.get_documents import get_documents
from transformations.docs_to_llama_index import docs_to_llama_index

openai.api_key = os.environ["OPENAI_API_KEY"]

def get_auto_merging_retriever(query):
    
    documents = docs_to_llama_index(get_documents())
    
    node_parser = HierarchicalNodeParser.from_defaults()
    nodes = node_parser.get_nodes_from_documents(documents)
    leaf_nodes = get_leaf_nodes(nodes)

    docstore = SimpleDocumentStore()
    docstore.add_documents(nodes)
    
    storage_context = StorageContext.from_defaults(docstore=docstore)
    
    base_index = VectorStoreIndex(
        leaf_nodes,
        storage_context=storage_context,
    )
    
    base_retriever = base_index.as_retriever(similarity_top_k=6)
    retriever = AutoMergingRetriever(base_retriever, storage_context, verbose=True)
    
    nodes = retriever.retrieve(query)
    
    content_metadata_pairs = [
        {"content": node.node.text, "metadata": node.node.metadata} 
        for node in nodes
    ]
    return {"documents": content_metadata_pairs}