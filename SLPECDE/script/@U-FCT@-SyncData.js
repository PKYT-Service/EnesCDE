export async function PU_Sync() {
    const tokenUrl = "https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js";
    const tokenResponse = await fetch(tokenUrl);
    const { GITHUB_TOKEN } = await tokenResponse.json();

    const owner = "PKYT-Service";
    const repo = "database_EnesCDE";
    const path = "ecde/sync/";

    const userId = localStorage.getItem("ECDE:ID_IP");
    if (!userId) return console.error("❌ ECDE:ID_IP manquant !");

    const filePath = `${path}${userId}.json`;
    const currentSite = window.location.hostname;

    const sensitiveKeys = ["Compte", "AuthToken", "APP:??", "Rules"];

    function getFilteredLocalStorage() {
        const filtered = {};
        Object.keys(localStorage).forEach(key => {
            if (!sensitiveKeys.includes(key)) {
                filtered[key] = localStorage.getItem(key);
            }
        });
        return filtered;
    }

    function getCurrentData() {
        return {
            Site: currentSite,
            URL: window.location.href,
            Date: new Date().toLocaleDateString("fr-FR"),
            Time: new Date().toLocaleTimeString("fr-FR"),
            LocalStorage: getFilteredLocalStorage(),
            SessionStorage: { ...sessionStorage },
            Cookies: document.cookie
        };
    }

    async function fetchGitHubFile() {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
        const response = await fetch(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        if (response.ok) {
            const data = await response.json();
            return { content: JSON.parse(atob(data.content)), sha: data.sha };
        } else {
            return { content: [], sha: null };
        }
    }

    async function saveToGitHub(data, sha = null, message = "Sync data") {
        const payload = {
            message,
            content: btoa(JSON.stringify(data, null, 2)),
            branch: "main",
        };
        if (sha) payload.sha = sha;

        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        return response.ok;
    }

    function applyDataToClient(siteData) {
        // Appliquer les cookies
        if (siteData.Cookies) document.cookie = siteData.Cookies;

        // Appliquer le sessionStorage
        sessionStorage.clear();
        Object.entries(siteData.SessionStorage || {}).forEach(([key, value]) => {
            sessionStorage.setItem(key, value);
        });

        // Appliquer le localStorage (sans écraser les données sensibles)
        Object.entries(siteData.LocalStorage || {}).forEach(([key, value]) => {
            if (!sensitiveKeys.includes(key)) {
                localStorage.setItem(key, value);
            }
        });

        console.log("✅ Données synchronisées localement !");
    }

    async function sync() {
        const currentData = getCurrentData();
        const { content: allSitesData, sha } = await fetchGitHubFile();

        let updated = false;
        let updatedData = [...allSitesData];

        // Cherche les données de ce site
        const siteIndex = updatedData.findIndex(entry => entry.Site === currentSite);
        if (siteIndex !== -1) {
            // Fusion + mise à jour
            const previous = updatedData[siteIndex];
            applyDataToClient(previous);
            updatedData[siteIndex] = { ...previous, ...currentData };
        } else {
            // Ajoute une nouvelle entrée
            updatedData.push(currentData);
            updated = true;
        }

        // Sauvegarde si nouveau ou modifié
        const saved = await saveToGitHub(updatedData, sha, `Sync site ${currentSite} for ${userId}`);
        if (saved) {
            console.log("✅ Données synchronisées avec GitHub !");
        } else {
            console.error("❌ Échec de la synchronisation avec GitHub !");
        }
    }

    await sync();
}
