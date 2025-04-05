document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ecde_menu").innerHTML = `     

    <style>
  .MF {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh; /* Prend toute la hauteur de la fenêtre */
    display: flex;
  }
</style>

    <aside class="w-20 bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700 MF">
    <div class="h-full flex flex-col items-center py-4">
        <!-- Logo -->
        <div class="p-2">
            <img src="https://enes-cde.vercel.app/data/img/web/favicon.png" alt="Enes CDE LOGO" class="h-8 w-auto">
        </div>

        <!-- Navigation -->
        <nav class="flex-1 w-full px-2 space-y-2 mt-6">
            <a href="https://enes-cde.vercel.app/">
                <button class="w-full p-3 flex justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </button>
            </a>

            <a href="./LOG_statistiques.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
<svg class="h-6 w-6 stroke-current text-gray-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
        <defs>
            <style>
                .a, .b {
                    fill: none;
                    stroke: currentColor; /* Correction ici */
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    stroke-width: 1.5px;
                }
                .a {
                    fill-rule: evenodd;
                }
            </style>
        </defs>
        <path class="a" d="M2,2V20a2,2,0,0,0,2,2H22"></path>
        <rect class="b" height="6" rx="1.5" width="3" x="6" y="12"></rect>
        <rect class="b" height="6" rx="1.5" width="3" x="12" y="7"></rect>
        <rect class="b" height="6" rx="1.5" width="3" x="18" y="3"></rect>
    </g>
</svg>

                </button>
            </a>

            <a href="./web-manager.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                       <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor">
        <text x="10" y="50" font-family="Arial, sans-serif" font-size="48" font-weight="bold">V3</text>
    </svg>
                </button>
            </a>


            <a href="https://pkyt-database-up.vercel.app/code-source/admin-dashboard/V4/GTV3&AAS.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c4.97 0 9 3.582 9 8s-4.03 8-9 8-9-3.582-9-8 4.03-8 9-8z" />
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.5 12h19M12 3c2.5 3.5 2.5 9 0 13.5M12 3c-2.5 3.5-2.5 9 0 13.5" />
</svg>
                </button>
            </a>

<hr>

    <a href="https://enes-cde.vercel.app/users/">
        <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
            <svg class="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" class="stroke-current text-gray-500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </button>
    </a>
    
    <a href="./settings.html">
        <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
            <svg class="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" class="stroke-current text-gray-500" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" class="stroke-current text-gray-500" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </button>
    </a>
            
        </nav>
    </div>
</aside>
        
            `;
  });
