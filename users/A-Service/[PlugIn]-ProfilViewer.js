document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ecde_users_profilviewer").innerHTML = `
    <div class="h-screen w-full flex items-center justify-center dark:bg-gray-900">

    <!-- Author card -->
    <div
        class="relative w-full max-w-2xl my-8 md:my-16 flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 px-4 py-8 border-2 border-dashed border-gray-400 dark:border-gray-400 shadow-lg rounded-lg">

        <span class="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-primary-100 dark:bg-gray-900 dark:text-gray-300 border-gray-400 dark:border-gray-400 border-b-2 border-r-2 border-dashed ">
           <a id="COMPTE:CompteInfo-Email">Email</a> - <a id="COMPTE:CompteInfo-Service">Service</a>
        </span>

        <div class="w-full flex justify-center sm:justify-start sm:w-auto">
            <img class="object-cover mt-3 mr-3 rounded-full" style="height:20px;  width: 20px;" src="" id="COMPTE:ProfilInfo-Pdp">
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

</div>
`;
  });




