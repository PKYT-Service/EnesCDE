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

    // Vérification de la session
    if (!session.valid || new Date(session.expiry) < new Date(Date.now() - 3 * 60 * 60 * 1000)) {
        console.warn("Session invalide ou expirée, redirection...");
        window.location.href = "../index.html";
        return;
    }

    try {
        // Récupération du token GitHub depuis le fichier JSON
        const tokenResponse = await fetch("https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js");
        const tokenData = await tokenResponse.json();
        const GITHUB_TOKEN = tokenData.GITHUB_TOKEN;

        // Encoder l'email et le mot de passe pour éviter des problèmes d'URL
        const encodedEmail = encodeURIComponent(email);
        const encodedPassword = encodeURIComponent(password);

        // URL du fichier à récupérer depuis GitHub
        const url = `https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/compte/v4/${encodedEmail}*-*${encodedPassword}.json`;

        console.log("URL de la requête GitHub:", url); // Ajout du log pour vérifier l'URL

        // Récupération des données du fichier GitHub
        const response = await fetch(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        // Vérification de la réponse de l'API
        if (!response.ok) {
            console.warn("Compte non valide, redirection...");
            window.location.href = "../index.html";
            return;
        }

        const data = await response.json();
        const fileContent = JSON.parse(atob(data.content));

        console.log("Contenu du fichier récupéré:", fileContent); // Ajout du log pour vérifier le contenu

        // Vérification des informations du compte
        if (fileContent.CompteInfo.Email === email && fileContent.CompteInfo.MDP === password) {
            console.log("Compte valide");
        } else {
            console.warn("Compte non valide, redirection...");
            window.location.href = "../index.html";
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du token ou des données :", error);
        window.location.href = "../index.html";
    }
}

// Vérification initiale
verifierCompte();

// Vérification toutes les 5 minutes
setInterval(verifierCompte, 5 * 60 * 1000);
