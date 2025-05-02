// ecde_client.js

export async function ecde_client() {
  const status = (msg) =>
    console.log(`🛡️[E-CDE] | 🔑 clients [ ${msg} ]`);

  // Récupération des IDs depuis le localStorage
  const idList = [
    { type: "ECDE:ID", value: localStorage.getItem("ECDE:ID") },
    { type: "ECDE:ID_IP", value: localStorage.getItem("ECDE:ID_IP") },
    { type: "ECDE:ID_DF", value: localStorage.getItem("ECDE:ID_DF") },
    { type: "ECDE:ID_RP", value: localStorage.getItem("ECDE:ID_RP") }
  ];

  // Vérification s'il y a au moins un ID défini
  const validIds = idList.filter((id) => id.value !== null);
  if (validIds.length === 0) {
    status("ERREUR SCRIPT (Aucun ID trouvé) .");
    return;
  }

  // Charger le token depuis tocken.js distant
  let token;
  try {
    const res = await fetch(
      "https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js"
    );
    const json = await res.json();
    token = json.GITHUB_TOKEN;
  } catch (err) {
    status("ERREUR FETCH / LOAD JSON (token) .");
    return;
  }

  // Télécharger le fichier banECDE
  let data;
  try {
    const res = await fetch(
      "https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/ecde/data/BanECDE:ID.json",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3.raw"
        }
      }
    );
    data = await res.json();
  } catch (err) {
    status("ERREUR FETCH / LOAD JSON (banECDE) .");
    return;
  }

  // Vérifier si un ID correspond dans le fichier
  const currentUrl = window.location.href;
  const match = data.find((entry) =>
    validIds.some((id) => entry.Type === id.type && entry.Valeurs === id.value)
  );

  if (match) {
    const { bloque = {}, Raison } = match;

    if (bloque.All === true) {
      status("CLIENT BLOQUÉ . (Règle: All = true) ");
      alert(`Accès bloqué : ${Raison}\nRedirection...`);
      window.location.href = `https://enes-cde.vercel.app/pages/401.html`;
      return;
    }

    if (
      bloque.web === true &&
      Array.isArray(bloque.web_url) &&
      bloque.web_url.includes(currentUrl)
    ) {
      status("CLIENT BLOQUÉ . (Règle: web + url match) ");
      alert(`Accès bloqué : ${Raison}\nRedirection...`);
      window.location.href = `https://enes-cde.vercel.app/pages/401.html`;
      return;
    }

    status("Client reconnu, mais non bloqué (règle: All = false, web = false/url non match) .");
  } else {
    status("Client safe .");
  }
}
