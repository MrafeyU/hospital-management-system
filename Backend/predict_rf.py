import sys
import json
import os
import joblib
import numpy as np

# ✅ Build absolute model path
model_path = os.path.join(os.path.dirname(__file__), "model", "sklearn", "rf_model.joblib")

# ✅ Check if model file exists
if not os.path.exists(model_path):
    print(json.dumps({"error": f"❌ Model file not found at {model_path}"}))
    sys.exit(1)

# ✅ Load the model
try:
    model = joblib.load(model_path)
except Exception as e:
    print(json.dumps({"error": f"❌ Failed to load model: {str(e)}"}))
    sys.exit(1)

# ✅ Read and process input data
try:
    input_data = json.loads(sys.argv[1])  # Input from Node.js
    input_array = np.array(input_data).reshape(1, -1)
except Exception as e:
    print(json.dumps({"error": f"❌ Invalid input format: {str(e)}"}))
    sys.exit(1)

# ✅ Make prediction
try:
    prediction = model.predict(input_array)[0]
    print(json.dumps({"label": int(prediction)}))
except Exception as e:
    print(json.dumps({"error": f"❌ Prediction failed: {str(e)}"}))
    sys.exit(1)
