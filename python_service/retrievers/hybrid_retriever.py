from llama_index.core.retrievers import QueryFusionRetriever
import os
import openai
from supabase_functions.get_documents import get_documents

from transformations.docs_to_llama_index import docs_to_llama_index

openai.api_key = os.environ["OPENAI_API_KEY"]
from llama_index.core import VectorStoreIndex

def get_retriever():
    print(docs_to_llama_index(get_documents())[2])
# def get_retriever():
#     index_1 = VectorStoreIndex.from_documents(documents_1)
#     retriever = QueryFusionRetriever(
#     [index_1.as_retriever(), index_2.as_retriever()],
#     similarity_top_k=2,
#     num_queries=4,  # set this to 1 to disable query generation
#     use_async=True,
#     verbose=True,
#     # query_gen_prompt="...",  # we could override the query generation prompt here
# )