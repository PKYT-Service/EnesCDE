export async function WebManager() {
  const apiUrl = "https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/ecde/data/ListeAFF.json";
  const tokenUrl = "https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js";

  // 1. Récupérer le token
  let githubToken;
  try {
    const tokenData = await (await fetch(tokenUrl)).json();
    githubToken = tokenData.GITHUB_TOKEN;
  } catch (e) {
    console.error("Erreur token :", e);
    return;
  }

  // 2. Récupérer le JSON
  let data;
  try {
    const res = await fetch(apiUrl, {
      headers: { Authorization: `token ${githubToken}` }
    });
    const content = await res.json();
    data = JSON.parse(atob(content.content));
  } catch (e) {
    console.error("Erreur JSON GitHub :", e);
    return;
  }

  const currentHost = window.location.host;

  // 3. Si autorisé → on sort
  if (data.Autoriser.includes(currentHost)) {
    console.log("Autorisé, aucune vérification.");
    return;
  }

  // 4. Vérifie s'il est dans Sites[]
  let matched = data.Sites.find(site => site.URL === currentHost);

  // 5. Sinon → fallback sur "All"
  const rules = matched || data.All;
  const isSite = !!matched;

  // 6. Vérifications
  checkAndAct(rules.BlackListe, "BlackListe", isSite);
  checkAndAct(rules.Maintenance, "Maintenance", isSite);
  checkAndAct(rules.Rappel, "Rappel", isSite);
  checkRedirect(rules.Redirection, isSite);
}

// ---------------------------------------

function checkAndAct(obj, type, isSite) {
  if (!obj || !obj.Statut) return;

  const today = new Date();
  const finDate = new Date(obj.Fin || "9999-12-31");

  if (today <= finDate) {
    showPopup(type, obj, isSite);
  }
}

function checkRedirect(redir, isSite) {
  if (!redir || !redir.Statut) return;

  const today = new Date();
  const fin = redir.Fin || "";
  const finDate = !isNaN(new Date(fin).getTime()) ? new Date(fin) : null;

  if (!finDate || today <= finDate) {
    showRedirectPopup(redir, () => {
      window.location.href = redir.Url;
    }, isSite);
  }
}

// -------------------- POPUPS ------------------------

function showPopup(type, data, isSite) {
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.85)", color: "#fff",
    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
    zIndex: "9999", fontFamily: "Poppins, sans-serif", textAlign: "center"
  });

  overlay.innerHTML = `
    <div style="font-size: 30px; font-weight: bold; margin-bottom: 15px;">
      ${isSite ? "⚠️ " : "🌐 "} ${type} activé
    </div>
    <div style="font-size: 20px;">Raison : <strong>${data.Raison || "Non précisée"}</strong></div>
    <div style="margin-top: 10px;">Par : ${data.Par || "???"}</div>
    <div>Date : ${data.Date || "???"} → ${data.Fin || "∞"}</div>
  `;

  document.body.appendChild(overlay);
}

function showRedirectPopup(data, callback, isSite) {
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.9)", color: "#fff",
    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
    zIndex: "9999", fontFamily: "Poppins, sans-serif", textAlign: "center"
  });

  overlay.innerHTML = `
    <div style="font-size: 26px; font-weight: bold; margin-bottom: 10px;">
      ${isSite ? "🔀 Redirection site" : "🔁 Redirection globale"}
    </div>
    <div>Motif : <strong>${data.Raison || "Aucun"}</strong></div>
    <div>Par : <strong>${data.Par || "???"}</strong></div>
    <div>Du <strong>${data.Date || "???"}</strong> jusqu'à <strong>${data.Fin || "illimité"}</strong></div>
    <div style="margin-top: 20px;">Redirection en cours...</div>
  `;

  document.body.appendChild(overlay);
  setTimeout(callback, 3500);
}
