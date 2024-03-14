import os
import pickle

from flask import Flask, jsonify, request
from flask_cors import CORS
from retrievers.auto_merging_retriever import get_auto_merging_retriever
from retrievers.bm25_retriever import get_bm25_retriever
# Import the necessary functions and classes for loading the index
from retrievers.neo4j_retriever import (StorageContext, get_neo4j_retriever,
                                        load_index_from_storage)
from retrievers.reciprocal_rerank_fusion import get_reciprocal_rerank_fusion
from retrievers.vector_retriever import get_vector_retriever

app = Flask(__name__)
CORS(app)

CACHE_FILE_PATH = "./index/cache/index_cache.pkl"

cached_index = None


def load_index():
    global cached_index
    if cached_index is None:

        if os.path.exists(CACHE_FILE_PATH):
            print("Loading index from cache file...")
            with open(CACHE_FILE_PATH, "rb") as cache_file:
                cached_index = pickle.load(cache_file)
        else:
            print("Loading index for the first time...")
            storage_context = StorageContext.from_defaults(
                persist_dir="./retrievers/neo/storage"
            )
            cached_index = load_index_from_storage(storage_context=storage_context)

            os.makedirs(os.path.dirname(CACHE_FILE_PATH), exist_ok=True)

            with open(CACHE_FILE_PATH, "wb") as cache_file:
                pickle.dump(cached_index, cache_file)
    else:
        print("Using cached index...")
    return cached_index


cached_index = load_index()


@app.route("/", methods=["GET"])
def baseRoute():
    return "Hello World"


@app.route("/api/python-retrievers/graph-rag-li", methods=["POST"])
def graph_rag_li():
    query = request.json.get("query", "")
    customDocuments = request.json.get("customDocuments", "")
    data = get_neo4j_retriever(query, cached_index, customDocuments)
    return jsonify(data)


@app.route("/api/python-retrievers/bm-25-li", methods=["POST"])
def bm_25_li():
    query = request.json.get("query", "")
    customDocuments = request.json.get("customDocuments", "")
    data = get_bm25_retriever(query, customDocuments)
    return jsonify(data)


@app.route("/api/python-retrievers/vector-store-li", methods=["POST"])
def vector_retriever_li():
    query = request.json.get("query", "")
    customDocuments = request.json.get("customDocuments", "")
    data = get_vector_retriever(query, customDocuments)
    return jsonify(data)


@app.route("/api/python-retrievers/reciprocal-rerank-fusion-li", methods=["POST"])
def reciprocal_rerank_fusion():
    query = request.json.get("query", "")
    customDocuments = request.json.get("customDocuments", "")
    data = get_reciprocal_rerank_fusion(query, customDocuments)
    return jsonify(data)


@app.route("/api/python-retrievers/auto-merging-retriever-li", methods=["POST"])
def auto_merging_retriever():
    query = request.json.get("query", "")
    customDocuments = request.json.get("customDocuments", "")
    data = get_auto_merging_retriever(query, customDocuments)
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
