#%pip install ipython-ngql nebula3-python
 
# Guide: https://docs.llamaindex.ai/en/latest/examples/query_engine/knowledge_graph_query_engine.html#optional-build-the-knowledge-graph-with-llamaindex
# For Nebula setup: https://docs.nebula-graph.io/3.6.0/2.quick-start/1.quick-start-workflow/
 
# First: LlamaIndex init
# For OpenAI
import os
from llama_index.core import SimpleDirectoryReader
from llama_index.core import KnowledgeGraphIndex
 
os.environ["OPENAI_API_KEY"] = "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"
 
import logging
import sys
 
logging.basicConfig(
    stream=sys.stdout, level=logging.INFO
)  # logging.DEBUG for more verbose output
 
# define LLM
from llama_index.llms.openai import OpenAI
from llama_index.core import Settings
 
Settings.llm = OpenAI(temperature=0, model="gpt-3.5-turbo")
Settings.chunk_size = 512
 
 
# Next: NebulaGraph init
os.environ["NEBULA_USER"] = "root"
os.environ["NEBULA_PASSWORD"] = "nebula"  # default is "nebula"
os.environ[
    "NEBULA_ADDRESS"
] = "127.0.0.1:9669"  # assumed we have NebulaGraph installed locally
 
space_name = "llamaindex"
edge_types, rel_prop_names = ["relationship"], [
    "relationship"
]  # default, could be omit if create from an empty kg
tags = ["entity"]  # default, could be omit if create from an empty kg
 
from llama_index.core import StorageContext
from llama_index.graph_stores.nebula import NebulaGraphStore
 
graph_store = NebulaGraphStore(
    space_name=space_name,
    edge_types=edge_types,
    rel_prop_names=rel_prop_names,
    tags=tags,
)
storage_context = StorageContext.from_defaults(graph_store=graph_store)
 
# Load data
documents = SimpleDirectoryReader("./data").load_data()
 
# Finally: LlamaIndex Knowledge Graph creation
kg_index = KnowledgeGraphIndex.from_documents(
    documents,
    storage_context=storage_context,
    max_triplets_per_chunk=10,
    space_name=space_name,
    edge_types=edge_types,
    rel_prop_names=rel_prop_names,
    tags=tags,
    include_embeddings=True,
)
 
# Query Engine
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.retrievers import KnowledgeGraphRAGRetriever
 
graph_rag_retriever = KnowledgeGraphRAGRetriever(
    storage_context=storage_context,
    verbose=True,
)
 
query_engine = RetrieverQueryEngine.from_args(
    graph_rag_retriever,
)
 
# Perform query
response = query_engine.query(
    "What object does Gregor's father throw at him?",
)
 
print (response)