---
title: Structural Damage Prediction
emoji: 🏢
colorFrom: blue
colorTo: cyan
sdk: gradio
app_file: backend/app.py
pinned: false
hardware: cpu-basic
---
# Structural Damage Prediction System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)

A full-stack, machine learning-powered web application designed to predict and evaluate structural damage to buildings and infrastructure caused by severe flood events and inundation.

## 🚀 Overview

By inputting the structural characteristics of an asset (such as its primary construction **Material** and the exact **Inundation Depth**), the system calculates the precise vulnerability and potential severity of damage.

The application translates highly complex data into the widely recognized **European Macroseismic Scale (EMS-98)**, allowing civil engineers, urban planners, and disaster responders to translate predictive data into actionable, real-world structural assessments.

## 🧠 Machine Learning Backend

Under the hood, the backend leverages a sophisticated ensemble of Machine Learning models:
- **Master Classifier**: A primary Random Forest Classifier routes data into either a *Minor* or *Severe* damage category.
- **Specialized Sub-Models**: Dedicated predictive models then precisely evaluate the data to output a specific EMS-98 damage grade.
- **Composite Analysis**: If a structure contains multiple materials, the engine mathematically determines the worst-case scenario.

## 💻 Tech Stack

**Frontend:**
- React (Vite)
- Framer Motion (for smooth scroll animations and dynamic rendering)
- Vanilla CSS (for custom, premium styling and dynamic interactive gradients)
- Lucide React (Icons)

**Backend:**
- Python 3
- Flask (REST API)
- Scikit-Learn (Model training and prediction)
- Pandas & NumPy (Data manipulation)
- Joblib (Model serialization)

## 📂 Project Structure
```text
├── frontend/             # React/Vite web application
│   ├── src/              # UI components, pages, and CSS
│   └── package.json      # Frontend dependencies
│
└── backend/              # Python/Flask API
    ├── app.py            # Main API routing and prediction logic
    ├── models/           # Pre-trained .pkl Machine Learning models
    └── requirements.txt  # Python dependencies (gunicorn included for deployment)
```

## 🛠️ Local Development Setup

### 1. Start the Backend
Navigate to the `backend` directory, install the Python dependencies, and start the Flask server:
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*The backend will run on `http://127.0.0.1:5000`*

### 2. Start the Frontend
In a new terminal window, navigate to the `frontend` directory, install the Node packages, and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`*

## 🌐 Deployment
This application is fully optimized for free-tier deployments:
- **Backend**: Can be deployed seamlessly to Render.com using the included `requirements.txt` and `gunicorn`.
- **Frontend**: Designed to be deployed to Vercel instantly.

## 👨‍💻 Developer
Developed by **Syed Muhammad Saad Hussain Zaidi**  
*Data Scientist | Physicist | Web Developer*  
- [LinkedIn](https://www.linkedin.com/in/s-m-saad-a9a238299/)
- [Instagram](https://www.instagram.com/s.m.saad002/?hl=en)
- [Facebook](https://www.facebook.com/syed.saad.856366)
