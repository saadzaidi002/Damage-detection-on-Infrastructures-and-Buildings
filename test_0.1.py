import joblib
import pandas as pd
import numpy as np

master = joblib.load('backend/models/building_master_model.pkl')
minor = joblib.load('backend/models/building_minor_model.pkl')
severe = joblib.load('backend/models/building_severe_model.pkl')

print("=== Testing 0.1m Depth ===")
for mat in ['Masonry', 'Reinforced concrete', 'Wood']:
    df = pd.DataFrame([{'Inund Depth': 0.1, 'Material': mat}])
    
    is_severe = master.predict(df)[0]
    master_prob = master.predict_proba(df)[0]
    
    if is_severe == 1:
        grade = severe.predict(df)[0]
        prob = severe.predict_proba(df)[0]
        print(f"{mat}: SEVERE (Grade {grade}) - Master Prob: {master_prob}, Severe Prob: {prob}")
    else:
        grade = minor.predict(df)[0]
        prob = minor.predict_proba(df)[0]
        print(f"{mat}: MINOR (Grade {grade}) - Master Prob: {master_prob}, Minor Prob: {prob}")
