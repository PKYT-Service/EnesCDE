export function secure_psa() {
    try {
        // 1. Verifier si on est en localhost ou fichier local
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        if (hostname === 'localhost' || protocol === 'file:') {
            throw new Error('Unauthorized environment');
        }

        // 2. Verifier si le code source a ete modifie (anti-tampering basique)
        const integrity_check = 'psa_integrity_marker_v1';
        if (!document.currentScript || !document.currentScript.innerHTML.includes(integrity_check)) {
            // Si le script n'est pas inline ou modifie, on lance une erreur
            console.warn('Warning: Unable to verify script integrity.');
            throw new Error('Unauthorized environment');
        }

        // Tout est ok
        console.log('PSP secure check passed.');
    } catch (e) {
        console.error('Security violation detected by secure_psa()');
        throw new Error('Unauthorized environment');
    }
}
