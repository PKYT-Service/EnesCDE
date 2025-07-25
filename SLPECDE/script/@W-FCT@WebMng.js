export async function WebManager() {
    const apiUrl = "https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/ecde/data/ListeAFF.json";
    const tokenUrl = "https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js";

    // 1. Récupérer le token GitHub
    let githubToken;
    try {
        const tokenResponse = await fetch(tokenUrl);
        const tokenData = await tokenResponse.json();
        githubToken = tokenData.GITHUB_TOKEN;
    } catch (error) {
        console.error("Erreur lors de la récupération du token :", error);
        return;
    }

    // 2. Récupérer le fichier JSON sur GitHub
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

    // 3. Récupérer l'URL de la page actuelle
    const currentUrl = window.location.origin;

    // 4. Trouver un site correspondant (exact ou par mots-clés)
    let matchedSite = jsonData.Sites.find(site => site.URL === currentUrl);

    if (!matchedSite) {
        matchedSite = jsonData.Sites.find(site => {
            const keywords = site.URL
                .replace(/https?:\/\//, '')
                .split(/[\/\.\-\_]/)
                .filter(Boolean);
            return keywords.some(kw => currentUrl.includes(kw));
        });
    }

    // 5. Si le site n'existe pas, on l'ajoute
    if (!matchedSite) {
        const newSite = {
            "URL": currentUrl,
            "Type": null,
            "BlackListe": { "Statut": false, "Raison": "", "Par": "", "Date": "", "Fin": "" },
            "Maintenance": { "Statut": false, "Raison": "", "Par": "", "Date": "", "Fin": "" },
            "Rappel": { "Statut": false, "Raison": "", "Par": "", "Date": "", "Fin": "" },
            "Redirection": { "Statut": false, "Raison": "", "Url": "", "Par": "", "Date": "", "Fin": "" }
        };

        jsonData.Sites.push(newSite);
        matchedSite = newSite;

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
    }

    // 6. Gérer les statuts
    ["BlackListe", "Maintenance", "Rappel"].forEach(type => {
        if (matchedSite[type]?.Statut) {
            const today = new Date();
            const finDate = new Date(matchedSite[type].Fin.split("/").reverse().join("-"));

            if (!isNaN(finDate.getTime()) && finDate >= today) {
                showMaintenancePopup(matchedSite[type]);
            }
        }
    });

    const redirect = matchedSite.Redirection;
    if (redirect?.Statut) {
        const today = new Date();
        const fin = redirect.Fin?.trim();
        const isDateValid = !isNaN(new Date(fin).getTime());
        const finDate = isDateValid ? new Date(fin) : null;

        if (!finDate || finDate >= today) {
            showRedirectPopup(redirect, () => {
                window.location.href = redirect.Url;
            });
        }
    }
}

// POPUPS : ----------------------------------------------

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

    setTimeout(callback, 4000); // délai de 4 secondes avant redirection
}
