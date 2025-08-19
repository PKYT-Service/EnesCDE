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

    // 3. URL du navigateur
    const currentUrl = window.location.origin.replace(/^https?:\/\//, ""); // sans protocole
    const fullUrl = window.location.href; // complet avec chemin

    // 4. Fonction de correspondance
    function matchSite(siteUrl) {
        if (!siteUrl) return false;

        // Cas protocole seul
        if (/^(https?:\/\/|file:\/\/)$/.test(siteUrl)) {
            return fullUrl.startsWith(siteUrl) || currentUrl.includes("localhost") || currentUrl.includes("127.0.0.1");
        }

        // Cas avec protocole complet
        if (/^https?:\/\//.test(siteUrl) || /^file:\/\//.test(siteUrl)) {
            const cleanSite = siteUrl.replace(/^https?:\/\//, "").replace(/^file:\/\//, "");
            return currentUrl === cleanSite || currentUrl.includes(cleanSite);
        }

        // Cas fichier .html → enlever extension
        if (siteUrl.endsWith(".html")) {
            const keyword = siteUrl.replace(/\.html$/, "");
            return fullUrl.includes(keyword);
        }

        // Cas par défaut → mot-clé
        return fullUrl.includes(siteUrl);
    }

    // 5. Trouver un site correspondant
    let matchedSite = jsonData.Sites.find(site => matchSite(site.URL));

    // 6. Si aucun site, en ajouter un
    if (!matchedSite) {
        const newSite = {
            "URL": currentUrl,   // <-- ici sans protocole
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


    // 7. Vérifier statuts BlackListe / Maintenance / Rappel
    ["BlackListe", "Maintenance", "Rappel"].forEach(type => {
        if (matchedSite[type]?.Statut) {
            const today = new Date();
            const finDate = new Date(matchedSite[type].Fin.split("/").reverse().join("-"));
            if (!isNaN(finDate.getTime()) && finDate >= today) {
                showMaintenancePopup(matchedSite[type]);
            }
        }
    });

    // 8. Vérifier Redirection
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
