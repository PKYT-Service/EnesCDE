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

// Fonction de nettoyage des caractères spéciaux
function cleanString(input) {
  return input
    .normalize('NFD') // Sépare les accents (comme é => e)
    .replace(/[\u0300-\u036f]/g, '') // Enlève les accents
    .replace(/[^A-Za-z0-9\-_\/. ]/g, '') // Supprime les caractères non autorisés
    .trim(); // Enlève les espaces au début et à la fin
}

// Applique le nettoyage en temps réel sur tous les inputs
document.querySelectorAll('input').forEach(inputElement => {
  inputElement.addEventListener('input', function(event) {
    const cleanedValue = cleanString(event.target.value);
    event.target.value = cleanedValue; // Remplace la valeur de l'input par la version nettoyée
  });
});
