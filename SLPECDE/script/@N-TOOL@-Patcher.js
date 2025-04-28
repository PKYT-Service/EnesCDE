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


// Fonction de nettoyage des caracteres speciaux
function cleanString(input) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enleve les accents
    .replace(/[^A-Za-z0-9@\-_/\. \n:()\[\]{}*_\`]/g, '') // Garde (){}[]**__` aussi
    .replace(/[ ]{2,}/g, ' '); // Evite les doubles espaces
}
// Applique le nettoyage en temps reel sur les inputs et textareas
document.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', function(event) {
    const cleanedValue = cleanString(event.target.value);
    event.target.value = cleanedValue;
  });
});
