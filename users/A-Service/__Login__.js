document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("loginform");

    // Récupérer le token dynamiquement
    const token = await fetchToken();
    if (!token) {
        showPopup("Impossible de récupérer le token d'accès.");
        console.error("🔰[E-CDE]📄connexion [Échec récupération du token]");
        return;
    }

    // Vérification automatique si les données existent déjà
    checkStoredSession();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            showPopup("Veuillez entrer vos identifiants.");
            console.error("🔰[E-CDE]📄connexion [Champs vides]");
            return;
        }

        const filePath = `compte/v4/${email}*-*${password}.json`;
        const url = `https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/${filePath}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${token}`
                }
            });

            if (response.status === 401) {
                showPopup("Accès non autorisé. Vérifiez votre token d'accès.");
                console.error("🔰[E-CDE]📄connexion [Accès non autorisé]");
                return;
            } else if (response.status === 404) {
                showPopup("Identifiants incorrects. Veuillez réessayer.");
                console.error("🔰[E-CDE]📄connexion [Fichier non trouvé]");
                return;
            } else if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            const decodedContent = JSON.parse(atob(data.content));

            if (decodedContent.CompteInfo.Email === email && decodedContent.CompteInfo.MDP === password) {
                storeSession(email, password);
                window.location.href = "./panel/";
            } else {
                showPopup("Identifiants incorrects. Veuillez réessayer.");
                console.error("🔰[E-CDE]📄connexion [Mauvais identifiants]");
            }
        } catch (error) {
            showPopup("Erreur lors de la connexion. Vérifiez vos identifiants.");
            console.error("🔰[E-CDE]📄connexion [Erreur API]", error);
        }
    });
});

// ✅ Fonction pour récupérer le token depuis l'URL
async function fetchToken() {
    try {
        const response = await fetch("https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js");
        const tokenData = await response.json(); // Parsing le JSON
        return tokenData.GITHUB_TOKEN; // Retourner le token directement
    } catch (error) {
        console.error("🔰[E-CDE]📄Erreur lors de la récupération du token", error);
        return null;
    }
}

function showPopup(message) {
    alert(message); // Remplacer par un vrai popup Tailwind si nécessaire
}

function storeSession(email, password) {
    const now = new Date();
    const expiration = new Date(now.getTime() + 2 * 60 * 60 * 1000); // Expire en 2 heures

    localStorage.setItem("Enes-CDE-C", JSON.stringify({ valid: true, expiry: expiration }));
    localStorage.setItem("compte", JSON.stringify({ email, password }));
}

function checkStoredSession() {
    const sessionData = JSON.parse(localStorage.getItem("Enes-CDE-C"));
    const userData = JSON.parse(localStorage.getItem("compte"));

    if (sessionData && userData) {
        const now = new Date();
        const expiration = new Date(sessionData.expiry);

        if (now < expiration) {
            if (confirm("Vous êtes déjà connecté. Voulez-vous être redirigé vers le panel ?")) {
                window.location.href = "./panel/";
            }
        } else {
            localStorage.removeItem("Enes-CDE-C");
            localStorage.removeItem("compte");
        }
    }
    
// ✅ Data Control & Protection

const DCP = {
    encryptData: encryptData,
    decryptData: decryptData,
    secureLocalStorageSet: secureLocalStorageSet,
    secureLocalStorageGet: secureLocalStorageGet,
    secureSessionStorageSet: secureSessionStorageSet,
    secureSessionStorageGet: secureSessionStorageGet,
    setSecureCookie: setSecureCookie,
    getSecureCookie: getSecureCookie,
    checkSessionIntegrity: checkSessionIntegrity
};

// Export global (pour y accéder partout)
window.DCP = DCP;
}





// new



// ✅ Encodage en UTF-8 + chiffrement AES
function encryptData(data, secretKey) {
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const key = CryptoJS.SHA256(secretKey).toString();
    return CryptoJS.AES.encrypt(JSON.stringify(Array.from(encodedData)), key).toString();
}

// ✅ Déchiffrement AES + décodage UTF-8
function decryptData(cipherText, secretKey) {
    try {
        const key = CryptoJS.SHA256(secretKey).toString();
        const bytes = CryptoJS.AES.decrypt(cipherText, key);
        const decodedArray = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return JSON.parse(new TextDecoder().decode(new Uint8Array(decodedArray)));
    } catch (e) {
        console.warn("❌ Déchiffrement échoué", e);
        return null;
    }
}

// ✅ Sauvegarde sécurisée dans LocalStorage
function secureLocalStorageSet(key, value, secret) {
    localStorage.setItem(key, encryptData(value, secret));
}

// ✅ Lecture sécurisée depuis LocalStorage
function secureLocalStorageGet(key, secret) {
    const cipherText = localStorage.getItem(key);
    if (!cipherText) return null;
    return decryptData(cipherText, secret);
}

// ✅ Sauvegarde sécurisée dans SessionStorage
function secureSessionStorageSet(key, value, secret) {
    sessionStorage.setItem(key, encryptData(value, secret));
}

// ✅ Lecture sécurisée depuis SessionStorage
function secureSessionStorageGet(key, secret) {
    const cipherText = sessionStorage.getItem(key);
    if (!cipherText) return null;
    return decryptData(cipherText, secret);
}

// ✅ Création d'un cookie sécurisé (expiration en heures)
function setSecureCookie(name, value, hours, secret) {
    const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encryptData(value, secret)}; expires=${expires}; path=/; Secure; SameSite=Strict`;
}

// ✅ Lecture d'un cookie sécurisé
function getSecureCookie(name, secret) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (!match) return null;
    return decryptData(match[2], secret);
}

// ✅ Vérification périodique de l'intégrité des données
function checkSessionIntegrity(secret) {
    const localSession = secureLocalStorageGet("compte", secret);
    if (!localSession) {
        console.warn("⚠️ Session introuvable ou corrompue.");
        return false;
    }
    // Exemple: vérifier que l'email ressemble à un email
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(localSession.email)) {
        console.warn("⚠️ Format email invalide. Suppression de la session.");
        localStorage.removeItem("compte");
        return false;
    }
    return true;
}

// ✅ Détection de session ouverte ailleurs (tab sync)
window.addEventListener("storage", (event) => {
    if (event.key === "Enes-CDE-C" && !event.newValue) {
        alert("Votre session a été fermée sur un autre onglet.");
        window.location.reload();
    }
});
