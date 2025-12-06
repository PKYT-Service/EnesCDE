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
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-Check@-V3AccBan.js", "checkBan_Account3V");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-FCT@-ClearCsl.js", "CO_Cleaner_ecde");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-TOOL@-Patcher.js", "Rules");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-TOOL@-Patcher.js", "ADM_RPE");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-TOOL@-Patcher.js", "patch");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@U-FCT@-E.CDE-Sys.js", "pu_ucd_ecde");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@U-ID@-Ban.js", "ecde_client");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@U-ID@-Storage.js", "ID_stock_ecde");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@U-ID@-Verification.js", "ID_verif_ecde");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@W-FCT@WebMng.js", "WebManager");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@W-FCT@WebMngProto.js", "WebManagerProto");
  await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@A-PSP@-enhance.js", "secure_psa");
  
  //await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@A-FCT@-LogsD.js", "LogsDiscord"); // MAJ
  //await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@U-FCT@-SyncData.js", "PU_Sync"); // MAJ
  //await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@N-Check@-RulesIsTrue.js", "CheckRulesToAcces"); // MAJ
  //await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@A-FCT@-Rfh.js", "Secure_Ref"); // MAJ
  //await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@A-FCT@-F12.js", "Secure_F12"); // MAJ
  //await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@A-FCT@-Csl.js", "ECDE_Console"); // MAJ
  //await chargerModule("https://enes-cde.vercel.app/SLPECDE/script/@U-ID@-Log.js", "ID_log_ecde"); // MAJ
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





                        
