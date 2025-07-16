export function Secure_F12() {
    const isAdmin = () => localStorage.getItem('EnesCDE_ADM:F12') === 'ADMIN';
    if (isAdmin()) return; // Admin exempté, pas de détection

    function isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    function isInApp() {
        return window.navigator.standalone === true
            || window.matchMedia('(display-mode: standalone)').matches
            || /wv|webview|electron/i.test(navigator.userAgent);
    }

    if (isMobile() || isInApp()) {
        console.log("[E-CDE] Mobile ou App détecté, détection désactivée.");
        return;
    }

    let devToolsOpen = false;
    let checkStartedAt = Date.now();

    const detectDevTools = () => {
        if (Date.now() - checkStartedAt < 5000) return; // délai de grâce 5s

        const devtools = new Function();
        devtools.toString = function () {
            devToolsOpen = true;
            return 'function () {}';
        };
        console.log('%c', devtools);

        if (devToolsOpen) {
            console.warn('[E-CDE] DevTools détecté, redirection dans 1s');
            setTimeout(() => {
                if (!isAdmin()) {
                    window.location.href = "https://enes-cde.vercel.app/pages/403.html";
                }
            }, 1000);
        }
    };

    document.addEventListener("keydown", (event) => {
        if (!isAdmin() && (
            event.key === "F12" ||
            (event.ctrlKey && event.shiftKey && ["I", "J"].includes(event.key.toUpperCase()))
        )) {
            event.preventDefault();
            window.location.href = "https://enes-cde.vercel.app/pages/403.html";
        }
    });

    document.addEventListener("contextmenu", (event) => {
        if (!isAdmin()) event.preventDefault();
    });

    setInterval(detectDevTools, 5000);
}
