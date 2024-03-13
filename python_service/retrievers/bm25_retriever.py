from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.retrievers import QueryFusionRetriever
from llama_index.llms.openai import OpenAI
from llama_index.retrievers.bm25 import BM25Retriever
from supabase_functions.get_documents import get_documents
from transformations.docs_to_llama_index import docs_to_llama_index


def get_bm25_retriever(query):
    splitter = SentenceSplitter(chunk_size=1024)
    documents = docs_to_llama_index(get_documents())
    nodes = splitter.get_nodes_from_documents(documents)
    retriever = BM25Retriever.from_defaults(nodes=nodes, similarity_top_k=4)
    retrieved_nodes = retriever.retrieve(query)
    content_metadata_pairs = [
        {"content": node.node.text, "metadata": node.node.metadata}
        for node in retrieved_nodes
    ]
    return {"documents": content_metadata_pairs}
