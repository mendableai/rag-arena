from flask import Flask, jsonify, request
from retrievers.bm25_retriever import get_bm25_retriever
from supabase_functions.get_documents import get_documents
from retrievers import dummy_retriever
from flask_cors import CORS

app = Flask(__name__)


CORS(app)

@app.route('/api/dummy')
def get_dummy_data():
    data = dummy_retriever.dummy_retriever()
    return jsonify(data)

@app.route('/api/python-retrievers/graph-rag-li', methods=['POST'])
def graph_rag_li():
    query = request.json.get('query', '')
    data = get_bm25_retriever(query)
    return jsonify(data)

@app.route('/api/python-retrievers/bm-25-li', methods=['POST'])
def bm_25_li():
    query = request.json.get('query', '')
    data = get_bm25_retriever(query)
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
    
