from flask import Flask, jsonify, request
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


if __name__ == '__main__':
    app.run(debug=True)