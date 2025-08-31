import json
import pandas as pd
import joblib
from sklearn.ensemble import IsolationForest

# Load JSON data
with open("data.json") as f:
    data = json.load(f)

# Extract incidents
incidents = data["incidents"]

# Convert to DataFrame with numerical features for anomaly detection
df = pd.DataFrame(incidents)

# You can use lat, lng, and encode type as numeric
df['type_encoded'] = df['type'].map({'Illegal Cutting': 0, 'Dumping': 1, 'Erosion': 2})
features = ['lat', 'lng', 'type_encoded']

X = df[features]

# Train Isolation Forest model (or load existing model if trained)
model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
model.fit(X)

# Predict anomalies
df['prediction'] = model.predict(X)
df['result'] = df['prediction'].apply(lambda x: 'Anomaly' if x == -1 else 'Normal')

# Print output in terminal
for idx, row in df.iterrows():
    print(f"Incident ID: {row['id']}, Type: {row['type']}, Lat: {row['lat']}, Lng: {row['lng']}, Prediction: {row['result']}")
