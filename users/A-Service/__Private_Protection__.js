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

    // Vérification de la session (3h max)
    if (!session.valid || new Date(session.expiry) < new Date(Date.now() - 3 * 60 * 60 * 1000)) {
        console.warn("Session invalide ou expirée, redirection...");
        window.location.href = "../index.html";
        return;
    }

    try {
        // Récupération du token GitHub
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

        const compteValide =
            fileContent.CompteInfo.Email === email &&
            fileContent.CompteInfo.MDP === password;

        if (!compteValide) {
            console.warn("Identifiants incorrects, redirection...");
            window.location.href = "../index.html";
            return;
        }

        const serviceDuCompte = fileContent.CompteInfo.Service?.trim();
        const permissionsValides = fileContent.Details?.Permissions === "true";

        // Extraction de l'ID HTML : "session/{session.name}"
        const sessionElementId = `session/${session.name}`;
        const elementSession = document.getElementById(sessionElementId);

        if (!elementSession) {
            console.warn("Element session non trouvé dans la page.");
        }

        const serviceCorrespond =
            elementSession && elementSession.id.split("session/")[1] === serviceDuCompte;

        if (!serviceCorrespond || !permissionsValides) {
            console.warn("Service ou permissions invalides, redirection...");
            window.location.href = "../index.html";
            return;
        }

        console.log("Accès autorisé. Compte et service validés.");
    } catch (error) {
        console.error("Erreur lors de la vérification du compte :", error);
        window.location.href = "../index.html";
    }
}

// Vérification initiale
verifierCompte();

// Vérification toutes les 5 minutes
setInterval(verifierCompte, 5 * 60 * 1000);
