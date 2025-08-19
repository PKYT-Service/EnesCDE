export async function WebManager() {
    const apiUrl = "https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/ecde/data/ListeAFF.json";
    const tokenUrl = "https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js";

    // Récupérer le token GitHub
    let githubToken;
    try {
        const tokenResponse = await fetch(tokenUrl);
        const tokenData = await tokenResponse.json();
        githubToken = tokenData.GITHUB_TOKEN;
    } catch (error) {
        console.error("Erreur lors de la récupération du token :", error);
        return;
    }

    // Récupérer le fichier JSON sur GitHub
    let jsonData, sha;
    try {
        const response = await fetch(apiUrl, {
            headers: { Authorization: `token ${githubToken}` }
        });
        const fileData = await response.json();
        jsonData = JSON.parse(atob(fileData.content));
        sha = fileData.sha;
    } catch (error) {
        console.error("Erreur lors de la récupération du fichier JSON :", error);
        return;
    }

    // Extraire l'URL actuelle
    const currentFullUrl = window.location.href; // avec protocole
    const currentHostOnly = window.location.host; // sans protocole

    // Vérifier si l'URL existe (avec ou sans protocole)
    let siteExists = jsonData.Sites.some(site => site.URL === currentFullUrl || site.URL === currentHostOnly);

    // Ajouter l'URL si elle est absente
    if (!siteExists) {
        jsonData.Sites.push({
            "URL": currentHostOnly, // stocke toujours sans protocole
            "Type": null,
            "BlackListe": { "Statut": false, "Raison": "", "Par": "", "Date": "", "Fin": "" },
            "Maintenance": { "Statut": false, "Raison": "", "Par": "", "Date": "", "Fin": "" },
            "Rappel": { "Statut": false, "Raison": "", "Par": "", "Date": "", "Fin": "" },
            "Redirection": { "Statut": false, "Raison": "", "Url": "", "Par": "", "Date": "", "Fin": "" }
        });
    }

    // Mettre à jour GitHub
    try {
        await fetch(apiUrl, {
            method: "PUT",
            headers: {
                Authorization: `token ${githubToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Ajout automatique de l'URL",
                content: btoa(JSON.stringify(jsonData, null, 2)),
                sha: sha
            })
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du fichier JSON :", error);
        return;
    }

    // Vérifier les statuts pour afficher popups / redirection
    jsonData.Sites.forEach(site => {
        if (site.URL === currentFullUrl || site.URL === currentHostOnly) {
            ["BlackListe", "Maintenance", "Rappel"].forEach(type => {
                if (site[type].Statut) {
                    const today = new Date();
                    const finDate = new Date(site[type].Fin.split("/").reverse().join("-"));
                    if (!isNaN(finDate.getTime()) && finDate >= today) {
                        showMaintenancePopup(site[type]);
                    }
                }
            });

            const redirect = site.Redirection;
            if (redirect?.Statut) {
                const today = new Date();
                const fin = redirect.Fin?.trim();
                const finDate = !isNaN(new Date(fin).getTime()) ? new Date(fin) : null;
                if (!finDate || finDate >= today) {
                    showRedirectPopup(redirect, () => {
                        window.location.href = redirect.Url;
                    });
                }
            }
        }
    });
}

// --- Popups ---
function showMaintenancePopup(data) {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)", color: "white",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        zIndex: "10000", fontFamily: "'Poppins', sans-serif"
    });

    const mainText = document.createElement("div");
    mainText.innerHTML = `Enes - <span style="color: #145af2;">CDE</span> <br> <mark>B.M.R</mark>`;
    mainText.style.cssText = "font-size:30px; font-weight:bold; margin-bottom:20px;";

    const causeText = document.createElement("div");
    causeText.innerHTML = `Cause : ${data.Raison}`;
    causeText.style.cssText = "font-size:20px; margin-bottom:10px;";

    const byText = document.createElement("div");
    byText.innerHTML = `Par : ${data.Par}`;
    byText.style.cssText = "font-size:18px; margin-bottom:10px;";

    const dateText = document.createElement("div");
    dateText.innerHTML = `Le : ${data.Date}`;
    dateText.style.cssText = "font-size:18px;";

    overlay.append(mainText, causeText, byText, dateText);
    document.body.appendChild(overlay);
}

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
