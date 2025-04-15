// Secure_F12.js
export function Secure_F12() {
    function checkDevTools() {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        // Vérifie si l'utilisateur est ADMIN avant d'effectuer la redirection
        const isAdmin = localStorage.getItem('EnesCDE_ADM:F12') === 'ADMIN';

        // Si les outils de développement sont ouverts et l'utilisateur n'est pas ADMIN, on effectue la redirection
        if ((widthThreshold || heightThreshold) && !isAdmin) {
            window.location.href = "https://enes-cde.vercel.app/pages/403.html"; // Redirige vers la page 403 si non autorisé
        }
    }

    setInterval(checkDevTools, 1000);

    document.addEventListener("keydown", (event) => {
        // Vérifie si la touche F12 ou Ctrl+Shift+I est pressée et si l'utilisateur n'est pas ADMIN
        const isAdmin = localStorage.getItem('EnesCDE_ADM:F12') === 'ADMIN';

        if ((event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) && !isAdmin) {
            event.preventDefault(); // Empêche l'action par défaut
            window.location.href = "https://enes-cde.vercel.app/pages/403.html"; // Redirige vers la page 403 si non autorisé
        }
    });

    document.addEventListener("contextmenu", (event) => {
        // Empêche le menu contextuel si l'utilisateur n'est pas ADMIN
        const isAdmin = localStorage.getItem('EnesCDE_ADM:F12') === 'ADMIN';
        if (!isAdmin) {
            event.preventDefault(); // Empêche l'ouverture du menu contextuel
        }
    });
}
