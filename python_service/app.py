from flask import Flask, jsonify, request
from retrievers.hybrid_retriever import get_retriever
from supabase_functions.get_documents import get_documents
from retrievers import dummy_retriever

app = Flask(__name__)

@app.route('/api/dummy')
def get_dummy_data():
    data = dummy_retriever.dummy_retriever()
    return jsonify(data)

@app.route('/api/python-retrievers/graph-rag-li', methods=['POST'])
def graph_rag_li():
    query = request.json.get('query', '')
    data = dummy_retriever.dummy_retriever(query)
    return jsonify(data)

get_retriever()

if __name__ == '__main__':

    app.run(debug=True)
    
