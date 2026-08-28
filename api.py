import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd

app = FastAPI(title="API de prédiction de prix immobilier - Nièvre")

origins = os.environ.get(
    "CORS_ORIGINS",
    "https://cecilelouisy.github.io"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

modele = joblib.load("model.joblib")


class Bien(BaseModel):
    surface_bati: float = Field(gt=0, le=10000)
    nombre_pieces: int = Field(gt=0, le=50)
    surface_terrain: float = Field(ge=0, le=100000)
    est_maison: bool


@app.get("/")
def racine():
    return {"message": "API de prédiction de prix immobilier. Voir /docs pour tester."}


@app.post("/predict")
def predire(bien: Bien):
    X = pd.DataFrame([{
        "Surface reelle bati": bien.surface_bati,
        "Nombre pieces principales": bien.nombre_pieces,
        "Surface terrain": bien.surface_terrain,
        "Type local_Maison": bien.est_maison,
    }])
    prix_predit = modele.predict(X)[0]
    return {"prix_predit_euros": round(float(prix_predit), 2)}
