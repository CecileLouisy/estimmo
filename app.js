"use strict";

const API_URL = "https://api-immobilier-nievre.onrender.com";

const form = document.getElementById("form-estimation");
const resultDiv = document.getElementById("result");
const btnSubmit = document.getElementById("btn-submit");

function formatPrice(n) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(n);
}

function showResult(html, type) {
    resultDiv.className = "result visible " + type;
    resultDiv.innerHTML = html;
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const surfaceBati = parseFloat(document.getElementById("surface-bati").value);
    const nbPieces = parseInt(document.getElementById("nb-pieces").value, 10);
    const surfaceTerrain = parseFloat(document.getElementById("surface-terrain").value);
    const estMaison = document.querySelector('input[name="type_bien"]:checked').value === "true";

    if (!surfaceBati || !nbPieces || !surfaceTerrain) {
        showResult("Veuillez remplir tous les champs.", "error");
        return;
    }

    const data = {
        surface_bati: surfaceBati,
        nombre_pieces: nbPieces,
        surface_terrain: surfaceTerrain,
        est_maison: estMaison,
    };

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span class="spinner"></span>Estimation…';
    resultDiv.className = "result";

    try {
        const resp = await fetch(API_URL + "/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!resp.ok) {
            const err = await resp.json().catch(function () { return null; });
            throw new Error(err?.detail || "Erreur serveur (" + resp.status + ")");
        }

        const result = await resp.json();
        showResult(
            '<div class="price-label">Prix estimé</div>' +
            '<div class="price">' + formatPrice(result.prix_predit_euros) + "</div>",
            "success"
        );
    } catch (err) {
        showResult(err.message || "Impossible de contacter le serveur.", "error");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Estimer le prix";
    }
});
