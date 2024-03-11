from llama_index.core import KnowledgeGraphIndex, SimpleDirectoryReader
from llama_index.core import StorageContext
from llama_index.core.query_engine import KnowledgeGraphQueryEngine
from llama_index.graph_stores.neo4j import Neo4jGraphStore

# from supabase_functions.get_documents import get_documents
# from transformations.docs_to_llama_index import docs_to_llama_index

from llama_index.llms.openai import OpenAI
# from IPython.display import Markdown, display

import os
from dotenv import load_dotenv

load_dotenv()

neoURI = os.getenv("NEO4J_URI")
neoPass = os.getenv("NEO4J_PASSWORD")

import logging
import sys
from llama_index.llms.openai import OpenAI
from llama_index.core import Settings

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

# define LLM
llm = OpenAI(temperature=0, model="gpt-3.5-turbo")
Settings.llm = llm
Settings.chunk_size = 512

# For Neo4j
def create_neo4j_graph_store():
    username = "neo4j"
    password = neoPass
    url = neoURI
    database = "neo4j"
    graph_store = Neo4jGraphStore(
        username=username,
        password=password,
        url=url,
        database=database,
    )

    storage_context = StorageContext.from_defaults(graph_store=graph_store)

    # NOTE: can take a while!
    # documents = docs_to_llama_index(get_documents())
    documents = SimpleDirectoryReader("./data/chunks", filename_as_id=True).load_data()
    index = KnowledgeGraphIndex.from_documents(
        documents,
        storage_context=storage_context,
        max_triplets_per_chunk=2,
        verbose=True,
    )
    # index.persist(persist_path="path_to_your_file.json")

def get_neo4j_retriever(query):
    username = "neo4j"
    password = neoPass
    url = neoURI
    database = "neo4j"
    graph_store = Neo4jGraphStore(
        username=username,
        password=password,
        url=url,
        database=database,
    )

    storage_context = StorageContext.from_defaults(graph_store=graph_store)
    query_engine = KnowledgeGraphQueryEngine(
        storage_context=storage_context,
        llm=llm,
        verbose=True,
    )

    response = query_engine.query(query)

    content_metadata_pairs = [
        {"content": response, "metadata": ''} 
    ]
    return {"documents": content_metadata_pairs}

create_neo4j_graph_store()

