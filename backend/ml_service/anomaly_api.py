from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "ML Anomaly Detection API is running"}), 200

@app.route("/api/anomaly")
def anomaly():
    # Your existing code to load model and return anomalies
    return jsonify([
        {"id": "1", "lat": 19.0, "lng": 72.8, "type": "Illegal Cutting", "timestamp": "2025-08-31T05:58:00", "validation": "Anomaly"}
    ])

if __name__ == "__main__":
    app.run(port=5001, debug=True)
