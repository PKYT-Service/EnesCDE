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

    <script>
        document.getElementById("open-popup").addEventListener("click", () => {
            document.getElementById("popup").classList.remove("hidden");
            document.getElementById("popup-overlay").classList.remove("hidden");
            loadAccounts();
        });

        document.getElementById("close-popup").addEventListener("click", () => {
            document.getElementById("popup").classList.add("hidden");
            document.getElementById("popup-overlay").classList.add("hidden");
        });

        function loadAccounts() {
            let accounts = JSON.parse(localStorage.getItem("MTCOmpte")) || [];
            const activeAccount = JSON.parse(localStorage.getItem("compte"));

            if (activeAccount && !accounts.some(acc => acc.email === activeAccount.email)) {
                accounts.push(activeAccount);
                saveAccounts(accounts);
            }

            const tableBody = document.getElementById("accounts-table");
            tableBody.innerHTML = ""; 

            accounts.forEach((account, index) => {
                const row = document.createElement("tr");
                row.classList.add("border-t", "border-gray-300", "dark:border-gray-700");

                row.innerHTML = `
                    <td class="p-3"><input type="email" value="${account.email}" class="edit-email w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></td>
                    <td class="p-3"><input type="password" value="${account.password}" class="edit-password w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></td>
                    <td class="p-3 space-x-2">
                        <button class="apply-btn px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Appliquer</button>
                        <button class="save-btn px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Modifier</button>
                        <button class="delete-btn px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Supprimer</button>
                    </td>
                `;

                row.querySelector(".apply-btn").addEventListener("click", () => {
                    localStorage.setItem("compte", JSON.stringify(account));
                    alert("Compte sélectionné !");
                    location.reload();
                });

                row.querySelector(".save-btn").addEventListener("click", () => {
                    accounts[index].email = row.querySelector(".edit-email").value;
                    accounts[index].password = row.querySelector(".edit-password").value;
                    saveAccounts(accounts);
                    alert("Compte mis à jour !");
                });

                row.querySelector(".delete-btn").addEventListener("click", () => {
                    accounts.splice(index, 1);
                    saveAccounts(accounts);
                    loadAccounts();
                });

                tableBody.appendChild(row);
            });
        }

        function saveAccounts(accounts) {
            localStorage.setItem("MTCOmpte", JSON.stringify(accounts));
        }

        document.getElementById("add-account").addEventListener("click", () => {
            const email = document.getElementById("new-email").value.trim();
            const password = document.getElementById("new-password").value.trim();

            if (email === "" || password === "") {
                alert("Veuillez remplir tous les champs !");
                return;
            }

            let accounts = JSON.parse(localStorage.getItem("MTCOmpte")) || [];
            
            if (!accounts.some(acc => acc.email === email)) {
                accounts.push({ email, password });
                saveAccounts(accounts);
                loadAccounts();
            } else {
                alert("Ce compte existe déjà !");
            }

            document.getElementById("new-email").value = "";
            document.getElementById("new-password").value = "";
        });

        document.addEventListener("DOMContentLoaded", loadAccounts);
    </script>

    
        
            `;
  });
