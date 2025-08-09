console.log("[MD ECDE][LOAD][INIT]");
// Service lié par EnesCDE 
// PKYT - Service , Tous droits réservées.
// 2020 - 2024 [ NaxeWayz , FayzXase , LosFlyTM by PikaYutMG , GFLP - LSP # SRDMG , SourceDevMG , PikaYutMG , PKYT - service / PKYT - DATABASE + PKYT - DATABASE - UP , nom appartenant a E-CDE ( D.Enes ) ].
// 2017 - 2022 [ LosFly ] deretour en 2025(../02.2024)
// Patch : 3 04/02/2025
// Patch : 4 11/07/2025
// Sortie officielle : 10/09/2024
// By EnesGP ( Enes D-GP )

console.log("⌛ | AllService ✅ [ Les script ont été chargés]");
console.log(" [❇️🔰] | ToutServiceLierPkyt : Enes - CDE , Tous droits réservées ");
console.log(" [❇️🔰] | ToutServiceLierPkyt : LosFly , Tous droits réservées ");
console.log(" [❇️🔰] | ToutServiceLierPkyt : PKYT - Service , Tous droits réservées ");
console.log(" [❇️🔰] | ToutServiceLierPkyt : 2020 - 2024 [ NaxeWayz , FayzXase , LosFlyTM by PikaYutMG , GFLP - LSP # SRDMG , SourceDevMG , PikaYutMG , PKYT - service / PKYT - DATABASE + PKYT - DATABASE - UP , nom appartenant a E-CDE ( D.Enes ) ]");
console.log(" [❇️🔰] | ToutServiceLierPkyt : 2017 - 2022 [ LosFly ] deretour en 2025(../02.2024)");
console.log(" [❇️🔰] | ToutServiceLierPkyt : By EnesGP ( Enes D-GP )");

// Fonction générique de chargement sécurisé
async function chargerModule(url, nomFonction) {
  try {
    const module = await import(url);
    if (typeof module[nomFonction] === "function") {
      module[nomFonction]();
      console.warn(`🛡️[E-CDE] | 🔑 [P_ECDE✅] ${nomFonction} chargé depuis ${url}`);
    } else {
      console.warn(`[⚠️] ${nomFonction} est introuvable dans ${url}`);
    }
  } catch (err) {
    console.error(`[❌] Erreur lors du chargement de ${nomFonction} depuis ${url} :`, err);
  }
}

(async () => {
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@A-FCT@-Csl.js", "ECDE_Console");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@A-FCT@-F12.js", "Secure_F12");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@A-FCT@-Rfh.js", "Secure_Ref");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-Check@-RulesIsTrue.js", "CheckRulesToAcces");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-Check@-TabsLimites.js", "CheckTabs_OpenLimit");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-Check@-V3AccBan.js", "checkBan_Account3V");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-FCT@-ClearCsl.js", "CO_Cleaner_ecde");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-TOOL@-Patcher.js", "Rules");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-TOOL@-Patcher.js", "ADM_RPE");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-TOOL@-Patcher.js", "patch");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@U-FCT@-E.CDE-Sys.js", "pu_ucd_ecde");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@U-FCT@-SyncData.js", "PU_Sync");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@U-ID@-Ban.js", "ecde_client");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@U-ID@-Log.js", "ID_log_ecde");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@U-ID@-Storage.js", "ID_stock_ecde");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@U-ID@-Verification.js", "ID_verif_ecde");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@W-FCT@WebMng.js", "WebManager");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@A-FCT@-LogsD.js", "LogsDiscord");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@A-PSP@-enhance.js", "secure_psa");
  // storeLoginFromURL est désactivé pour l'instant
  // await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-Check@-StoreLogin.js", "storeLoginFromURL");
})();

