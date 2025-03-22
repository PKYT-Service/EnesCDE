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



            <a href="./LOG_View.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7.305 4.5 3.135 7.305 1.5 12c1.635 4.695 5.805 7.5 10.5 7.5s8.865-2.805 10.5-7.5c-1.635-4.695-5.805-7.5-10.5-7.5zm0 13.5c-3.315 0-6.135-2.01-7.5-5 1.365-2.99 4.185-5 7.5-5s6.135 2.01 7.5 5c-1.365 2.99-4.185 5-7.5 5zm0-8.25c-1.8 0-3.25 1.45-3.25 3.25s1.45 3.25 3.25 3.25 3.25-1.45 3.25-3.25-1.45-3.25-3.25-3.25zm0 5.5c-1.24 0-2.25-1.01-2.25-2.25s1.01-2.25 2.25-2.25 2.25 1.01 2.25 2.25-1.01 2.25-2.25 2.25z"/>
                            <text x="4" y="22" font-family="Arial, sans-serif" font-size="4" font-weight="bold">LOG</text>
                        </svg>
                </button>
            </a>

            <a href="./LOG_statistiques.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                       <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 15h2v2H7v-2zm4-4h2v6h-2v-6zm4-4h2v10h-2V7z"/>
                            <text x="4" y="22" font-family="Arial, sans-serif" font-size="4" font-weight="bold" class="text-gray-500">LOG</text>
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

            <a href="https://enes-cde.vercel.app/users/">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
<svg class="h-6 w-6"
     xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 48 48">
  <g id="SVGRepo_iconCarrier"> 
    <path d="M0 0h48v48H0z" fill="none"></path> 
    <g id="Shopicon"> 
      <path d="M31.278,25.525C34.144,23.332,36,19.887,36,16c0-6.627-5.373-12-12-12c-6.627,0-12,5.373-12,12 c0,3.887,1.856,7.332,4.722,9.525C9.84,28.531,5,35.665,5,44h38C43,35.665,38.16,28.531,31.278,25.525z M16,16c0-4.411,3.589-8,8-8 s8,3.589,8,8c0,4.411-3.589,8-8,8S16,20.411,16,16z M24,28c6.977,0,12.856,5.107,14.525,12H9.475C11.144,33.107,17.023,28,24,28z"></path> 
    </g> 
  </g>
</svg>

                </button>
            </a> 
<hr>
                        <a href="./settings.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
<svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
>
    <path d="M12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7z" />
    <path d="M19.4 15.5a1.5 1.5 0 0 0 .1-1.5l-1.7-3a1.5 1.5 0 0 0-1.3-.8h-2.1a7.5 7.5 0 0 0-1.5-1.5v-2.1a1.5 1.5 0 0 0-.8-1.3l-3-1.7a1.5 1.5 0 0 0-1.5.1l-2.5 2.5a1.5 1.5 0 0 0-.1 1.5l1.7 3a1.5 1.5 0 0 0 1.3.8h2.1a7.5 7.5 0 0 0 1.5 1.5h2.1a1.5 1.5 0 0 0 1.3-.8z" />
</svg>
                </button>
            </a>
            
        </nav>
    </div>
</aside>
        
            `;
  });
