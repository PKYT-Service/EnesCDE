(async function UE_CheckSite() {
    // 🔑 Récupération du token dynamique
    const tokenResp = await fetch('https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js');
    const tokenData = await tokenResp.json();
    const token = tokenData.GITHUB_TOKEN;

    // 🔗 Récupération du JSON complet
    const res = await fetch(
        'https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/ecde/data/ListeAFF.json',
        { headers: { Authorization: `token ${token}` } }
    );
    const data = await res.json();
    const raw = atob(data.content); // Base64 → string
    const json = JSON.parse(raw);

    const sites = json.Sites;
    const fullUrl = window.location.href;
    const hostOnly = window.location.host;

    // 🔍 Recherche
    let site = sites.find(s => s.URL === fullUrl || s.URL === hostOnly);

    if (!site) {
        // ✏️ Ajouter l'URL sans protocole dans le JSON local
        const newSite = {
            URL: hostOnly,
            Type: null,
            BlackListe: { Statut: false, Raison: "", Par: "", Date: "", Fin: "" },
            Maintenance: { Statut: false, Raison: "", Par: "", Date: "", Fin: "" },
            Rappel: { Statut: false, Raison: "", Par: "", Date: "", Fin: "" },
            Redirection: { Statut: false, Raison: "", Url: "", Par: "", Date: "", Fin: "" }
        };
        sites.push(newSite);
        site = newSite;
        console.log("Nouvelle URL ajoutée localement:", hostOnly);
    }

    // Ici tu peux ajouter la logique pour afficher overlay si Maintenance / Blacklist / Rappel etc.
})();
