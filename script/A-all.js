//
// Place Text from ``
//
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ecde_all").innerHTML = `

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

        /// Cookies
    document.write("<script type=\"text\/javascript\">\r\nvar _iub = _iub || [];\r\n_iub.csConfiguration = {\"siteId\":3947906,\"cookiePolicyId\":60956874,\"lang\":\"fr\",\"storage\":{\"useSiteId\":true}};\r\n<\/script>\r\n<script type=\"text\/javascript\" src=\"https:\/\/cs.iubenda.com\/autoblocking\/3947906.js\"><\/script>\r\n<script type=\"text\/javascript\" src=\"\/\/cdn.iubenda.com\/cs\/gpp\/stub.js\"><\/script>\r\n<script type=\"text\/javascript\" src=\"\/\/cdn.iubenda.com\/cs\/iubenda_cs.js\" charset=\"UTF-8\" async><\/script>");

//////////////////////////////////////////////
// PKYT - Service + Enes-CDE Script         //
//////////////////////////////////////////////


// Fonction pour charger le script externe et l'appliquer à la page
const loadScriptAndApply = async () => {
  try {
    // Récupérer le fichier JavaScript depuis l'URL
    const response = await fetch('https://pkyt-database-up.vercel.app/code-source/tout-service-lier-pkyt.js');
    
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




document.addEventListener("DOMContentLoaded", () => {
    const themes = ["red", "blue", "green", "yellow", "purple", "pink", "gray"];
    let theme = localStorage.getItem("theme") || "blue";
    
    const app = document.createElement("div");
    app.id = "app";
    app.className = `min-h-screen p-5 relative bg-${theme}-100 text-${theme}-800 dark:bg-${theme}-900 dark:text-${theme}-100`;
    document.body.appendChild(app);
    
    const title = document.createElement("h1");
    title.className = "text-3xl font-bold";
    title.innerText = "Sélecteur de Thème";
    app.appendChild(title);
    
    const openPopup = document.createElement("button");
    openPopup.id = "openPopup";
    openPopup.className = "fixed top-1/2 left-0 transform -translate-y-1/2 bg-gray-600 text-white px-4 py-2 rounded-r";
    openPopup.innerText = "Popup";
    document.body.appendChild(openPopup);
    
    const popup = document.createElement("div");
    popup.id = "popup";
    popup.className = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-${theme}-200 text-${theme}-900 dark:bg-${theme}-800 dark:text-${theme}-100 p-5 shadow-lg rounded hidden`;
    document.body.appendChild(popup);
    
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "mt-4 flex gap-3";
    popup.appendChild(buttonsContainer);
    
    themes.forEach(t => {
        const button = document.createElement("button");
        button.innerText = t;
        button.className = `px-4 py-2 bg-${t}-500 text-white rounded`;
        button.onclick = () => {
            theme = t;
            localStorage.setItem("theme", theme);
            applyTheme();
        };
        buttonsContainer.appendChild(button);
    });
    
    const closePopup = document.createElement("button");
    closePopup.id = "closePopup";
    closePopup.className = "mt-2 bg-red-500 text-white px-4 py-2 rounded";
    closePopup.innerText = "Fermer";
    popup.appendChild(closePopup);
    
    function applyTheme() {
        app.className = `min-h-screen p-5 relative bg-${theme}-100 text-${theme}-800 dark:bg-${theme}-900 dark:text-${theme}-100`;
        popup.className = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-${theme}-200 text-${theme}-900 dark:bg-${theme}-800 dark:text-${theme}-100 p-5 shadow-lg rounded hidden`;
    }
    
    applyTheme();
    
    openPopup.addEventListener("click", () => popup.classList.remove("hidden"));
    closePopup.addEventListener("click", () => popup.classList.add("hidden"));
});



