
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, from your Flask backend!'

@app.route('/add_event', methods=['POST'])
def add_event():
    data = request.get_json()
    print("Received event data:", data)
    return jsonify({"message": "Event received successfully!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
