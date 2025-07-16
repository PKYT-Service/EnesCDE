export function secure_psa() {
    console.warn('🛡️[E-CDE] | ⚡ALERT by PSA [SYS CLOS]');
    secure_psaa();
}

export function secure_psaa() {
    try {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        const fullUrl = window.location.href;

        const blockAccess = (reason) => {
            document.body.innerHTML = `
                <div style="background:black;color:red;font-size:2em;text-align:center;padding:50px;">
                    ⚠️ Sécurité E-CDE activée : accès interdit <br><br> 
                    Raison : ${reason}
                </div>
            `;
            console.warn(`[E-CDE] | Blocage sécurité : ${reason}`);
            setTimeout(() => window.close(), 500);
            throw new Error(`PSA Blocked: ${reason}`);
        };

        // 1. 🔐 Bloquer accès en local (localhost, 127.0.0.1, ::1)
        const localHosts = ['localhost', '127.0.0.1', '::1'];
        if (localHosts.includes(hostname)) {
            blockAccess('Environnement local détecté');
        }

        // 2. 🔐 Bloquer accès en file://
        if (protocol === 'file:') {
            blockAccess('Chargement depuis file:// interdit');
        }

        // 3. 🔐 Forcer HTTPS si page en HTTP (hors localhost)
        if (protocol === 'http:' && !localHosts.includes(hostname)) {
            const httpsURL = fullUrl.replace(/^http:/, 'https:');
            console.warn('[E-CDE] | Redirection vers HTTPS sécurisée');
            window.location.replace(httpsURL);
            return;
        }

        // 4. 🔐 Empêcher schémas douteux (ex: google://)
        const invalidProtocols = ['google:', 'chrome:', 'ftp:', 'javascript:'];
        if (invalidProtocols.includes(protocol)) {
            blockAccess(`Protocole non sécurisé détecté : ${protocol}`);
        }

        // 5. 🔐 Anti-tampering basique
        const integrity_check = 'psa_integrity_marker_v1';
        const scriptContent = document.currentScript?.textContent || '';
        if (!scriptContent.includes(integrity_check)) {
            blockAccess('Intégrité du code compromise');
        }

        console.log('[E-CDE] ✅ Sécurité PSAA validée.');
    } catch (err) {
        console.error('[E-CDE] ❌ Sécurité PSAA violée', err);
        throw new Error('Sécurité PSAA - accès interdit');
    }
}
