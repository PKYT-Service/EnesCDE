export async function WebManager() {
    const apiUrl = "https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/ecde/data/ListeAFF.json";
    const tokenUrl = "https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js";

    let githubToken;
    try {
        const tokenResponse = await fetch(tokenUrl);
        const tokenData = await tokenResponse.json();
        githubToken = tokenData.GITHUB_TOKEN;
    } catch (error) {
        console.error("Erreur lors de la récupération du token :", error);
        return;
    }

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

    const currentUrl = window.location.origin.replace(/https?:\/\//, '');

    // --------- Gestion Autoriser ----------------
    if (Array.isArray(jsonData.Autoriser)) {
        const isAuthorized = jsonData.Autoriser.some(domain => currentUrl.includes(domain));
        if (isAuthorized) {
            // URL autorisée, on ne fait rien et on quitte
            console.log("[WebManager] URL autorisée, aucune action requise.");
            return;
        }
    }

    // --------- Trouver un site correspondant (exact ou mots-clés) --------------
    let matchedSite = jsonData.Sites.find(site => site.URL === currentUrl);

    if (!matchedSite) {
        matchedSite = jsonData.Sites.find(site => {
            const keywords = site.URL.replace(/https?:\/\//, '').split(/[\/\.\-\_]/).filter(Boolean);
            return keywords.some(kw => currentUrl.includes(kw));
        });
    }

    if (!matchedSite) {
        const newSite = {
            URL: currentUrl,
            Type: null,
            BlackListe: { Statut: false, Raison: "", Par: "", Date: "", Fin: "" },
            Maintenance: { Statut: false, Raison: "", Par: "", Date: "", Fin: "" },
            Rappel: { Statut: false, Raison: "", Par: "", Date: "", Fin: "" },
            Redirection: { Statut: false, Raison: "", Url: "", Par: "", Date: "", Fin: "" }
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

    const today = new Date();

    // Utilitaire check statut actif et date
    function checkStatus(data) {
        if (!data || !data.Statut) return false;
        const finDate = data.Fin ? new Date(data.Fin.split("/").reverse().join("-")) : null;
        return (!finDate || finDate >= today);
    }

    // --------- Check Global "All" ----------------
    if (jsonData.All) {
        ["BlackListe", "Maintenance", "Rappel"].forEach(type => {
            if (checkStatus(jsonData.All[type])) {
                showMaintenancePopup(jsonData.All[type]);
            }
        });
        if (checkStatus(jsonData.All.Redirection)) {
            showRedirectPopup(jsonData.All.Redirection, () => {
                window.location.href = jsonData.All.Redirection.Url;
            });
            // Optionnel : return; si tu veux bloquer suite au redirect global
        }
    }

    // --------- Check Site Spécifique ----------------
    ["BlackListe", "Maintenance", "Rappel"].forEach(type => {
        if (checkStatus(matchedSite[type])) {
            showMaintenancePopup(matchedSite[type]);
        }
    });
    if (checkStatus(matchedSite.Redirection)) {
        showRedirectPopup(matchedSite.Redirection, () => {
            window.location.href = matchedSite.Redirection.Url;
        });
    }
}

// ... (fonctions showMaintenancePopup et showRedirectPopup inchangées)
