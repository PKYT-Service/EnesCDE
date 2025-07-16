export function Secure_F12() {
    const isAdmin = () => localStorage.getItem('EnesCDE_ADM:F12') === 'ADMIN';

    function isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    function isInApp() {
        return window.navigator.standalone === true
            || window.matchMedia('(display-mode: standalone)').matches
            || /wv|webview|electron/i.test(navigator.userAgent);
    }

    console.log('UserAgent:', navigator.userAgent);
    console.log('Is Mobile:', isMobile());
    console.log('Is Admin:', isAdmin());
    console.log('Is App:', isInApp());

    if (isMobile() || isInApp()) {
        console.log('Mobile ou App détecté, désactivation de la détection DevTools.');
        return;
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
