// Fonction pour récupérer les données du compte
async function fetchCompteData() {
    // Récupérer le compte depuis le localStorage
    let compteStr = localStorage.getItem("compte");
    if (!compteStr) {
        // Remplacer alert par un message de type console log
        console.log("! ❇️ | 🧍 account internal loader | Aucun compte trouvé dans le localStorage.");
        return;
    }

    // Convertir en objet JSON
    let compte = JSON.parse(compteStr);
    let email = compte.email;
    let password = compte.password;
    if (!email || !password) {
        // Remplacer alert par un message de type console log
        console.log("! ❇️ | 🧍 account internal loader | Email ou mot de passe manquant.");
        return;
    }

    // Générer le nom du fichier {email}*-*{password}.json
    let fileName = `${email}*-*${password}.json`;

    try {
        // Récupérer le token GitHub depuis l'URL sécurisée
        let tokenResponse = await fetch("https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js");
        let tokenData = await tokenResponse.json();
        let githubToken = tokenData.GITHUB_TOKEN;

        if (!githubToken) {
            // Remplacer alert par un message de type console log
            console.log("! ❇️ | 🧍 account internal loader | Impossible d'extraire le token GitHub.");
            return;
        }

        // Construire l'URL du fichier sur GitHub
        let repo = "database_EnesCDE";
        let owner = "PKYT-Service";
        let filePath = `compte/v4/${fileName}`;
        let githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

        // Fetch du fichier JSON depuis GitHub
        let response = await fetch(githubApiUrl, {
            headers: { Authorization: `token ${githubToken}` }
        });

        if (!response.ok) {
            // Remplacer alert par un message de type console log
            console.log(`! ❇️ | 🧍 account internal loader | Erreur lors de la récupération du fichier: ${response.status}`);
            return;
        }

        let fileData = await response.json();
        let contentDecoded = JSON.parse(atob(fileData.content)); // Décoder base64

        // Affichage dans les balises correspondantes
        updateHtmlElements(contentDecoded);

    } catch (error) {
        // Remplacer alert par un message de type console log
        console.log(`! ❇️ | 🧍 account internal loader | Erreur: ${error}`);
    }
}

// Fonction pour mettre à jour les éléments HTML
function updateHtmlElements(data) {
    // Vérifie les données dans le JSON
    console.log("! ❇️ | 🧍 account internal loader | Données du compte récupérées avec succès.");

    // Récupère tous les éléments dont l'ID commence par "COMPTE:"
    document.querySelectorAll("[id^='COMPTE:']").forEach(element => {
        // Extraire la section et le champ depuis l'ID de l'élément
        let idParts = element.id.split(":")[1].split("-");
        let section = idParts[0];  // Exemple: ProfilInfo
        let field = idParts[1];    // Exemple: Prenom

        // Remplacer les alert par des messages de type console log
        console.log(`! ❇️ | 🧍 account internal loader | Mise à jour de l'élément avec ID: ${element.id}`);
        console.log(`! ❇️ | 🧍 account internal loader | Section: ${section}, Field: ${field}`);
        console.log(`! ❇️ | 🧍 account internal loader | Valeur à mettre à jour: ${data[section] && data[section][field]}`);

       if (data[section] && data[section][field] !== undefined) {
            let value = data[section][field];
            if (element.tagName.toLowerCase() === "img") {
                element.src = value;
            } else {
                element.innerHTML = value;
            }
        }

    });
}

// Exécuter la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    fetchCompteData();
});
