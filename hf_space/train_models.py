import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score

def build_pipeline():
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', MinMaxScaler(), ['Inund Depth']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Material'])
        ])
    
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(random_state=42))
    ])
    return pipeline

def optimize_and_train(X_train, y_train):
    pipeline = build_pipeline()
    # Define hyperparameter grid
    param_grid = {
        'classifier__n_estimators': [100, 200],
        'classifier__max_depth': [None, 10, 20],
        'classifier__min_samples_split': [2, 5]
    }
    
    # GridSearchCV to find the best model
    grid_search = GridSearchCV(pipeline, param_grid, cv=3, n_jobs=-1, scoring='accuracy')
    grid_search.fit(X_train, y_train)
    
    print(f"   Best params: {grid_search.best_params_}")
    return grid_search.best_estimator_

def train_domain(file_name, output_prefix):
    print(f"========== Optimizing models for {output_prefix} ==========")
    data = pd.read_excel(file_name)
    
    # Rename columns for clarity
    data.rename(columns={
        'Inund Depth obs. (m)': 'Inund Depth',
        'Damage Indices (0-4)': 'Damage Indices',
        'Material (RC, Steel, Wood, Masonry)': 'Material'
    }, inplace=True)
    
    if 'Structure (Building or Infrastructure)' in data.columns:
        data.drop(columns=['Structure (Building or Infrastructure)'], inplace=True)
        
    X = data[['Inund Depth', 'Material']]
    
    # 1. Master Model (Minor 0-1 vs Severe 2-4)
    print("-> Training Master Model...")
    y_master = data['Damage Indices'].apply(lambda x: 1 if x >= 2 else 0)
    X_train, X_test, y_train, y_test = train_test_split(X, y_master, test_size=0.2, random_state=42)
    master_model = optimize_and_train(X_train, y_train)
    print(f"   Master Accuracy: {accuracy_score(y_test, master_model.predict(X_test)):.4f}")
    
    # 2. Minor Model (0, 1)
    print("-> Training Minor Model (0,1)...")
    minor_data = data[data['Damage Indices'].isin([0, 1])]
    X_minor = minor_data[['Inund Depth', 'Material']]
    y_minor = minor_data['Damage Indices']
    X_train_m, X_test_m, y_train_m, y_test_m = train_test_split(X_minor, y_minor, test_size=0.2, random_state=42)
    minor_model = optimize_and_train(X_train_m, y_train_m)
    print(f"   Minor Accuracy: {accuracy_score(y_test_m, minor_model.predict(X_test_m)):.4f}")
    
    # 3. Severe Model (2, 3, 4)
    print("-> Training Severe Model (2,3,4)...")
    severe_data = data[data['Damage Indices'].isin([2, 3, 4])]
    X_severe = severe_data[['Inund Depth', 'Material']]
    y_severe = severe_data['Damage Indices']
    X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(X_severe, y_severe, test_size=0.2, random_state=42)
    severe_model = optimize_and_train(X_train_s, y_train_s)
    print(f"   Severe Accuracy: {accuracy_score(y_test_s, severe_model.predict(X_test_s)):.4f}")
    
    # Save models
    os.makedirs('models', exist_ok=True)
    joblib.dump(master_model, f'models/{output_prefix}_master_model.pkl')
    joblib.dump(minor_model, f'models/{output_prefix}_minor_model.pkl')
    joblib.dump(severe_model, f'models/{output_prefix}_severe_model.pkl')
    print(f"Optimized models for {output_prefix} saved successfully.\n")

if __name__ == '__main__':
    train_domain('../Building_data.xlsx', 'building')
    train_domain('../Infrastructure.xlsx', 'infrastructure')
