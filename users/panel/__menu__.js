document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ecde_users_menu").innerHTML = `     

<div class="inline-flex rounded-lg border p-1 bg-gray-100 dark:bg-gray-900 dark:border-gray-800">

  <a href="./index.html">
  <button
    class="inline-block rounded-md px-4 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative dark:text-gray-400 dark:hover:text-gray-200"
  >
    Home
  </button>
  </a>
  
  <a href="./profil.html">
  <button
    class="inline-block rounded-md px-4 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative dark:text-gray-400 dark:hover:text-gray-200"
  >
    Profil
  </button>
  </a>
  

  <button
    id="open-popup" class="inline-block rounded-md px-4 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative dark:text-gray-400 dark:hover:text-gray-200"
  >
    MultiCompte
  </button>

    
<a href="./logout.html">
  <button
    class="inline-block rounded-md bg-white px-4 py-2 text-sm text-blue-500 shadow-xs focus:relative dark:bg-gray-800"
  >
    Déconnexion
  </button>
</a>
</div>











    <!-- Overlay du popup -->
    <div id="popup-overlay" class="fixed inset-0 bg-black bg-opacity-50 hidden"></div>

    <!-- Popup -->
    <div id="popup" class="fixed inset-0 flex items-center justify-center hidden">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full">
            <h1 class="text-2xl font-semibold text-center mb-6">Gestion des Comptes</h1>

            <!-- Tableau des comptes -->
            <table class="w-full border-collapse border border-gray-300 dark:border-gray-700">
                <thead>
                    <tr class="bg-gray-200 dark:bg-gray-700">
                        <th class="p-3">Email</th>
                        <th class="p-3">Mot de passe</th>
                        <th class="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody id="accounts-table">
                    <!-- Rempli dynamiquement -->
                </tbody>
            </table>

            <!-- Ajouter un nouveau compte -->
            <div class="mt-6 p-4 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                <h2 class="text-xl font-semibold mb-4">Ajouter un compte</h2>
                <input type="email" id="new-email" class="w-full p-2 mb-3 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="Email">
                <input type="password" id="new-password" class="w-full p-2 mb-3 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="Mot de passe">
                <button id="add-account" class="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Ajouter</button>
            </div>

            <!-- Bouton de fermeture -->
            <button id="close-popup" class="mt-4 w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Fermer</button>
        </div>
    </div>

    
        
            `;
  });

document.write("<script>\r\n        document.getElementById(\"open-popup\").addEventListener(\"click\", () => {\r\n            document.getElementById(\"popup\").classList.remove(\"hidden\");\r\n            document.getElementById(\"popup-overlay\").classList.remove(\"hidden\");\r\n            loadAccounts();\r\n        });\r\n\r\n        document.getElementById(\"close-popup\").addEventListener(\"click\", () => {\r\n            document.getElementById(\"popup\").classList.add(\"hidden\");\r\n            document.getElementById(\"popup-overlay\").classList.add(\"hidden\");\r\n        });\r\n\r\n        function loadAccounts() {\r\n            let accounts = JSON.parse(localStorage.getItem(\"MTCOmpte\")) || [];\r\n            const activeAccount = JSON.parse(localStorage.getItem(\"compte\"));\r\n\r\n            if (activeAccount && !accounts.some(acc => acc.email === activeAccount.email)) {\r\n                accounts.push(activeAccount);\r\n                saveAccounts(accounts);\r\n            }\r\n\r\n            const tableBody = document.getElementById(\"accounts-table\");\r\n            tableBody.innerHTML = \"\"; \r\n\r\n            accounts.forEach((account, index) => {\r\n                const row = document.createElement(\"tr\");\r\n                row.classList.add(\"border-t\", \"border-gray-300\", \"dark:border-gray-700\");\r\n\r\n                row.innerHTML = `\r\n                    <td class=\"p-3\"><input type=\"email\" value=\"${account.email}\" class=\"edit-email w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600\"><\/td>\r\n                    <td class=\"p-3\"><input type=\"password\" value=\"${account.password}\" class=\"edit-password w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600\"><\/td>\r\n                    <td class=\"p-3 space-x-2\">\r\n                        <button class=\"apply-btn px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600\">Appliquer<\/button>\r\n                        <button class=\"save-btn px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600\">Modifier<\/button>\r\n                        <button class=\"delete-btn px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600\">Supprimer<\/button>\r\n                    <\/td>\r\n                `;\r\n\r\n                row.querySelector(\".apply-btn\").addEventListener(\"click\", () => {\r\n                    localStorage.setItem(\"compte\", JSON.stringify(account));\r\n                    alert(\"Compte s\u00e9lectionn\u00e9 !\");\r\n                    location.reload();\r\n                });\r\n\r\n                row.querySelector(\".save-btn\").addEventListener(\"click\", () => {\r\n                    accounts[index].email = row.querySelector(\".edit-email\").value;\r\n                    accounts[index].password = row.querySelector(\".edit-password\").value;\r\n                    saveAccounts(accounts);\r\n                    alert(\"Compte mis \u00e0 jour !\");\r\n                });\r\n\r\n                row.querySelector(\".delete-btn\").addEventListener(\"click\", () => {\r\n                    accounts.splice(index, 1);\r\n                    saveAccounts(accounts);\r\n                    loadAccounts();\r\n                });\r\n\r\n                tableBody.appendChild(row);\r\n            });\r\n        }\r\n\r\n        function saveAccounts(accounts) {\r\n            localStorage.setItem(\"MTCOmpte\", JSON.stringify(accounts));\r\n        }\r\n\r\n        document.getElementById(\"add-account\").addEventListener(\"click\", () => {\r\n            const email = document.getElementById(\"new-email\").value.trim();\r\n            const password = document.getElementById(\"new-password\").value.trim();\r\n\r\n            if (email === \"\" || password === \"\") {\r\n                alert(\"Veuillez remplir tous les champs !\");\r\n                return;\r\n            }\r\n\r\n            let accounts = JSON.parse(localStorage.getItem(\"MTCOmpte\")) || [];\r\n            \r\n            if (!accounts.some(acc => acc.email === email)) {\r\n                accounts.push({ email, password });\r\n                saveAccounts(accounts);\r\n                loadAccounts();\r\n            } else {\r\n                alert(\"Ce compte existe d\u00e9j\u00e0 !\");\r\n            }\r\n\r\n            document.getElementById(\"new-email\").value = \"\";\r\n            document.getElementById(\"new-password\").value = \"\";\r\n        });\r\n\r\n        document.addEventListener(\"DOMContentLoaded\", loadAccounts);\r\n    <\/script>");
