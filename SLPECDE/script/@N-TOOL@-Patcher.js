export function Rules() {
    if (localStorage.getItem('rules') === 'false') {
        localStorage.removeItem('rules');
    }  
}
export function ADM_RPE() {
    if (localStorage.getItem('EnesCDE_ADM:RPE') === 'false') {
        localStorage.removeItem('EnesCDE_ADM:RPE');
    }
}

export function patch() {
  // Ne rien faire si une div avec id commencant par "repo/" existe
  const repoDiv = document.querySelector('div[id^="repo/"]');
  if (repoDiv) return;

  // Fonction de nettoyage des caracteres speciaux
  function cleanString(input) {
    return input
      .normalize('NFD') // Étape 1: Décomposer les caractères accentués
      .replace(/[\u0300-\u036f]/g, '') // Étape 2: Supprimer les diacritiques (accents)
      .replace(/[^A-Za-z0-9@\-_/\. \n:(){}!?\.;\*_\`+#'#]/g, '') // Étape 3: Filtrer les caractères autorisés
      .replace(/[ ]{2,}/g, ' '); // Étape 4: Éviter les doubles espaces
}


  // Applique le nettoyage en temps reel sur les inputs et textareas
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', function(event) {
      const cleanedValue = cleanString(event.target.value);
      event.target.value = cleanedValue;
    });
  });



  // Ajout du meta si pas deja present
  if (!document.querySelector('meta[name="viewport"]')) {
    const meta = document.createElement('meta')
    meta.name = 'viewport'
    meta.content = 'width=device-width, initial-scale=1.0'
    document.head.appendChild(meta)
  }

  // Ajout du favicon si pas deja present
  if (!document.querySelector('link[rel="icon"]')) {
    const favicon = document.createElement('link')
    favicon.rel = 'icon'
    favicon.type = 'image/png'
    favicon.href = 'https://enes-cde.vercel.app/data/img/web/favicon.png'
    document.head.appendChild(favicon)
  }
}



  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("main").forEach(main => {
      main.classList.add(
        "flex-1",
        "p-6",
        "bg-gray-100",
        "dark:bg-gray-800",
        "overflow-y-auto",
        "min-w-0"
      );
    });
  });
