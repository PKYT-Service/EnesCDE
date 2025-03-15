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
document.write("<script src=\"https:\/\/cdn.tailwindcss.com\"><\/script>\r\n\r\n    <!-- Bouton flottant -->\r\n    <button id=\"open-popup\" class=\"fixed bottom-6 right-6 flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600\">\r\n        <svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">\r\n            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 4v16m8-8H4\" \/>\r\n        <\/svg>\r\n        <span>Multi compte<\/span>\r\n    <\/button>\r\n\r\n    <!-- Overlay du popup -->\r\n    <div id=\"popup-overlay\" class=\"fixed inset-0 bg-black bg-opacity-50 hidden\"><\/div>\r\n\r\n    <!-- Popup -->\r\n    <div id=\"popup\" class=\"fixed inset-0 flex items-center justify-center hidden\">\r\n        <div class=\"bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full\">\r\n            <h1 class=\"text-2xl font-semibold text-center mb-6\">Gestion des Comptes<\/h1>\r\n\r\n            <!-- Tableau des comptes -->\r\n            <table class=\"w-full border-collapse border border-gray-300 dark:border-gray-700\">\r\n                <thead>\r\n                    <tr class=\"bg-gray-200 dark:bg-gray-700\">\r\n                        <th class=\"p-3\">Email<\/th>\r\n                        <th class=\"p-3\">Mot de passe<\/th>\r\n                        <th class=\"p-3\">Actions<\/th>\r\n                    <\/tr>\r\n                <\/thead>\r\n                <tbody id=\"accounts-table\">\r\n                    <!-- Rempli dynamiquement -->\r\n                <\/tbody>\r\n            <\/table>\r\n\r\n            <!-- Ajouter un nouveau compte -->\r\n            <div class=\"mt-6 p-4 bg-white dark:bg-gray-900 shadow-lg rounded-lg\">\r\n                <h2 class=\"text-xl font-semibold mb-4\">Ajouter un compte<\/h2>\r\n                <input type=\"email\" id=\"new-email\" class=\"w-full p-2 mb-3 border rounded-md dark:bg-gray-700 dark:border-gray-600\" placeholder=\"Email\">\r\n                <input type=\"password\" id=\"new-password\" class=\"w-full p-2 mb-3 border rounded-md dark:bg-gray-700 dark:border-gray-600\" placeholder=\"Mot de passe\">\r\n                <button id=\"add-account\" class=\"w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600\">Ajouter<\/button>\r\n            <\/div>\r\n\r\n            <!-- Bouton de fermeture -->\r\n            <button id=\"close-popup\" class=\"mt-4 w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600\">Fermer<\/button>\r\n        <\/div>\r\n    <\/div>\r\n\r\n    <script>\r\n        document.getElementById(\"open-popup\").addEventListener(\"click\", () => {\r\n            document.getElementById(\"popup\").classList.remove(\"hidden\");\r\n            document.getElementById(\"popup-overlay\").classList.remove(\"hidden\");\r\n            loadAccounts();\r\n        });\r\n\r\n        document.getElementById(\"close-popup\").addEventListener(\"click\", () => {\r\n            document.getElementById(\"popup\").classList.add(\"hidden\");\r\n            document.getElementById(\"popup-overlay\").classList.add(\"hidden\");\r\n        });\r\n\r\n        function loadAccounts() {\r\n            let accounts = JSON.parse(localStorage.getItem(\"MTCOmpte\")) || [];\r\n            const activeAccount = JSON.parse(localStorage.getItem(\"compte\"));\r\n\r\n            if (activeAccount && !accounts.some(acc => acc.email === activeAccount.email)) {\r\n                accounts.push(activeAccount);\r\n                saveAccounts(accounts);\r\n            }\r\n\r\n            const tableBody = document.getElementById(\"accounts-table\");\r\n            tableBody.innerHTML = \"\"; \r\n\r\n            accounts.forEach((account, index) => {\r\n                const row = document.createElement(\"tr\");\r\n                row.classList.add(\"border-t\", \"border-gray-300\", \"dark:border-gray-700\");\r\n\r\n                row.innerHTML = `\r\n                    <td class=\"p-3\"><input type=\"email\" value=\"${account.email}\" class=\"edit-email w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600\"><\/td>\r\n                    <td class=\"p-3\"><input type=\"password\" value=\"${account.password}\" class=\"edit-password w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600\"><\/td>\r\n                    <td class=\"p-3 space-x-2\">\r\n                        <button class=\"apply-btn px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600\">Appliquer<\/button>\r\n                        <button class=\"save-btn px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600\">Modifier<\/button>\r\n                        <button class=\"delete-btn px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600\">Supprimer<\/button>\r\n                    <\/td>\r\n                `;\r\n\r\n                row.querySelector(\".apply-btn\").addEventListener(\"click\", () => {\r\n                    localStorage.setItem(\"compte\", JSON.stringify(account));\r\n                    alert(\"Compte s\u00e9lectionn\u00e9 !\");\r\n                    location.reload();\r\n                });\r\n\r\n                row.querySelector(\".save-btn\").addEventListener(\"click\", () => {\r\n                    accounts[index].email = row.querySelector(\".edit-email\").value;\r\n                    accounts[index].password = row.querySelector(\".edit-password\").value;\r\n                    saveAccounts(accounts);\r\n                    alert(\"Compte mis \u00e0 jour !\");\r\n                });\r\n\r\n                row.querySelector(\".delete-btn\").addEventListener(\"click\", () => {\r\n                    accounts.splice(index, 1);\r\n                    saveAccounts(accounts);\r\n                    loadAccounts();\r\n                });\r\n\r\n                tableBody.appendChild(row);\r\n            });\r\n        }\r\n\r\n        function saveAccounts(accounts) {\r\n            localStorage.setItem(\"MTCOmpte\", JSON.stringify(accounts));\r\n        }\r\n\r\n        document.getElementById(\"add-account\").addEventListener(\"click\", () => {\r\n            const email = document.getElementById(\"new-email\").value.trim();\r\n            const password = document.getElementById(\"new-password\").value.trim();\r\n\r\n            if (email === \"\" || password === \"\") {\r\n                alert(\"Veuillez remplir tous les champs !\");\r\n                return;\r\n            }\r\n\r\n            let accounts = JSON.parse(localStorage.getItem(\"MTCOmpte\")) || [];\r\n            \r\n            if (!accounts.some(acc => acc.email === email)) {\r\n                accounts.push({ email, password });\r\n                saveAccounts(accounts);\r\n                loadAccounts();\r\n            } else {\r\n                alert(\"Ce compte existe d\u00e9j\u00e0 !\");\r\n            }\r\n\r\n            document.getElementById(\"new-email\").value = \"\";\r\n            document.getElementById(\"new-password\").value = \"\";\r\n        });\r\n\r\n        document.addEventListener(\"DOMContentLoaded\", loadAccounts);\r\n    <\/script>");
