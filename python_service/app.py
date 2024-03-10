from flask import Flask, jsonify
from retrievers import dummy_retriever

app = Flask(__name__)

@app.route('/api/dummy')
def get_dummy_data():
    data = dummy_retriever.dummy_retriever()
    return jsonify(data)