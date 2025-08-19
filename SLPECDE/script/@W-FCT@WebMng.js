(async function WebManager() {
    const currentHost = window.location.hostname; 
    const currentProto = window.location.protocol; 

    // 👉 À remplacer par ton fetch JSON AE
    const sites = [
        { URL: "enes-cde.vercel.app", Etat: "Neutre" },
        { URL: "pkyt-database-up.vercel.app", Etat: "Maintenance", Raison: "MAJ API" },
        { URL: "ebsayderflyse-gouv.vercel.app", Etat: "Rappel", Raison: "Message aux utilisateurs" },
        { URL: "ebsayderflyse.vercel.app", Etat: "Maintenance", Raison: "MAJ serveur" },
        { URL: "howardarmory.vercel.app", Etat: "Maintenance", Raison: "Migration" },
        { URL: "pikayutmg-dj72gywgy-pikayuts-projects.vercel.app", Etat: "Blacklist", Raison: "Violation" },
        { URL: "www.blackbox.ai", Etat: "Blacklist", Raison: "Bloqué par admin" },
        { URL: "localhost:", Etat: "Redirection", Url: "https://enes-cde.vercel.app" },
        { URL: "127.0.0.1:", Etat: "Redirection", Url: "https://enes-cde.vercel.app" },
        { URL: "https://", Etat: "Redirection", Url: "https://enes-cde.vercel.app" },
        { URL: "http://", Etat: "Redirection", Url: "https://enes-cde.vercel.app" },
    ];

    // 🔧 Normalisation AE
    function normalizeEntry(entry) {
        if (!entry) return null;

        // Cas spéciaux → garder tel quel
        if (["http://", "https://", "file://", "content://", "localhost:", "127.0.0.1:"].includes(entry)) {
            return entry;
        }

        // Retirer protocole + slash final
        return entry.replace(/^https?:\/\//, "").replace(/\/$/, "");
    }

    // 🔧 Matching UE ↔ AE
    function isMatch(entry) {
        const cleanEntry = normalizeEntry(entry);

        if (!cleanEntry) return false;

        // Cas spéciaux
        if (cleanEntry === "localhost:" && (currentHost.includes("localhost") || currentHost.includes("127.0.0.1"))) {
            return true;
        }
        if (cleanEntry === "127.0.0.1:" && currentHost.includes("127.0.0.1")) {
            return true;
        }
        if (cleanEntry === "file://" && currentProto === "file:") {
            return true;
        }
        if (cleanEntry === "content://" && currentProto === "content:") {
            return true;
        }
        if (cleanEntry === "https://" && currentProto === "https:") {
            return true;
        }
        if (cleanEntry === "http://" && currentProto === "http:") {
            return true;
        }

        // Exact match
        if (currentHost === cleanEntry) return true;

        // Match par mot-clé (ebsayderflyse, vercel, app …)
        const keywords = cleanEntry.split(/[\/\.\-\_]/).filter(Boolean);
        return keywords.some(kw => currentHost.includes(kw));
    }

    // 🔧 Popups
    function showPopup(title, message, extra = "") {
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0,0,0,0.9)";
        overlay.style.color = "white";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "9999";
        overlay.style.textAlign = "center";

        overlay.innerHTML = `
            <h1 style="font-size:2em;margin-bottom:20px;">${title}</h1>
            <p style="margin-bottom:10px;">${message || "Aucune raison fournie."}</p>
            <small>${extra}</small>
        `;

        document.body.innerHTML = ""; 
        document.body.appendChild(overlay);
    }

    // 🔧 Redirection
    function redirectTo(url) {
        window.location.href = url;
    }

    // 🔍 Vérification
    const matched = sites.find(s => isMatch(s.URL));

    if (matched) {
        switch (matched.Etat) {
            case "Blacklist":
                showPopup("🚫 Accès bloqué", matched.Raison, "Ce site est blacklisté.");
                break;
            case "Maintenance":
                showPopup("🛠️ Maintenance", matched.Raison, "Merci de revenir plus tard.");
                break;
            case "Rappel":
                showPopup("📢 Information", matched.Raison, "");
                break;
            case "Redirection":
                redirectTo(matched.Url || "https://enes-cde.vercel.app");
                break;
            default:
                console.log("✅ Site neutre :", currentHost);
        }
    } else {
        console.log("✅ Aucun match pour", currentHost);
    }
})();
