import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import joblib
import json
import os

# ====== Config ======
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model/sklearn')
os.makedirs(MODEL_DIR, exist_ok=True)

DATA_PATH = os.path.join(os.path.dirname(__file__), 'synthetic_vital_signs_dataset.csv')

# ====== Load Dataset ======
print("📥 Loading dataset...")
df = pd.read_csv(DATA_PATH)

# Keep only required columns
features = ["heart_rate", "respiratory_rate", "temperature", "oxygen_level", "bp_systolic", "bp_diastolic"]
target = "risk_category"

# Balance dataset
print("🔁 Balancing data...")
high_risk_df = df[df[target] == "High Risk"].sample(n=10000)
low_risk_df = df[df[target] == "Low Risk"].sample(n=10000, replace=True)
df = pd.concat([high_risk_df, low_risk_df]).sample(frac=1).reset_index(drop=True)

# Encode labels
y = LabelEncoder().fit_transform(df[target])  # 0 = High Risk, 1 = Low Risk

# Standardize features
print("📊 Scaling features...")
X = df[features]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Save scaler
scaler_path = os.path.join(MODEL_DIR, 'scaler.json')
with open(scaler_path, 'w') as f:
    json.dump({"mean": scaler.mean_.tolist(), "std": scaler.scale_.tolist()}, f)
print(f"✅ Scaler saved to {scaler_path}")

# ====== Train Model ======
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

print("🚀 Training Random Forest model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ====== Evaluate ======
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"\n✅ Accuracy: {acc:.4f}")
print("\n📊 Classification Report:\n", classification_report(y_test, y_pred, target_names=["High Risk", "Low Risk"]))

# ====== Save Model ======
model_path = os.path.join(MODEL_DIR, 'rf_model.joblib')
joblib.dump(model, model_path)
print(f"✅ Model saved to {model_path}")
