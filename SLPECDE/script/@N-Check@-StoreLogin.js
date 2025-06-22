    // ⚠️ Suppression des anciennes données si elles existent
    localStorage.removeItem("compte");
    localStorage.removeItem("Enes-CDE-C");

function storeLoginFromURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    const rawAcc = params.get("acc");
    if (!rawAcc) return;

    const decoded = decodeURIComponent(rawAcc);
    const parts = decoded.split(";").reduce((acc, part) => {
      const [key, value] = part.split(":");
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    }, {});

    if (parts.v !== "4" || !parts.email || !parts.mdp || parts.time !== "true") return;




    // 🔐 Ajout des nouvelles données
    localStorage.setItem("compte", JSON.stringify({
      email: parts.email,
      password: parts.mdp
    }));

    const now = new Date();
    const expiry = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 heures
    localStorage.setItem("Enes-CDE-C", JSON.stringify({
      valid: true,
      expiry: expiry.toISOString()
    }));

    console.log("✅ Données de connexion mises à jour.");
  } catch (e) {
    console.warn("Erreur dans storeLoginFromURL :", e);
  }
}
storeLoginFromURL();
