
// Script a coller une fois le DOM charge (de preference en bas de body ou via DOMContentLoaded)
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[id^="url_account:"]').forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault(); // empeche la redirection immediate

            let rawUrl = this.id.split("url_account:")[1];
            let compteData = localStorage.getItem("compte") || sessionStorage.getItem("compte");

            if (compteData) {
                try {
                    let compte = JSON.parse(compteData);
                    let email = encodeURIComponent(compte.email || "inconnu");
                    let mdp = encodeURIComponent(compte.password || "inconnu");

                    let finalUrl = `${rawUrl}?acc=v:4;email:${email};mdp:${mdp};time:true`;
                    window.location.href = finalUrl;

                } catch (err) {
                    console.error("Erreur JSON dans la cle 'compte'", err);
                }
            } else {
                console.warn("Cle 'compte' absente");
            }
        });
    });
});




document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ecde_users_profilviewer").innerHTML = `
    <div class="w-full flex items-center justify-center dark:bg-gray-900">

    <!-- Author card -->
    <div
        class="relative w-full max-w-2xl my-8 md:my-16 flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 px-4 py-8 border-2 border-dashed border-gray-400 dark:border-gray-400 shadow-lg rounded-lg">

        <span class="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-primary-100 dark:bg-gray-900 dark:text-gray-300 border-gray-400 dark:border-gray-400 border-b-2 border-r-2 border-dashed ">
           <a id="COMPTE:CompteInfo-Email">Email</a> - <a id="COMPTE:CompteInfo-Service">Service</a>
        </span>

        <div class="w-full flex justify-center sm:justify-start sm:w-auto">
            <img class="object-cover mt-3 mr-3 rounded-full" style="height:100px;  width: 100px; object-fit: cover;" src="" id="COMPTE:ProfilInfo-Pdp">
        </div>

        <div class="w-full sm:w-auto flex flex-col items-center sm:items-start">

            <p class="font-display mb-2 text-2xl font-semibold dark:text-gray-200" itemprop="author">
                <a id="COMPTE:ProfilInfo-Nom">NOM</a> <a id="COMPTE:ProfilInfo-Prenom">Prenom</a>
            </p>

            <div class="mb-4 md:text-lg text-gray-400">
                <p id="COMPTE:ProfilInfo-Description">A propos de vous</p>
            </div>

            <div class="flex gap-4">

                <a title="website url" href="" id="COMPTE:ProfilInfo-Reseau" target="_blank" rel="noopener noreferrer">
                    <svg class="h-6 w-6 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418">
                        </path>
                    </svg>
                </a>

            </div>
        </div>

    </div>


<!-- Connected Toggle Buttons -->
<h1 class="text-xl mt-4 text-blue-700 dark:text-blue-300">Profil</h1>
<div class="flex flex-row items-center gap-2">
    
    <div class="flex flex-row">
        <label class="toggle-button-label text-blue-600 dark:text-blue-400">
            <input type="radio" name="radio-group-0" checked class="peer toggle-button rounded-l-full bg-blue-100 dark:bg-blue-900" />
            <span class="toggle-button-indicator material-symbols-outlined text-blue-700 dark:text-blue-300">check</span>
            <a href="" id="url_account:https://enes-cde.vercel.app/users/panel/profil.html"> consulter </a>
        </label>
        <label class="toggle-button-label text-blue-600 dark:text-blue-400">
            <input type="radio" name="radio-group-0" class="peer toggle-button bg-blue-100 dark:bg-blue-900" />
            <span class="toggle-button-indicator material-symbols-outlined text-blue-700 dark:text-blue-300">check</span>
            <a href="" id="https://enes-cde.vercel.app/users/panel/edit_account.html"> modifier </a>
        </label>
        <label class="toggle-button-label text-blue-600 dark:text-blue-400">
            <input type="radio" name="radio-group-0" class="peer toggle-button rounded-r-full bg-blue-100 dark:bg-blue-900" />
            <span class="toggle-button-indicator material-symbols-outlined text-blue-700 dark:text-blue-300">check</span>
            <a href="" id="https://enes-cde.vercel.app/users/panel/delete_account.html"> supprimer </a>
        </label>
    </div>

</div>



</div>
`;
  });




