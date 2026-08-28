# Estimmo

Estimateur de prix immobilier dans la Nièvre (58), basé sur un modèle de Machine Learning entraîné sur les données DVF 2025.

## Fonctionnalités

- Prédiction du prix d'un bien à partir de 4 critères : type (maison/appartement), surface habitable, nombre de pièces, surface du terrain
- API REST (FastAPI) exposant un endpoint `/predict`
- Interface web responsive connectée à l'API

## Stack technique

- **Modèle** : scikit-learn (sérialisé avec joblib)
- **API** : FastAPI + Uvicorn
- **Frontend** : HTML / CSS / JS vanilla
- **Tracking** : MLflow

## Installation locale

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Lancement

### API

```bash
uvicorn api:app --port 8000
```

L'API est accessible sur `http://127.0.0.1:8000` (documentation Swagger sur `/docs`).

### MLflow

```bash
mlflow ui --backend-store-uri sqlite:///mlflow.db
```

Interface MLflow sur `http://127.0.0.1:5000`.

### Frontend

Ouvrir `index.html` dans un navigateur, ou le déployer sur GitHub Pages.

## Déploiement

| Composant | Service   | URL                                          |
|-----------|-----------|----------------------------------------------|
| API       | Render    | `https://api-immobilier-nievre.onrender.com` |
| Frontend  | GitHub Pages | `https://CecileLouisy.github.io/estimmo/`     |

## Structure du projet

```
estimmo/
├── api.py              # API FastAPI
├── model.joblib        # Modèle entraîné
├── requirements.txt    # Dépendances Python
├── render.yaml         # Configuration Render
├── index.html          # Page web (structure)
├── style.css           # Styles
├── app.js              # Logique frontend
└── J*_.ipynb           # Notebooks d'exploration et entraînement
```

## Auteur

Cécile Louisy — Module 1 Machine Learning
