console.log("🛡️[E-CDE] | 🔑 VerifierCompte : INIT script chargé.");

// === PARAMÈTRES ===
const ECDE_SETTINGS = {
    etape1_checkComptePresent: true,
    etape2_checkGithubCompte: true,
    etape3_checkHTMLstatus: true,
    etape4_checkSessionStorage: false
};

// === ÉTAPE 1 : Vérifier si compte présent ===
function checkComptePresent() {
    const credentials = localStorage.getItem("compte");
    if (!credentials) {
        console.warn("🛡️[E-CDE] | Étape1 [ Aucun compte trouvé, redirection... ]");
        window.location.href = "../index.html";
        return null;
    }
    return JSON.parse(credentials);
}

// === ÉTAPE 2 : Vérifier le compte GitHub ===
async function checkCompteGithub(email, password) {
    try {
        const tokenRes = await fetch("https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js");
        const tokenData = await tokenRes.json();
        const GITHUB_TOKEN = tokenData.GITHUB_TOKEN;

        const url = `https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/compte/v4/${encodeURIComponent(email)}*-*${encodeURIComponent(password)}.json`;
        const res = await fetch(url, { headers: { Authorization: `token ${GITHUB_TOKEN}` } });

        if (!res.ok) return null;

        const data = await res.json();
        const decoded = JSON.parse(atob(data.content));

        if (decoded.CompteInfo.Email !== email || decoded.CompteInfo.MDP !== password) return null;

        return decoded;
    } catch (err) {
        console.error("🛡️[E-CDE] | Étape2 [ Erreur de récupération GitHub ] :", err);
        return null;
    }
}

// === ÉTAPE 3 : Vérifie les permissions HTML ===
function checkHTMLStatus(fileContent) {
    const serviceAttendu = document.querySelector('[id^="session/"]')?.id.split("/")[1] || null;
    const permissionAttendue = document.querySelector('[id^="perm/"]')?.id.split("/")[1] || null;

    const serviceCompte = fileContent.CompteInfo.Service?.trim();
    const permissionCompte = fileContent.Details.Permissions?.trim();
    const adminCompte = fileContent.Details.Admin?.trim();

    if (adminCompte === "EnesCDE002009") {
        console.log("🛡️[E-CDE] | Étape3 [ ✅ Admin détecté : bypass ]");
        return true;
    }

    if (serviceAttendu && serviceCompte !== serviceAttendu) {
        console.warn("🛡️[E-CDE] | Étape3 [ Service non autorisé, redirection... ]");
        return false;
    }

    if (permissionAttendue && permissionCompte !== permissionAttendue) {
        console.warn("🛡️[E-CDE] | Étape3 [ Permission refusée, redirection... ]");
        return false;
    }

    console.log("🛡️[E-CDE] | Étape3 [ ✅ Permissions validées ]");
    return true;
}

// === ÉTAPE 4 : Vérifie sessionStorage "Enes-CDE-C" ===
function checkSessionStorage() {
    const sessionRaw = localStorage.getItem("Enes-CDE-C");
    if (!sessionRaw) return false;

    const session = JSON.parse(sessionRaw);
    const expired = !session.valid || new Date(session.expiry) < new Date();

    if (expired) {
        console.warn("🛡️[E-CDE] | Étape4 [ Session expirée, redirection... ]");
        return false;
    }

    return true;
}

// === FONCTION PRINCIPALE ===
async function verifierCompte() {
    console.time("🛡️[E-CDE] | 🔑 VerifierCompte | ⏱️ Durée totale");

    try {
        if (ECDE_SETTINGS.etape1_checkComptePresent) {
            const credentials = checkComptePresent();
            if (!credentials) return;

            const { email, password } = credentials;

            let fileContent = null;
            if (ECDE_SETTINGS.etape2_checkGithubCompte) {
                fileContent = await checkCompteGithub(email, password);
                if (!fileContent) {
                    console.warn("🛡️[E-CDE] | Étape2 [ ❌ Compte GitHub invalide, redirection... ]");
                    window.location.href = "../index.html";
                    return;
                }
            }

            if (ECDE_SETTINGS.etape3_checkHTMLstatus && fileContent) {
                const htmlOK = checkHTMLStatus(fileContent);
                if (!htmlOK) {
                    window.location.href = "../index.html";
                    return;
                }
            }

            if (ECDE_SETTINGS.etape4_checkSessionStorage) {
                const sessionOK = checkSessionStorage();
                if (!sessionOK) {
                    window.location.href = "../index.html";
                    return;
                }
            }

            console.log("🛡️[E-CDE] | 🔑 VerifierCompte [ ✅ Accès autorisé à l’utilisateur ]");
        }
    } catch (err) {
        console.error("🛡️[E-CDE] | 🔑 VerifierCompte [ ❌ Erreur inattendue ] :", err);
        window.location.href = "../index.html";
    } finally {
        console.timeEnd("🛡️[E-CDE] | 🔑 VerifierCompte | ⏱️ Durée totale");
    }
}

// === Lancer maintenant + chaque 5min ===
verifierCompte();
setInterval(verifierCompte, 5 * 60 * 1000);
