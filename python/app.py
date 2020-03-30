from flask import Flask, jsonify, request
from flask_cors import CORS

from funcs import randomize, master_search

app = Flask(__name__)

CORS(app)

@app.route("/", methods=['GET', 'POST'])
def index():
  if request.method == 'POST':
    some_json = request.get_json()

    thing = randomize(some_json["elems"])

    return jsonify({'res': thing}), 200
  else:
    return jsonify({'res': 'Hello World!'}), 200

@app.route("/search", methods=['GET', 'POST'])
def query():
  if request.method == 'POST':
    some_json = request.get_json()

    thing = master_search(some_json['query'], some_json['elems'])

    return jsonify({'res': thing}), 200
  else:
    return jsonify({'res': 'Search, Wrong req type!'}), 200

if __name__ == '__main__':
  app.run(debug=True)