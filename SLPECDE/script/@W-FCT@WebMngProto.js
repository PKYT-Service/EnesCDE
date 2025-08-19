export async function WebManagerProto() {
    // 1️⃣ URL du fichier JSON sur GitHub (liste des sites/protocoles)
    const apiUrl = "https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/ecde/data/ListeAFF.json";
    
    // 2️⃣ URL du fichier qui contient le token GitHub
    const tokenUrl = "https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js";

    // 🔹 Récupérer le token GitHub depuis ton fichier externe
    let githubToken;
    try {
        const tokenResponse = await fetch(tokenUrl);
        const tokenData = await tokenResponse.json();
        githubToken = tokenData.GITHUB_TOKEN; // <--- ici on récupère le token
    } catch (error) {
        console.error("Erreur lors de la récupération du token :", error);
        return;
    }

    // 🔹 Récupérer le JSON sur GitHub (avec le token)
    let jsonData, sha;
    try {
        const response = await fetch(apiUrl, {
            headers: { Authorization: `token ${githubToken}` } // <-- Authentification
        });
        const fileData = await response.json();
        jsonData = JSON.parse(atob(fileData.content)); // <-- Décode le contenu base64 du JSON
        sha = fileData.sha; // <-- SHA nécessaire si on veut mettre à jour le fichier
    } catch (error) {
        console.error("Erreur lors de la récupération du fichier JSON :", error);
        return;
    }

    // 🔹 Extraire l'URL complète actuelle
    const currentUrl = window.location.href; // <-- tu peux remplacer par window.location.origin si tu veux juste le protocole + domaine

    // 🔹 Exemple : vérifier le protocole dans le JSON
    // On cherche une entrée dont le champ URL correspond au protocole de la page
    const protoEntry = jsonData.Sites.find(site => currentUrl.startsWith(site.URL));

    if (protoEntry) {
        // Si le protocole est désactivé
        if (protoEntry.Type === "Disable") {
            console.log("Protocole interdit → redirection si définie");
            if (protoEntry.Redirection?.Statut) {
                window.location.href = protoEntry.Redirection.URL;
            }
            return; // arrêter le script après redirection
        }

        // Si Redirection active pour ce protocole
        const redirect = protoEntry.Redirection;
        if (redirect?.Statut) {
            const today = new Date();
            const fin = redirect.Fin?.trim();
            const finDate = fin && !isNaN(new Date(fin).getTime()) ? new Date(fin) : null;

            if (!finDate || finDate >= today) {
                showRedirectPopup(redirect, () => {
                    window.location.href = redirect.URL; // note URL avec majuscule
                });
                return;
            }
        }
    }

    // 🔹 Sinon, continue comme avant avec l’URL complète
    let siteExists = jsonData.Sites.some(site => site.URL === window.location.origin);
