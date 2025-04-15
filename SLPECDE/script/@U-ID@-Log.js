export async function ID_log_ecde() {
    // Vérifier si 'rules' dans le localStorage est true
    const rulesAccepted = localStorage.getItem('rules') === 'true';
    if (!rulesAccepted) {
        console.log("🛡️[E-CDE] | ❌ Les règles ne sont pas acceptées, le code ne s'exécute pas.");
        return;
    }

    // Vérifier si 'EnesCDE_ADM:Log' est défini et à true
    const isAdminLoggingEnabled = localStorage.getItem('EnesCDE_ADM:Log') === 'true';
    if (isAdminLoggingEnabled) {
        console.log("🛡️[E-CDE] | ⚠️ Les logs ne sont pas créés pour cet utilisateur.");
        // Créer un log dans le localStorage
        const logs = JSON.parse(localStorage.getItem('logs') || '[]');
        const now = new Date();
        const pageLog = {
            page: window.location.href,
            date: now.toLocaleString()
        };
        logs.push(pageLog);
        localStorage.setItem('logs', JSON.stringify(logs));
        return; // Ne pas créer de logs GitHub
    }

    const keys = ["ECDE:ID", "ECDE:ID_DF", "ECDE:ID_RP", "ECDE:ID_IP"];
    const values = {};

    // Récupérer les clés du localStorage
    keys.forEach(key => {
        const value = localStorage.getItem(key);
        values[key] = value || "Non trouvé";
    });

    // Récupérer l'URL de la page
    const url = window.location.href;

    // Récupérer les données de stockage
    const storageData = {
        localStorage: Object.entries(localStorage).map(([k, v]) => `${k} = ${v}`).join("\n     "),
        sessionStorage: Object.entries(sessionStorage).map(([k, v]) => `${k} = ${v}`).join("\n     "),
    };

    // Générer le nom du dossier et fichier
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const day = String(now.getDate()).padStart(2, '0');
    const timeStr = now.toLocaleTimeString('fr-FR', { hour12: false }).slice(0, 5).replace(':', '.'); // hh.mm
    const userId = values["ECDE:ID"] || "UnknownUser";
    const userIP = values["ECDE:ID_IP"] || "UnknownIP";
    const fileName = `${userIP}###${userId}###${timeStr}.txt`;
    const filePath = `log/users/${yearMonth}/${day}/${fileName}`;

    // Construire le contenu du fichier log
    const logData = `--- Date ${now.toLocaleDateString('fr-FR')} , Heures : ${timeStr}
### UserID :#
    ECDE:ID = ${values["ECDE:ID"]}
    ECDE:ID_DF = ${values["ECDE:ID_DF"]}
    ECDE:ID_RP = ${values["ECDE:ID_RP"]}
    ECDE:ID_IP = ${values["ECDE:ID_IP"]}
###

### LocalStorage : #
     ${storageData.localStorage}
###

### LocalSession : #
     ${storageData.sessionStorage}
###

### Log : #
     ${url}
---
`;

    // Récupérer dynamiquement le token GitHub
    const tokenUrl = "https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js";
    try {
        const tokenResponse = await fetch(tokenUrl);
        if (!tokenResponse.ok) throw new Error("Impossible de récupérer le token GitHub.");
        const tokenData = await tokenResponse.json();
        const githubToken = tokenData.GITHUB_TOKEN;

        // Infos GitHub
        const owner = "PKYT-Service";
        const repo = "database_EnesCDE";
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

        // Vérifier si le fichier existe déjà
        let sha = null;
        let existingContent = "";
        const fileCheck = await fetch(apiUrl, {
            headers: { Authorization: `token ${githubToken}` }
        });

        if (fileCheck.ok) {
            const fileData = await fileCheck.json();
            sha = fileData.sha; // SHA du fichier existant pour mise à jour
            existingContent = atob(fileData.content); // Décoder le contenu existant
        }

        // Ajouter le log au fichier existant
        const updatedContent = existingContent + "\n" + logData;

        // Préparer l'envoi à GitHub
        const githubData = {
            message: `Mise à jour du log utilisateur ${fileName}`,
            content: btoa(unescape(encodeURIComponent(updatedContent))), // Encodage base64
            branch: "main"
        };
        if (sha) githubData.sha = sha; // Ajout du SHA si le fichier existe

        // Envoyer le fichier sur GitHub
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                Authorization: `token ${githubToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(githubData)
        });

        if (response.ok) {
            console.log(`🛡️[E-CDE] | ✅ Log mis à jour : ${fileName}`);
        } else {
            console.error("🛡️[E-CDE] | ❌ Erreur lors de l'envoi sur GitHub :", await response.text());
        }
    } catch (error) {
        console.error("🛡️[E-CDE] | ❌ Erreur : ", error.message);
    }
}
