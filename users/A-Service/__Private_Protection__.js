async function verifierCompte() {
    const credentials = localStorage.getItem("compte");
    const sessionData = localStorage.getItem("Enes-CDE-C");

    if (!credentials || !sessionData) {
        console.warn("Données manquantes, redirection...");
        window.location.href = "../index.html";
        return;
    }

    const { email, password } = JSON.parse(credentials);
    const session = JSON.parse(sessionData);

    const sessionExpirée = !session.valid || new Date(session.expiry) < new Date(Date.now() - 3 * 60 * 60 * 1000);
    if (sessionExpirée) {
        console.warn("Session invalide ou expirée, redirection...");
        window.location.href = "../index.html";
        return;
    }

    try {
        const tokenResponse = await fetch("https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js");
        const tokenData = await tokenResponse.json();
        const GITHUB_TOKEN = tokenData.GITHUB_TOKEN;

        const encodedEmail = encodeURIComponent(email);
        const encodedPassword = encodeURIComponent(password);

        const url = `https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/compte/v4/${encodedEmail}*-*${encodedPassword}.json`;
        const response = await fetch(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        if (!response.ok) {
            console.warn("Compte non valide, redirection...");
            window.location.href = "../index.html";
            return;
        }

        const data = await response.json();
        const fileContent = JSON.parse(atob(data.content));

        if (fileContent.CompteInfo.Email !== email || fileContent.CompteInfo.MDP !== password) {
            console.warn("Identifiants incorrects, redirection...");
            window.location.href = "../index.html";
            return;
        }

        // Vérification des permissions et services
        const serviceAttendu = document.querySelector('[id^="session/"]')?.id.split("/")[1] || null;
        const permissionAttendue = document.querySelector('[id^="perm/"]')?.id.split("/")[1] || null;

        const serviceCompte = fileContent.CompteInfo.Service?.trim();
        const permissionCompte = fileContent.Details.Permissions?.trim();
        const adminCompte = fileContent.Details.Admin?.trim();

        // Cas spécial : bypass total si EnesCDE002009
        if (adminCompte === "EnesCDE002009") {
            console.log("Admin EnesCDE002009 détecté, bypass total.");
        } else {
            // Vérifier le service uniquement si serviceAttendu est défini
            if (serviceAttendu && serviceCompte !== serviceAttendu) {
                console.warn("Service non autorisé, redirection...");
                window.location.href = "../index.html";
                return;
            }

            // Vérifier la permission uniquement si permissionAttendue est définie
            if (permissionAttendue && (!permissionCompte || permissionCompte !== permissionAttendue)) {
                console.warn("Permission insuffisante, redirection...");
                window.location.href = "../index.html";
                return;
            }
        }

        console.log("Accès autorisé");
    } catch (error) {
        console.error("Erreur lors de la vérification :", error);
        window.location.href = "../index.html";
    }
}

// Lancer la vérification
verifierCompte();

// Répéter toutes les 5 minutes
setInterval(verifierCompte, 5 * 60 * 1000);
