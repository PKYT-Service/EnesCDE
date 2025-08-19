export async function WebManagerProto() {
    const apiUrl = "https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/ecde/data/ListeAFF.json";
    const tokenUrl = "https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js";

    // 🔹 Récupérer le token GitHub
    let githubToken;
    try {
        const tokenResponse = await fetch(tokenUrl);
        const tokenData = await tokenResponse.json();
        githubToken = tokenData.GITHUB_TOKEN;
    } catch (error) {
        console.error("[❌] Erreur lors de la récupération du token :", error);
        return;
    }

    // 🔹 Récupérer le JSON sur GitHub
    let jsonData, sha;
    try {
        const response = await fetch(apiUrl, {
            headers: { Authorization: `token ${githubToken}` }
        });
        const fileData = await response.json();
        jsonData = JSON.parse(atob(fileData.content));
        sha = fileData.sha;
    } catch (error) {
        console.error("[❌] Erreur lors de la récupération du fichier JSON :", error);
        return;
    }

    // 🔹 Extraire le protocole + host (ex: https://, http://localhost:)
    const currentProtocol = window.location.origin + "/"; // https://site.com/

    // 🔹 Chercher l'entrée correspondante dans le JSON par protocole
    const protoEntry = jsonData.Sites.find(site => currentProtocol.startsWith(site.URL));

    if (protoEntry) {
        if (protoEntry.Type === "Disable") {
            console.log("[⚠️] Protocole interdit → redirection si définie");
            if (protoEntry.Redirection?.Statut) {
                window.location.href = protoEntry.Redirection.URL;
            }
            return;
        }

        const redirect = protoEntry.Redirection;
        if (redirect?.Statut) {
            const today = new Date();
            const fin = redirect.Fin?.trim();
            const finDate = fin && !isNaN(new Date(fin).getTime()) ? new Date(fin) : null;

            if (!finDate || finDate >= today) {
                showRedirectPopup(redirect, () => {
                    window.location.href = redirect.URL;
                });
                return;
            }
        }
    }

    // 🔹 Sinon continuer comme avant (gestion URL complète)
    let siteExists = jsonData.Sites.some(site => site.URL === window.location.origin);
    if (!siteExists) {
        jsonData.Sites.push({
            "URL": window.location.origin,
            "Type": null,
            "BlackListe": { "Statut": false, "Raison": "", "Par": "", "Date": "", "Fin": "" },
            "Maintenance": { "Statut": false, "Raison": "", "Par": "", "Date": "", "Fin": "" },
            "Rappel": { "Statut": false, "Raison": "", "Par": "", "Date": "", "Fin": "" },
            "Redirection": { "Statut": false, "Raison": "", "URL": "", "Par": "", "Date": "", "Fin": "" }
        });
    }
}

// 🔹 Popup Redirection simple
function showRedirectPopup(data, callback) {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.9)", color: "#fff",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        zIndex: "10000", fontFamily: "'Poppins', sans-serif", textAlign: "center"
    });

    const text = document.createElement("div");
    const date = data.Date || "???";
    const fin = data.Fin || "illimitée";
    text.innerHTML = `
        <div style="font-size:24px; font-weight:bold; margin-bottom:10px;">Redirection active</div>
        <div>Motif : <strong>${data.Raison || "Aucun"}</strong></div>
        <div>Par : <strong>${data.Par || "???"}</strong></div>
        <div>Du <strong>${date}</strong> jusqu'à <strong>${fin}</strong></div>
        <div style="margin-top:20px;">Redirection en cours...</div>
    `;
    overlay.appendChild(text);
    document.body.appendChild(overlay);

    setTimeout(callback, 4000);
}
