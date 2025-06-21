
//
// Place Text from ``
//
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ecde_all").innerHTML = `
<div class="absolute inset-0">
    <div class=" bg-white relative h-full w-full [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[radial-gradient(circle_at_center,#FF7112,transparent)] [&>div]:opacity-30 [&>div]:mix-blend-multiply">
    <div></div>
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


























