import joblib
import pandas as pd

# Load your trained model
model = joblib.load("iforest_model.pkl")

# Example report data (replace with actual report values)
report_data = {
    "lat": 21.501,
    "lng": 72.907,
    "damage_level": 1
}

# Convert to DataFrame
df = pd.DataFrame([report_data])

# Make prediction
prediction = model.predict(df)  # -1 = anomaly, 1 = normal
result = "Anomaly" if prediction[0] == -1 else "Normal"

print(f"Report Data: {report_data}")
print(f"Prediction Result: {result}")
