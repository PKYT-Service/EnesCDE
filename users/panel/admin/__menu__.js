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

            <a href="./@@FCT@@-Logs&stats.html">
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

            <a href="https://pkyt-database-up.vercel.app/code-source/admin-dashboard/V4/GTV3&AAS.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                       <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor">
        <text x="10" y="50" font-family="Arial, sans-serif" font-size="48" font-weight="bold">V3</text>
    </svg>
                </button>
            </a>


            <a href="./@@FCT@@-WebManager.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                  <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 7H18.01M15 7H15.01M18 17H18.01M15 17H15.01M6 10H18C18.9319 10 19.3978 10 19.7654 9.84776C20.2554 9.64477 20.6448 9.25542 20.8478 8.76537C21 8.39782 21 7.93188 21 7C21 6.06812 21 5.60218 20.8478 5.23463C20.6448 4.74458 20.2554 4.35523 19.7654 4.15224C19.3978 4 18.9319 4 18 4H6C5.06812 4 4.60218 4 4.23463 4.15224C3.74458 4.35523 3.35523 4.74458 3.15224 5.23463C3 5.60218 3 6.06812 3 7C3 7.93188 3 8.39782 3.15224 8.76537C3.35523 9.25542 3.74458 9.64477 4.23463 9.84776C4.60218 10 5.06812 10 6 10ZM6 20H18C18.9319 20 19.3978 20 19.7654 19.8478C20.2554 19.6448 20.6448 19.2554 20.8478 18.7654C21 18.3978 21 17.9319 21 17C21 16.0681 21 15.6022 20.8478 15.2346C20.6448 14.7446 20.2554 14.3552 19.7654 14.1522C19.3978 14 18.9319 14 18 14H6C5.06812 14 4.60218 14 4.23463 14.1522C3.74458 14.3552 3.35523 14.7446 3.15224 15.2346C3 15.6022 3 16.0681 3 17C3 17.9319 3 18.3978 3.15224 18.7654C3.35523 19.2554 3.74458 19.6448 4.23463 19.8478C4.60218 20 5.06812 20 6 20Z" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
            </a>

<hr>

<a href="./@@FCT@@-ClientId_manage.html">
        <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
            <svg class="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 5">
<svg class="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path d="M11 21H5.6C5.03995 21 4.75992 21 4.54601 20.891C4.35785 20.7951 4.20487 20.6422 4.10899 20.454C4 20.2401 4 19.9601 4 19.4V17.6841C4 17.0485 4 16.7306 4.04798 16.4656C4.27087 15.2344 5.23442 14.2709 6.46558 14.048C6.5425 14.0341 6.6237 14.0242 6.71575 14.0172C6.94079 14 7.05331 13.9914 7.20361 14.0026C7.35983 14.0143 7.4472 14.0297 7.59797 14.0722C7.74302 14.1131 8.00429 14.2315 8.52682 14.4682C8.98953 14.6778 9.48358 14.8304 10 14.917M19.8726 15.2038C19.8044 15.2079 19.7357 15.21 19.6667 15.21C18.6422 15.21 17.7077 14.7524 17 14C16.2923 14.7524 15.3578 15.2099 14.3333 15.2099C14.2643 15.2099 14.1956 15.2078 14.1274 15.2037C14.0442 15.5853 14 15.9855 14 16.3979C14 18.6121 15.2748 20.4725 17 21C18.7252 20.4725 20 18.6121 20 16.3979C20 15.9855 19.9558 15.5853 19.8726 15.2038ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </g>
</svg>
        </button>
    </a>
    
    <a href="">
        <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18.5 19.5L20 21M11 21H5.6C5.03995 21 4.75992 21 4.54601 20.891C4.35785 20.7951 4.20487 20.6422 4.10899 20.454C4 20.2401 4 19.9601 4 19.4V17.6841C4 17.0485 4 16.7306 4.04798 16.4656C4.27087 15.2344 5.23442 14.2709 6.46558 14.048C6.5425 14.0341 6.6237 14.0242 6.71575 14.0172C6.94079 14 7.05331 13.9914 7.20361 14.0026C7.35983 14.0143 7.4472 14.0297 7.59797 14.0722C7.74302 14.1131 8.00429 14.2315 8.52682 14.4682C9.13692 14.7446 9.8015 14.9218 10.5 14.9795M19 17.5C19 18.8807 17.8807 20 16.5 20C15.1193 20 14 18.8807 14 17.5C14 16.1193 15.1193 15 16.5 15C17.8807 15 19 16.1193 19 17.5ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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

    <a href="./@@ADM@@-Settings.html">
        <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
            <svg class="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1395 12.0002C14.1395 13.1048 13.2664 14.0002 12.1895 14.0002C11.1125 14.0002 10.2395 13.1048 10.2395 12.0002C10.2395 10.8957 11.1125 10.0002 12.1895 10.0002C13.2664 10.0002 14.1395 10.8957 14.1395 12.0002Z" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.57381 18.1003L5.12169 12.8133C4.79277 12.2907 4.79277 11.6189 5.12169 11.0963L7.55821 5.89229C7.93118 5.32445 8.55898 4.98876 9.22644 5.00029H12.1895H15.1525C15.8199 4.98876 16.4477 5.32445 16.8207 5.89229L19.2524 11.0923C19.5813 11.6149 19.5813 12.2867 19.2524 12.8093L16.8051 18.1003C16.4324 18.674 15.8002 19.0133 15.1281 19.0003H9.24984C8.5781 19.013 7.94636 18.6737 7.57381 18.1003Z" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
  </g>
</svg>
        </button>
    </a>
    
    <a href="./@@ADM@@-DevSettings.html">
        <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
            <svg class="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path d="M7 8L3 12L7 16" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M17 8L21 12L17 16" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M14 4L9.8589 19.4548" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </g>
</svg>
        </button>
    </a>
            
        </nav>
    </div>
</aside>
        
            `;
  });
