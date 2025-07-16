// Secure_F12.js
export function Secure_F12() {
    const isAdmin = () => localStorage.getItem('EnesCDE_ADM:F12') === 'ADMIN';

    // 🔐 Méthode DevTools avancée (fonction toString piégée)
    const detectDevTools = () => {
        const devtools = new Function();
        devtools.toString = function () {
            if (!isAdmin()) {
                window.location.href = "https://enes-cde.vercel.app/pages/403.html";
            }
            return 'function () {}';
        };
        console.log('%c', devtools);
    };

    // 🕵️‍♂️ Vérification clavier
    document.addEventListener("keydown", (event) => {
        if (!isAdmin() && (
            event.key === "F12" ||
            (event.ctrlKey && event.shiftKey && event.key.toUpperCase() === "I") ||
            (event.ctrlKey && event.shiftKey && event.key.toUpperCase() === "J")
        )) {
            event.preventDefault();
            window.location.href = "https://enes-cde.vercel.app/pages/403.html";
        }
    });

    // 🛑 Désactivation clic droit
    document.addEventListener("contextmenu", (event) => {
        if (!isAdmin()) {
            event.preventDefault();
        }
    });

    // 👀 Lancement
    setInterval(detectDevTools, 1500);
}
