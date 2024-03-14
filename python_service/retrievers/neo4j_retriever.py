import os
from pathlib import Path

from dotenv import load_dotenv
from llama_index.core import (KnowledgeGraphIndex, SimpleDirectoryReader,
                              StorageContext, load_index_from_storage)
from llama_index.graph_stores.neo4j import Neo4jGraphStore
from llama_index.llms.openai import OpenAI
from transformations.docs_to_llama_index import custom_docs_to_llama_index

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

neoURI = os.getenv("NEO4J_URI")
neoPass = os.getenv("NEO4J_PASSWORD")

import logging
import sys

from llama_index.core import Settings
from llama_index.llms.openai import OpenAI

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

llm = OpenAI(temperature=0, model="gpt-3.5-turbo", api_key=os.getenv("OPENAI_API_KEY"))
Settings.llm = llm
Settings.chunk_size = 512


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

    documents = SimpleDirectoryReader(
        "./retrievers/data/chunks", filename_as_id=True
    ).load_data()

    index = KnowledgeGraphIndex.from_documents(
        documents,
        storage_context=storage_context,
        max_triplets_per_chunk=2,
        include_embeddings=True,
    )

    print("finished saving nodes")
    index.storage_context.persist(persist_dir="./retrievers/neo/storage")
    print("index_saved")


def get_neo4j_retriever(query, index, customDocuments):

    if len(customDocuments) > 0:

        documents = custom_docs_to_llama_index(customDocuments)

        index = KnowledgeGraphIndex.from_documents(
            documents,
            max_triplets_per_chunk=2,
            include_embeddings=True,
        )

        query_engine = index.as_query_engine(
            include_text=True,
            response_mode="tree_summarize",
            embedding_mode="hybrid",
        )

    else:
        query_engine = index.as_query_engine(
            include_text=True,
            response_mode="tree_summarize",
            embedding_mode="hybrid",
        )

    response = query_engine.query(query)

    content_metadata_pairs = [
        {"content": response.response, "metadata": response.get_formatted_sources()}
    ]
    return {"documents": content_metadata_pairs}


# should uncomment bellow if the files are already in the correct directory.

storage_dir = "./retrievers/neo/storage"
# if not os.path.exists(storage_dir) or not os.listdir(storage_dir):
# create_neo4j_graph_store()
