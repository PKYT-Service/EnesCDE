
//
// Place Text from ``
//
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ecde_all").innerHTML = `
  <nav x-data="{
navigationMenuOpen: false,
navigationMenu: '',
navigationMenuCloseDelay: 200,
navigationMenuCloseTimeout: null,
navigationMenuLeave() {
let that = this;
this.navigationMenuCloseTimeout = setTimeout(() => {
that.navigationMenuClose();
}, this.navigationMenuCloseDelay);
},
navigationMenuReposition(navElement) {
this.navigationMenuClearCloseTimeout();
this.$refs.navigationDropdown.style.left = navElement.offsetLeft + 'px';
this.$refs.navigationDropdown.style.marginLeft = (navElement.offsetWidth/2) + 'px';
},
navigationMenuClearCloseTimeout(){
clearTimeout(this.navigationMenuCloseTimeout);
},
navigationMenuClose(){
this.navigationMenuOpen = false;
this.navigationMenu = '';
}
}"
class="relative z-10 w-auto">
<div class="relative">
<ul class="flex items-center justify-center flex-1 p-1 space-x-1 list-none border rounded-md text-neutral-700 group border-neutral-200/80">
<li>
<button
:class="{ 'bg-neutral-100' : navigationMenu=='getting-started', 'hover:bg-neutral-100' : navigationMenu!='getting-started' }" @mouseover="navigationMenuOpen=true; navigationMenuReposition($el); navigationMenu='getting-started'" @mouseleave="navigationMenuLeave()" class="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:text-neutral-900 focus:outline-none disabled:opacity-50 disabled:pointer-events-none group w-max">
<span class="font-bold">E - <a class="text-blue-800"> CDE </a></span>
<svg :class="{ '-rotate-180' : navigationMenuOpen==true && navigationMenu == 'getting-started' }" class="relative top-[1px] ml-1 h-3 w-3 ease-out duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
</button>
</li>
<li>
<button
:class="{ 'bg-neutral-100' : navigationMenu=='learn-more', 'hover:bg-neutral-100' : navigationMenu!='learn-more' }" @mouseover="navigationMenuOpen=true; navigationMenuReposition($el); navigationMenu='learn-more'" @mouseleave="navigationMenuLeave()" class="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:text-neutral-900 focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-background hover:bg-neutral-100 group w-max">
<span class="font-bold"> Divers </span>
<svg :class="{ '-rotate-180' : navigationMenuOpen==true && navigationMenu == 'learn-more' }" class="relative top-[1px] ml-1 h-3 w-3 ease-out duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
</button>
</li>
<li>
<!--<a href="#_" class="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:text-neutral-900 focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-background hover:bg-neutral-100 group w-max">
Niets
</a>-->
</li>
</ul>
</div>
<div x-ref="navigationDropdown" x-show="navigationMenuOpen"
x-transition:enter="transition ease-out duration-100"
x-transition:enter-start="opacity-0 scale-90"
x-transition:enter-end="opacity-100 scale-100"
x-transition:leave="transition ease-in duration-100"
x-transition:leave-start="opacity-100 scale-100"
x-transition:leave-end="opacity-0 scale-90"
@mouseover="navigationMenuClearCloseTimeout()" @mouseleave="navigationMenuLeave()"
class="absolute top-0 pt-3 duration-200 ease-out -translate-x-1/2 translate-y-11" x-cloak>
<div class="flex justify-center w-auto h-auto overflow-hidden bg-white border rounded-md shadow-sm border-neutral-200/70">
<div x-show="navigationMenu == 'getting-started'" class="flex items-stretch justify-center w-full max-w-2xl p-6 gap-x-3">
<div class="flex-shrink-0 w-48 rounded pt-28 pb-7 bg-gradient-to-br from-neutral-800 to-black">
<div class="relative px-7 space-y-1.5 text-white">
<svg class="block w-auto h-9" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M67.683 89.217h44.634l30.9 53.218H36.783l30.9-53.218Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M77.478 120.522h21.913v46.956H77.478v-46.956Zm-34.434-29.74 45.59-78.26 46.757 78.26H43.044Z" fill="currentColor"/></svg>
<span class="block font-bold"> Enes - Community Developpement enhancement </span>
<span class="block text-sm opacity-60">Une communauté !</span>
</div>
</div>
<div class="w-72">
<a href="https://enes-cde.vercel.app/equipe.html" @click="navigationMenuClose()" class="block px-3.5 py-3 text-sm rounded hover:bg-neutral-100">
<span class="block mb-1 font-medium text-black">équipes</span>
<span class="block font-light leading-5 opacity-50">Découvrer les membres de E-CDE.</span>
</a>
<a href="https://enes-cde.vercel.app/ressources.html" @click="navigationMenuClose()" class="block px-3.5 py-3 text-sm rounded hover:bg-neutral-100">
<span class="block mb-1 font-medium text-black">Ressources</span>
<span class="block leading-5 opacity-50">Vous permet de consulter l'etat de nos API.</span>
</a>
<a href="https://enes-cde.vercel.app/depots.html" @click="navigationMenuClose()" class="block px-3.5 py-3 text-sm rounded hover:bg-neutral-100">
<span class="block mb-1 font-medium text-black">Dépot</span>
<span class="block leading-5 opacity-50">Plusieurs fichiers , site liés et autres sont disponible dans cette page.</span>
</a>
<a href="https://enes-cde.vercel.app/events.html" @click="navigationMenuClose()" class="block px-3.5 py-3 text-sm rounded hover:bg-neutral-100">
<span class="block mb-1 font-medium text-black">Evenements</span>
<span class="block leading-5 opacity-50">Divers evenements , disponibles.</span>
</a>
<a href="https://enes-cde.vercel.app/depots.html" @click="navigationMenuClose()" class="block px-3.5 py-3 text-sm rounded hover:bg-neutral-100">
<span class="block mb-1 font-medium text-black">Dépot</span>
<span class="block leading-5 opacity-50">Plusieurs fichiers , site liés et autres sont disponible dans cette page.</span>
</a>
<a href="https://enes-cde.vercel.app/search.html" @click="navigationMenuClose()" class="block px-3.5 py-3 text-sm rounded hover:bg-neutral-100">
<span class="block mb-1 font-medium text-black">DARPD</span>
<span class="block leading-5 opacity-50">Code E-CDE , fournit pour accedez a des pages specifique ou dedié au administrateur [& debuggeur].</span>
</a>
<a href="https://enes-cde.vercel.app/users/" @click="navigationMenuClose()" class="block px-3.5 py-3 text-sm rounded hover:bg-neutral-100">
<span class="block mb-1 font-medium text-black">Users</span>
<span class="block leading-5 opacity-50">Connectez-vous pour avoir accès a vos espaces.</span>
</a>



