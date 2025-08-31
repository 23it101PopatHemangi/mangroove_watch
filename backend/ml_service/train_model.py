import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

# Example dummy data (replace with your real report data)
data = {
    "lat": [21.501, 21.502, 21.503, 21.504, 21.505],
    "lng": [72.907, 72.908, 72.909, 72.910, 72.911],
    "damage_level": [1, 0, 1, 0, 1]
}

df = pd.DataFrame(data)

# Train Isolation Forest
X = df[["lat", "lng", "damage_level"]]
model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
model.fit(X)

# Save the model
joblib.dump(model, "iforest_model.pkl")
print("Model trained and saved successfully!")
