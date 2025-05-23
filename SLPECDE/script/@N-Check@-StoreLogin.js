// @N-Check@-StoreLogin.js
// Stocke les infos de connexion si l'URL contient ?acc=v:4;email:xxx;mdp:yyy;time:true
(function storeLoginFromURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    const accParam = params.get("acc");
    if (!accParam) return;

    const parts = accParam.split(";").reduce((acc, part) => {
      const [key, value] = part.split(":");
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    }, {});

    if (parts.v !== "4" || !parts.email || !parts.mdp || parts.time !== "true") return;

    // Mise en localStorage
    const compteData = {
      email: parts.email,
      password: parts.mdp
    };
    localStorage.setItem("compte", JSON.stringify(compteData));

    const now = new Date();
    const expiry = new Date(now.getTime() + 3 * 60 * 60 * 1000); // +3h
    const cdeData = {
      valid: true,
      expiry: expiry.toISOString()
    };
    localStorage.setItem("Enes-CDE-C", JSON.stringify(cdeData));

    console.log("✅ Login info added to localStorage.");
  } catch (e) {
    console.warn("Erreur pendant le traitement de l'URL pour le login auto :", e);
  }
})();
