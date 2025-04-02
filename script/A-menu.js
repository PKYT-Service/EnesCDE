document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ecde_menu").innerHTML = `     
<link href="https://enes-cde.vercel.app/script/Theme.css" rel="stylesheet" />

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

            <a href="https://enes-cde.vercel.app/equipe.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </button>
            </a>

            <a href="https://enes-cde.vercel.app/depots.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                </button>
            </a>

            <a href="https://enes-cde.vercel.app/events.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>
            </a>

            <a href="https://enes-cde.vercel.app/ressources.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </button>
            </a>

            <a href="https://enes-cde.vercel.app/bientot.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </button>
            </a>



         <a href="https://enes-cde.vercel.app/search.html">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
       <svg xmlns="http://www.w3.org/2000/svg" class="class="h-6 w-6"" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 18a8 8 0 100-16 8 8 0 000 16zm6-2l4 4" />
        </svg>
                </button>
            </a>

            
            <a href="https://enes-cde.vercel.app/users/">
                <button class="w-full p-3 flex justify-center rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800">
<svg class="h-6 w-6 fill-black stroke-black dark:fill-white dark:stroke-white" 
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
        </nav>
    </div>
</aside>
        

        
            `;
  });







    function setTheme(theme) {
        document.body.className = theme + " min-h-screen flex flex-col transition-all duration-300";
        localStorage.setItem('selectedTheme', theme);
    }
    
    function loadTheme() {
        const savedTheme = localStorage.getItem('selectedTheme') || 'theme-light';
        document.body.className = savedTheme + " min-h-screen flex flex-col transition-all duration-300";
    }
    
    window.onload = loadTheme;

