console.log("🛡️[E-CDE] | 🔑 VerifierCompte : INIT script chargé.");

async function verifierCompte() {
    console.time("🛡️[E-CDE] | 🔑 VerifierCompte | ⏱️ Durée de vérification");

    const credentials = localStorage.getItem("compte");
    const sessionData = localStorage.getItem("Enes-CDE-C");

    if (!credentials || !sessionData) {
        console.warn("🛡️[E-CDE] | 🔑 VerifierCompte [ Données manquantes, redirection... ]");
        window.location.href = "../index.html";
        return;
    }

    const { email, password } = JSON.parse(credentials);
    const session = JSON.parse(sessionData);

    // Correction de la condition d'expiration
    const sessionExpirée = !session.valid || new Date(session.expiry) < new Date();
    if (sessionExpirée) {
        console.warn("🛡️[E-CDE] | 🔑 VerifierCompte [ Session invalide ou expirée, redirection... ]");
        window.location.href = "../index.html";
        return;
    }

    try {
        console.log("🛡️[E-CDE] | 🔑 VerifierCompte [ Récupération du token GitHub... ]");
        const tokenResponse = await fetch("https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js");
        const tokenData = await tokenResponse.json();
        const GITHUB_TOKEN = tokenData.GITHUB_TOKEN;

        const encodedEmail = encodeURIComponent(email);
        const encodedPassword = encodeURIComponent(password);
        const url = `https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/compte/v4/${encodedEmail}*-*${encodedPassword}.json`;

        console.log(`🛡️[E-CDE] | 🔑 VerifierCompte [ Vérification du compte pour ${email}... ]`);
        const response = await fetch(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        if (!response.ok) {
            console.warn("🛡️[E-CDE] | 🔑 VerifierCompte [ Compte non valide ou introuvable, redirection... ]");
            window.location.href = "../index.html";
            return;
        }

        const data = await response.json();
        const fileContent = JSON.parse(atob(data.content));

        if (fileContent.CompteInfo.Email !== email || fileContent.CompteInfo.MDP !== password) {
            console.warn("🛡️[E-CDE] | 🔑 VerifierCompte [ Identifiants incorrects, redirection... ]");
            window.location.href = "../index.html";
            return;
        }

        const serviceAttendu = document.querySelector('[id^="session/"]')?.id.split("/")[1] || null;
        const permissionAttendue = document.querySelector('[id^="perm/"]')?.id.split("/")[1] || null;

        const verifierService = serviceAttendu !== null;
        const verifierPermission = permissionAttendue !== null;

        const serviceCompte = fileContent.CompteInfo.Service?.trim();
        const permissionCompte = fileContent.Details.Permissions?.trim();
        const adminCompte = fileContent.Details.Admin?.trim();

        console.log("🛡️[E-CDE] | 🔑 VerifierCompte [ DEBUG données compte/attendus ] =>", {
            serviceAttendu,
            permissionAttendue,
            verifierService,
            verifierPermission,
            serviceCompte,
            permissionCompte,
            adminCompte
        });

        // Cas spécial bypass total
        if (adminCompte === "EnesCDE002009") {
            console.log("🛡️[E-CDE] | 🔑 VerifierCompte [ ✅ Admin EnesCDE002009 détecté, bypass total. ]");
        } else {
            if (verifierService && serviceCompte !== serviceAttendu) {
                console.warn("🛡️[E-CDE] | 🔑 VerifierCompte [ Service non autorisé, redirection... ]");
                window.location.href = "../index.html";
                return;
            }

            if (verifierPermission && permissionCompte !== permissionAttendue) {
                console.warn("🛡️[E-CDE] | 🔑 VerifierCompte [ Permission insuffisante, redirection... ]");
                window.location.href = "../index.html";
                return;
            }
        }

        console.log("🛡️[E-CDE] | 🔑 VerifierCompte [ ✅ Accès autorisé ]");
    } catch (error) {
        console.error("🛡️[E-CDE] | 🔑 VerifierCompte [ ❌ Erreur lors de la vérification :", error, "]");
        window.location.href = "../index.html";
    } finally {
        console.timeEnd("🛡️[E-CDE] | 🔑 VerifierCompte | ⏱️ Durée de vérification");
    }
}

// Lancer la vérification maintenant
verifierCompte();

// Relancer toutes les 5 minutes
setInterval(verifierCompte, 300000);
