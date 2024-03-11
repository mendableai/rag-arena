from llama_index.core import KnowledgeGraphIndex, SimpleDirectoryReader
from llama_index.core import StorageContext
from llama_index.core.query_engine import KnowledgeGraphQueryEngine
from llama_index.graph_stores.neo4j import Neo4jGraphStore
from llama_index.core.prompts import PromptTemplate, PromptType
from llama_index.core import load_index_from_storage
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
    documents = SimpleDirectoryReader("/Users/nicolascamara/Documents/GitHub/arena-chatbot/python_service/retrievers/data/chunks", filename_as_id=True).load_data()
    # index = KnowledgeGraphIndex(
    #     documents,
    #     storage_context=storage_context,
    #     max_triplets_per_chunk=2,
    #     verbose=True,
    # )
    # index.persist(persist_path="neo/storage")
    index = KnowledgeGraphIndex.from_documents(documents,
    storage_context=storage_context, max_triplets_per_chunk=2,
    include_embeddings=True
)
    index.storage_context.persist(persist_dir="neo/storage")

    # query_engine = index.as_query_engine(
    #     include_text=True,
    #     response_mode="tree_summarize",
    #     embedding_mode="hybrid",
    #     similarity_top_k=5,
    # )
    # print("\n\n\n")
    # response = query_engine.query(
    #     "Why does PG mention mountains and rivers in his LISP essay?"
    # )
    # print("\n\n\n")

    # print(response)

def get_neo4j_retriever(query):
    print("Using NEO4j")
    print(query)
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

    storage_context = StorageContext.from_defaults(persist_dir="neo/storage")
    DEFAULT_KG_RESPONSE_ANSWER_PROMPT_TMPL = """
    The original question is given below.
    This question has been translated into a Graph Database query.
    Both the Graph query and the response are given below.
    Given the Graph Query response, synthesise a response to the original question.

    Original question: {query_str}
    Graph query: {kg_query_str}
    Graph response: {kg_response_str}
    Response:
    """

    
    DEFAULT_NEO4J_NL2CYPHER_PROMPT_TMPL = (
    "Task:Generate Cypher statement to query a graph database.\n"
    "Instructions:\n"
    "Use only the provided relationship types and properties in the schema.\n"
    "Do not use any other relationship types or properties that are not provided.\n"
    "Schema:\n"
    "{schema}\n"
    "Note: Do not include any explanations or apologies in your responses.\n"
    "Do not respond to any questions that might ask anything else than for you "
    "to construct a Cypher statement. \n"
    "Do not include any text except the generated Cypher statement.\n"
    "\n"
    "The question is:\n"
    "{query_str}\n"
    )

    DEFAULT_NEO4J_NL2CYPHER_PROMPT = PromptTemplate(
        DEFAULT_NEO4J_NL2CYPHER_PROMPT_TMPL,
        prompt_type=PromptType.TEXT_TO_GRAPH_QUERY,
    )
    
    # query_engine = KnowledgeGraphQueryEngine(
    #     storage_context=storage_context,
    #     graph_query_synthesis_prompt=DEFAULT_NEO4J_NL2CYPHER_PROMPT,
    #     # graph_response_answer_prompt=DEFAULT_KG_RESPONSE_ANSWER_PROMPT,
    #     llm=OpenAI(temperature=0, model="gpt-4-0125-preview"),
    #     verbose=True,
    # )

    index = load_index_from_storage(storage_context=storage_context)
    query_engine = index.as_query_engine(
    include_text=True,
    response_mode="tree_summarize",
    embedding_mode="hybrid",
    similarity_top_k=5,
    )
   

    response = query_engine.query(query)


    content_metadata_pairs = [
        {"content": response.response, "metadata": response.get_formatted_sources()}
    ]
    return {"documents": content_metadata_pairs}

# create_neo4j_graph_store()

