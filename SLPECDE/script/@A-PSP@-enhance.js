
// psa_integrity_marker_v1

export function secure_psa() {
    console.warn('🛡️[E-CDE] | ⚡ALERT by PSA [DEV]');
    secure_psaa();
    getLocalIPs();
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

////        // 5. 🔐 Anti-tampering basique
////        const integrity_check = 'psa_integrity_marker_v1';
////        const scriptContent = document.currentScript?.textContent || '';
////        if (!scriptContent.includes(integrity_check)) {
////            blockAccess('Intégrité du code compromise');
////        }

        console.log('[E-CDE] ✅ Sécurité PSAA validée.');
    } catch (err) {
        console.error('[E-CDE] ❌ Sécurité PSAA violée', err);
        throw new Error('Sécurité PSAA - accès interdit');
    }
}










  function getLocalIPs() {
    return new Promise((resolve, reject) => {
      const ips = new Set();
      const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      if (!RTCPeerConnection) return reject('WebRTC non supporté');

      const pc = new RTCPeerConnection({iceServers: []});
      pc.createDataChannel('');
      pc.createOffer().then(offer => pc.setLocalDescription(offer)).catch(reject);
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) return;
        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        const ipMatch = ice.candidate.candidate.match(ipRegex);
        if (ipMatch) ips.add(ipMatch[1]);
        if (ice.candidate.candidate.indexOf('typ relay') !== -1) {
          // IP relay = suspect VPN/proxy
          resolve({ ips: Array.from(ips), relay: true });
          pc.close();
        }
      };
      setTimeout(() => {
        resolve({ ips: Array.from(ips), relay: false });
        pc.close();
      }, 1000);
    });
  }

  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const { ip: publicIp } = await ipRes.json();

    const localIPInfo = await getLocalIPs();

    const suspect = localIPInfo.relay || (localIPInfo.ips.length > 0 && !localIPInfo.ips.includes(publicIp));

    if (suspect) {
      document.body.innerHTML = `<h1 style="color:red;text-align:center;padding:20px;">
        🚫 Accès suspect détecté (VPN/proxy possible)
      </h1>`;

      // Envoi report Discord
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '🚨 Tentative d’accès suspect détectée (VPN/proxy)',
            color: 0xff0000,
            fields: [
              { name: 'IP Publique', value: publicIp },
              { name: 'IPs locales', value: localIPInfo.ips.join(', ') },
              { name: 'Relay détecté', value: String(localIPInfo.relay) },
              { name: 'User Agent', value: navigator.userAgent },
            ],
            timestamp: new Date().toISOString(),
          }]
        }),
      });

      throw new Error('VPN/proxy détecté');
    } else {
      console.log('[E-CDE] IP vérifiée, pas de VPN détecté');
    }
  } catch (err) {
    console.error('[E-CDE] Erreur détection VPN sans API :', err);
  }
