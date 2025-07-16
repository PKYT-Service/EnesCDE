export function Secure_F12() {
    const isAdmin = () => localStorage.getItem('EnesCDE_ADM:F12') === 'ADMIN';

    function isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    if (isMobile()) {
        console.log("[E-CDE] Mobile détecté, désactivation de la détection DevTools.");
        return; // Pas de blocage sur mobile
    }

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

    document.addEventListener("keydown", (event) => {
        if (!isAdmin() && (
            event.key === "F12" ||
            (event.ctrlKey && event.shiftKey && ["I","J"].includes(event.key.toUpperCase()))
        )) {
            event.preventDefault();
            window.location.href = "https://enes-cde.vercel.app/pages/403.html";
        }
    });

    document.addEventListener("contextmenu", (event) => {
        if (!isAdmin()) event.preventDefault();
    });

    setInterval(detectDevTools, 1500);
}