// Clarity Microsoft
(function(c, l, a, r, i, t, y) {
  c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
  t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "p48i5fvwyv");

// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-MHN0VB5ENT');
document.write("<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-MHN0VB5ENT\"><\/script>");

// Ajout meta viewport
document.write("<meta name=\"viewport\" content=\"initial-scale=1\" />");

// Chargement de la police et overlay
document.addEventListener("DOMContentLoaded", function () {
  const fontLink = document.createElement("link");
  fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  const loadingOverlay = document.createElement("div");
  Object.assign(loadingOverlay.style, {
    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
    backgroundColor: "black", color: "white", display: "flex",
    flexDirection: "column", justifyContent: "center", alignItems: "center",
    fontFamily: "'Poppins', sans-serif", zIndex: "1000"
  });

  const mainText = document.createElement("div");
  mainText.innerHTML = `PKYT - <span style="color: #145af2;">Service</span> <br> <font color="red">Maintenance</font>`;
  Object.assign(mainText.style, { fontSize: "24px", fontWeight: "bold", marginBottom: "10px" });

  const subText = document.createElement("div");
  subText.innerHTML = `By <b><i>EnesGP</i></b>`;
  Object.assign(subText.style, { color: "#ADAFB6", fontSize: "16px", marginBottom: "20px" });

  const dotFlashingContainer = document.createElement("div");
  Object.assign(dotFlashingContainer.style, {
    display: "flex", position: "absolute", bottom: "50px",
    justifyContent: "center", alignItems: "center"
  });

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    Object.assign(dot.style, {
      width: "10px", height: "10px", margin: "0 5px",
      backgroundColor: "white", borderRadius: "50%",
      animation: `dotFlashing 1s infinite alternate`,
      animationDelay: `${i * 0.2}s`,
    });
    dotFlashingContainer.appendChild(dot);
  }

  const bottomLeftText = document.createElement("div");
  bottomLeftText.innerHTML = "<b>PKYT - <font color='#145af2'>Service </font> </b><i>DEBUT : 03/02/2025 </i>: <b><mark>all rights reserved .</mark> </b>";
  Object.assign(bottomLeftText.style, {
    position: "absolute", bottom: "10px", left: "10px", fontSize: "14px", color: "#ADAFB6",
  });

  loadingOverlay.appendChild(mainText);
  loadingOverlay.appendChild(subText);
  loadingOverlay.appendChild(dotFlashingContainer);
  loadingOverlay.appendChild(bottomLeftText);
  document.body.appendChild(loadingOverlay);

  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes dotFlashing {
      0% { opacity: 0.2; }
      50%, 100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Retirer l'overlay immédiatement (ajuste à 3000ms pour effet)
  setTimeout(() => {
    loadingOverlay.remove();
  }, 0);
});







// @N-TOOL@-DCP-Ext.js
// ✅ Renforcement global ECDE avec log PPDS toutes les 1 minute

const DCP_EXT = (() => {
    const SECRET_KEY_URL = "https://pkyt-database-up.vercel.app/code-source/E-CDE/secure-key.js";
    const PPDS_LOG_URL = "https://api.github.com/repos/PKYT-Service/PPDS/contents/logs/DCP-Ext.json"; // ⚠️ à adapter
    let SECRET_KEY = null;
    let GITHUB_TOKEN = null;

    // --- INIT
    async function init() {
        SECRET_KEY = await fetchKey(SECRET_KEY_URL, "SECURE_KEY");
        GITHUB_TOKEN = await fetchKey("https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js", "GITHUB_TOKEN");

        console.log("🔐 [DCP-Ext] Clé + Token chargés:", !!SECRET_KEY, !!GITHUB_TOKEN);

        secureExistingData([
            "ECDE:ID", "ECDE:ID_IP", "ECDE:ID_DF", "ECDE:ID_RP",
            "Enes-CDE-C", "compte", "rules"
        ]);

        // Vérif + log toutes les 1 min
        setInterval(() => {
            runChecks();
            logToPPDS();
        }, 60 * 1000);
    }

    async function fetchKey(url, keyName) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            return data?.[keyName] || null;
        } catch {
            return null;
        }
    }

    // --- AES
    function encrypt(data) {
        if (!SECRET_KEY) return null;
        const encoded = new TextEncoder().encode(JSON.stringify(data));
        const key = CryptoJS.SHA256(SECRET_KEY).toString();
        return CryptoJS.AES.encrypt(JSON.stringify(Array.from(encoded)), key).toString();
    }
    function decrypt(cipher) {
        try {
            const key = CryptoJS.SHA256(SECRET_KEY).toString();
            const bytes = CryptoJS.AES.decrypt(cipher, key);
            const arr = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return JSON.parse(new TextDecoder().decode(new Uint8Array(arr)));
        } catch {
            return null;
        }
    }

    function isEncrypted(value) {
        return typeof value === "string" && value.startsWith("U2FsdGVkX1");
    }

    // --- Sécuriser données existantes
    function secureExistingData(keys) {
        keys.forEach(k => {
            const value = localStorage.getItem(k);
            if (value && !isEncrypted(value)) {
                localStorage.setItem(k, encrypt(value)); // Chiffre
                localStorage.setItem(`_plain_${k}`, value); // Garde copie temporaire
                console.log(`🔐 [DCP-Ext] Clé ${k} sécurisée`);
            }
        });
    }

    // --- Vérifications
    function runChecks() {
        checkIDs();
        checkRules();
        checkSession();
    }

    function checkIDs() {
        const ids = ["ECDE:ID", "ECDE:ID_IP", "ECDE:ID_DF", "ECDE:ID_RP"];
        ids.forEach(id => {
            if (!localStorage.getItem(id)) {
                console.warn(`⚠️ [DCP-Ext] ID manquant: ${id}`);
            }
        });
    }

    function checkRules() {
        const rules = decrypt(localStorage.getItem("rules")) || localStorage.getItem("_plain_rules");
        if (rules !== "true") {
            console.warn("⚠️ [DCP-Ext] Règles non acceptées");
        }
    }

    function checkSession() {
        const session = decrypt(localStorage.getItem("Enes-CDE-C")) || JSON.parse(localStorage.getItem("_plain_Enes-CDE-C") || "null");
        if (session?.expiry && new Date(session.expiry) < new Date()) {
            console.warn("⚠️ [DCP-Ext] Session expirée");
            localStorage.removeItem("Enes-CDE-C");
            localStorage.removeItem("compte");
        }
    }

    // --- Log vers PPDS
    async function logToPPDS() {
        if (!GITHUB_TOKEN) return;

        const payload = {
            timestamp: new Date().toISOString(),
            ids: {
                id: localStorage.getItem("ECDE:ID"),
                ip: localStorage.getItem("ECDE:ID_IP"),
                device: localStorage.getItem("ECDE:ID_DF"),
                rp: localStorage.getItem("ECDE:ID_RP")
            },
            rules: localStorage.getItem("rules"),
            session: localStorage.getItem("Enes-CDE-C")
        };

        const content = btoa(JSON.stringify(payload, null, 2));

        try {
            await fetch(PPDS_LOG_URL, {
                method: "PUT",
                headers: {
                    "Authorization": `token ${GITHUB_TOKEN}`,
                    "Accept": "application/vnd.github.v3+json"
                },
                body: JSON.stringify({
                    message: `[DCP-Ext] Log ${payload.timestamp}`,
                    content
                })
            });
            console.log("📤 [DCP-Ext] Log envoyé à PPDS");
        } catch (err) {
            console.error("❌ [DCP-Ext] Échec log PPDS", err);
        }
    }

    return { init };
})();

document.addEventListener("DOMContentLoaded", DCP_EXT.init);
