from flask import Flask, jsonify, request
from flask_cors import CORS
from retrievers import dummy_retriever
from retrievers.auto_merging_retriever import get_auto_merging_retriever
from retrievers.bm25_retriever import get_bm25_retriever
from retrievers.neo4j_retriever import get_neo4j_retriever
from retrievers.reciprocal_rerank_fusion import get_reciprocal_rerank_fusion
from retrievers.vector_retriever import get_vector_retriever
from supabase_functions.get_documents import get_documents

app = Flask(__name__)

CORS(app)

@app.route('/', methods=['GET'])
def baseRoute():
    return "Hello World"

@app.route('/api/dummy')
def get_dummy_data():
    data = dummy_retriever.dummy_retriever()
    return jsonify(data)

@app.route('/api/python-retrievers/graph-rag-li', methods=['POST'])
def graph_rag_li():
    query = request.json.get('query', '')
    data = get_neo4j_retriever(query)
    return jsonify(data)

@app.route('/api/python-retrievers/bm-25-li', methods=['POST'])
def bm_25_li():
    query = request.json.get('query', '')
    data = get_bm25_retriever(query)
    return jsonify(data)

@app.route('/api/python-retrievers/vector-store-li', methods=['POST'])
def vector_retriever_li():
    query = request.json.get('query', '')
    data = get_vector_retriever(query)
    return jsonify(data)

@app.route('/api/python-retrievers/reciprocal-rerank-fusion-li', methods=['POST'])
def reciprocal_rerank_fusion():
    query = request.json.get('query', '')
    data = get_reciprocal_rerank_fusion(query)
    return jsonify(data)

@app.route('/api/python-retrievers/auto-merging-retriever-li', methods=['POST'])
def auto_merging_retriever():
    query = request.json.get('query', '')
    data = get_auto_merging_retriever(query)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
    