</div>
</div>
<div x-show="navigationMenu == 'learn-more'" class="flex items-stretch justify-center w-full p-6">
<div class="w-72">
<a href="https://ebsayderflyse.vercel.app" @click="navigationMenuClose()" class="block px-3.5 py-3 text-sm rounded hover:bg-neutral-100">
<span class="block mb-1 font-medium text-black">Ebsayder<b class="text-blue-800">Flyse</b></span>
<span class="block font-light leading-5 opacity-50">Serveur <b class="text-green-500">Minecraft</b> basé sur un monde RolePlay.</span>
</a>
<a href="https://howardarmory.vercel.app" @click="navigationMenuClose()" class="block px-3.5 py-3 text-sm rounded hover:bg-neutral-100">
<span class="block mb-1 font-medium text-black">Howard<b class="text-blue-800">Armory</b></span>
<span class="block font-light leading-5 opacity-50">Le GunShop Howard , basé sur Nashville [<b class="text-blue-800">GMOD > Gta City RP]</b>.</span>
</a>
<a href="https://campyskerie.vercel.app" @click="navigationMenuClose()" class="block px-3.5 py-3 text-sm rounded hover:bg-neutral-100">
<span class="block mb-1 font-medium text-black">Campyskerie</span>
<span class="block leading-5 opacity-50">Un Royaume , ou le seigneur reigne l'ordre [<b class="text-green-500">Minecraft Java] </b></span>
</a>
</div>
<div class="w-72">
<a href="https://pkyt-database-up.vercel.app/" @click="navigationMenuClose()" class="block px-3.5 py-3 text-sm rounded hover:bg-neutral-100">
<span class="block mb-1 font-medium text-black">PKYT - Service</span>
<span class="block font-light leading-5 opacity-50">Ancien service de compte et de sécurité.</span>
</a>
<a href="https://enes-cde.vercel.app/redirect.html?LB=discord" @click="navigationMenuClose()" class="block px-3.5 py-3 text-sm rounded hover:bg-neutral-100">
<span class="block mb-1 font-medium text-black">Notre <u><b>DISCORD</b></u></span>
<span class="block leading-5 opacity-50">Rejoignez notre communauté !</span>
</a>
<a href="https://enes-cde.vercel.app/redirect.html?LB=pdc" @click="navigationMenuClose()" class="block px-3.5 py-3 text-sm rounded hover:bg-neutral-100">
<span class="block mb-1 font-medium text-black">Politique de confidentialité</span>
<span class="block leading-5 opacity-50">Nos conditions web et CDT pour service lié(s).</span>
</a>
</div>
</div>
</div>
</div>
</nav>
    `;
  });
  //
  // Replace Text from TB.json
  //
    // Fonction pour charger le fichier JSON et remplacer les balises
    async function replaceTextFromJson() {
        try {
          // Charger le fichier JSON avec les clés et leurs valeurs
          const response = await fetch('https://enes-cde.vercel.app/data/json/TB.json');
          const jsonData = await response.json();
   
          // Sélectionner tous les éléments avec un id spécifique
          const elements = document.querySelectorAll('[id^="ecde_annee_set"]');
          
          elements.forEach((element) => {
            const key = element.id; // La clé ici est l'id entier (ex : 'ecde_annee_set')
            
            // Vérifier si la clé existe dans le fichier JSON
            if (jsonData.hasOwnProperty(key)) {
              // Remplacer le contenu de la balise par la valeur correspondante
              element.textContent = jsonData[key];
            } else {
              console.warn(`Clé "${key}" introuvable dans le fichier JSON.`);
            }
          });
  
        } catch (error) {
          console.error("Erreur lors du chargement du fichier JSON:", error);
        }
      }
  
      // Appeler la fonction pour remplacer les textes dès que la page est prête
      document.addEventListener('DOMContentLoaded', replaceTextFromJson);


//////////////////////////////////////////////
// Google Cookies + Google analitycs        //
//////////////////////////////////////////////
 
        /// analitycs
    document.write("<!-- Google tag (gtag.js) -->\r\n<script async src=\"https:\/\/www.googletagmanager.com\/gtag\/js?id=G-NHMQWLC3VY\"><\/script>\r\n<script>\r\n  window.dataLayer = window.dataLayer || [];\r\n  function gtag(){dataLayer.push(arguments);}\r\n  gtag('js', new Date());\r\n\r\n  gtag('config', 'G-NHMQWLC3VY');\r\n<\/script>");

//////////////////////////////////////////////
// PKYT - Service + Enes-CDE Script         //
//////////////////////////////////////////////


// Fonction pour charger le script externe et l'appliquer à la page
const loadScriptAndApply = async () => {
  try {
    // Récupérer le fichier JavaScript depuis l'URL
    const response = await fetch('https://enes-cde.vercel.app/SLPECDE/m.js');
    
    if (!response.ok) {
      throw new Error('🌟[E-CDE] | Erreur lors du chargement du script.');
    }
    
    const scriptContent = await response.text();
    
    // Créer un élément script et spécifier qu'il s'agit d'un module
    const scriptElement = document.createElement('script');
    scriptElement.type = 'module'; // Indique que le script doit être traité comme un module
    scriptElement.textContent = scriptContent;
    
    // Ajouter le script à la page
    document.body.appendChild(scriptElement);
    
    console.log("🌟[E-CDE] | ✅ Le contenu du fichier a été chargé et appliqué avec succès.");
    
  } catch (error) {
    console.error("🌟[E-CDE] | 🟥 Erreur lors du chargement du fichier :", error);
  }
};

// Charger et appliquer le fichier à la page
loadScriptAndApply();


























