from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import gradio as gr
import spaces
import joblib
import pandas as pd
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
MODELS = {}

def load_models():
    base_dir = os.path.dirname(os.path.abspath(__name__))
    models_dir = os.path.join(base_dir, 'models')
    
    # building
    MODELS['building_master'] = joblib.load(os.path.join(models_dir, 'building_master_model.pkl'))
    MODELS['building_minor'] = joblib.load(os.path.join(models_dir, 'building_minor_model.pkl'))
    MODELS['building_severe'] = joblib.load(os.path.join(models_dir, 'building_severe_model.pkl'))
    
    # infrastructure
    MODELS['infrastructure_master'] = joblib.load(os.path.join(models_dir, 'infrastructure_master_model.pkl'))
    MODELS['infrastructure_minor'] = joblib.load(os.path.join(models_dir, 'infrastructure_minor_model.pkl'))
    MODELS['infrastructure_severe'] = joblib.load(os.path.join(models_dir, 'infrastructure_severe_model.pkl'))

load_models()

# Explanations based on EMS-98
EXPLANATIONS = {
    "Building": {
        "Masonry": {
            0: "Grade 0: No damage. No visible structural or non-structural issues.",
            1: "Grade 1: Slight damage. Hairline cracks appear in a few walls; small pieces of plaster may fall.",
            2: "Grade 2: Moderate damage. Cracks show in many walls; fairly large pieces of plaster fall; chimneys partially collapse.",
            3: "Grade 3: Heavy damage. Large and extensive cracks form in most walls; roof tiles detach; non-structural partitions fail.",
            4: "Grade 4: Very heavy damage. Serious structural failure of walls occurs; roofs and floors partially collapse.",
            5: "Grade 5: Destruction. Total or near-total collapse of the building structure."
        },
        "Reinforced concrete": {
            0: "Grade 0: No damage. Structurally sound with no visible issues.",
            1: "Grade 1: Negligible damage. Fine hairline cracks develop in columns, beams, or frame joints.",
            2: "Grade 2: Slight damage. Shear cracks form primarily in non-structural walls and infill panels.",
            3: "Grade 3: Moderate damage. Significant shear cracks appear in structural columns, beams, and main walls.",
            4: "Grade 4: Very heavy / Major damage. Concrete covers spall off heavily; internal reinforcing steel rods buckle under stress.",
            5: "Grade 5: Collapse. Complete or partial structural collapse of the building."
        },
        "Wood": {
            0: "Grade 0: No damage.",
            1: "Grade 1: Slight damage. Minor movement in joints or minor cracking.",
            2: "Grade 2: Moderate damage. Noticeable distortion in the timber frame.",
            3: "Grade 3: Heavy damage. Severe structural deformation and partition failures.",
            4: "Grade 4: Very heavy damage. Near collapse, severe failure of major load-bearing elements.",
            5: "Grade 5: Destruction. Total collapse."
        },
        "Steel": {
            0: "Grade 0: No damage.",
            1: "Grade 1: Slight damage. Minor bending in secondary elements.",
            2: "Grade 2: Moderate damage. Some permanent deformation in main structural elements.",
            3: "Grade 3: Heavy damage. Significant buckling or yielding of steel members.",
            4: "Grade 4: Very heavy damage. Partial collapse or severe buckling.",
            5: "Grade 5: Destruction. Total collapse."
        }
    },
    "Infrastructure": {
        "Default": {
            0: "Grade 0: No functional or structural damage.",
            1: "Grade 1: Minor damage. Operations continue with minimal disruption.",
            2: "Grade 2: Moderate damage. Some structural elements need repair; temporary shutdown possible.",
            3: "Grade 3: Heavy damage. Significant structural impairment requiring major repairs.",
            4: "Grade 4: Very heavy damage. Critical failure of the infrastructure component.",
            5: "Grade 5: Destruction. Complete structural loss."
        }
    }
}

@app.post('/predict')
async def predict_api(request: Request):
    try:
        data = await request.json()
        structure_type = data.get('structure_type', '').lower()
        materials = data.get('materials', []) 
        inundation_depth = float(data.get('inundation_depth', 0.0))
        
        if structure_type not in ['building', 'infrastructure']:
            return JSONResponse(status_code=400, content={'error': 'Invalid structure_type. Must be building or infrastructure.'})
            
        if not materials:
            return JSONResponse(status_code=400, content={'error': 'Please select at least one material.'})
            
        worst_result = None
        max_grade = -1
        
        for mat in materials:
            input_df = pd.DataFrame([{'Inund Depth': inundation_depth, 'Material': mat}])
            
            master_model = MODELS[f'{structure_type}_master']
            
            is_severe = master_model.predict(input_df)[0]
            master_probs = master_model.predict_proba(input_df)[0]
            
            if is_severe == 1:
                specific_model = MODELS[f'{structure_type}_severe']
                severity_group = "Severe"
            else:
                specific_model = MODELS[f'{structure_type}_minor']
                severity_group = "Minor"
                
            predicted_grade = int(specific_model.predict(input_df)[0])
            grade_probs = specific_model.predict_proba(input_df)[0]
            confidence = float(max(grade_probs) * 100)
            
            if structure_type == 'building':
                explanation = EXPLANATIONS["Building"].get(mat, EXPLANATIONS["Building"]["Masonry"]).get(predicted_grade, "No explanation available.")
            else:
                explanation = EXPLANATIONS["Infrastructure"]["Default"].get(predicted_grade, "No explanation available.")
                
            if predicted_grade > max_grade:
                max_grade = predicted_grade
                worst_result = {
                    'severity_group': severity_group,
                    'predicted_grade': predicted_grade,
                    'confidence': round(confidence, 2),
                    'explanation': explanation,
                    'master_confidence': round(float(max(master_probs) * 100), 2),
                    'worst_material': mat,
                    'is_composite': len(materials) > 1
                }
                
        return worst_result
        
    except Exception as e:
        return JSONResponse(status_code=500, content={'error': str(e)})

# Mount a dummy Gradio app to satisfy Hugging Face Space requirements
@spaces.GPU
def dummy_api_status():
    return "API is running"

demo = gr.Interface(fn=dummy_api_status, inputs=None, outputs="text")
app = gr.mount_gradio_app(app, demo, path="/")


