"use strict";

const API_URL = "https://estimmo.onrender.com";

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

function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function showResult(html, type) {
    resultDiv.className = "result visible " + type;
    resultDiv.innerHTML = html;
}

function showError(message) {
    showResult(escapeHtml(message), "error");
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const surfaceBati = parseFloat(document.getElementById("surface-bati").value);
    const nbPieces = parseInt(document.getElementById("nb-pieces").value, 10);
    const surfaceTerrain = parseFloat(document.getElementById("surface-terrain").value);
    const estMaison = document.querySelector('input[name="type_bien"]:checked').value === "true";

    if (!surfaceBati || !nbPieces || isNaN(surfaceTerrain)) {
        showError("Veuillez remplir tous les champs.");
        return;
    }

    const data = {
        surface_bati: surfaceBati,
        nombre_pieces: nbPieces,
        surface_terrain: surfaceTerrain,
        est_maison: estMaison,
    };

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span class="spinner"></span> Estimation…';
    resultDiv.className = "result";

    try {
        const resp = await fetch(API_URL + "/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!resp.ok) {
            const err = await resp.json().catch(function () { return null; });
            var detail = (err && typeof err.detail === "string") ? err.detail : "";
            throw new Error(detail || "Erreur serveur (" + resp.status + ")");
        }

        const result = await resp.json();
        showResult(
            '<div class="price-label">Prix estimé</div>' +
            '<div class="price">' + formatPrice(result.prix_predit_euros) + "</div>" +
            '<div class="disclaimer">Estimation indicative basée sur un modèle expérimental.</div>',
            "success"
        );
    } catch (err) {
        showError(err.message || "Impossible de contacter le serveur.");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML =
            '<svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10V6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2"/><polyline points="9 14 12 17 15 14"/><line x1="12" y1="12" x2="12" y2="17"/></svg>' +
            "Estimer le prix";
    }
});
