# ml_server.py
from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import joblib

app = Flask(__name__)

# Load model and scaler
model = tf.keras.models.load_model("vital_signs_model.h5")
scaler = joblib.load("scaler.pkl")  # StandardScaler used during training

@app.route("/predict", methods=["POST"])
def predict_risk():
    try:
        data = request.json
        features = [
            data["heart_rate"],
            data["respiratory_rate"],
            data["temperature"],
            data["oxygen_level"],
            data["bp_systolic"],
            data["bp_diastolic"],
            data["bmi"],
            data["pulse_pressure"],
            data["map"]
        ]
        scaled = scaler.transform([features])
        prediction = model.predict(scaled)[0][0]

        return jsonify({
            "risk": int(prediction > 0.5),  # 1 = High Risk
            "probability": float(prediction)
        })
    except Exception as e:
        return jsonify({ "error": str(e) }), 500

if __name__ == "__main__":
    app.run(port=5002, debug=True)
