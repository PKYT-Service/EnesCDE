export async function PU_Sync() {
  const tokenUrl = 'https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js';

  // Récupère token depuis URL externe (attention CORS possible)
  const getToken = async () => {
    try {
      const res = await fetch(tokenUrl);
      if (!res.ok) throw new Error('Token fetch failed');
      const data = await res.json();
      return data.GITHUB_TOKEN;
    } catch(e) {
      console.error('Erreur récupération token:', e);
      return null;
    }
  };

  const token = await getToken();
  if (!token) return console.error('❌ Impossible de récupérer token GitHub');

  // Identifiant unique client
  const clientId = localStorage.getItem('ECDE:ID_IP');
  if (!clientId) return console.error('❌ ECDE:ID_IP manquant');

  const repoOwner = 'PKYT-Service';
  const repoName = 'database_EnesCDE';
  const branch = 'main';
  const filePath = `ecde/sync/${clientId}.json`;

  // Exclure certaines clés si besoin
  const excludedKeys = ['AuthToken', 'SensitiveKey', 'AnotherKeyToExclude'];

  // Préparer les données localStorage à envoyer
  const getLocalStorageData = () => {
    const data = {};
    Object.keys(localStorage).forEach(key => {
      if (!excludedKeys.includes(key)) {
        data[key] = localStorage.getItem(key);
      }
    });
    return data;
  };

  // Récupérer fichier existant sur GitHub (content + sha)
  const fetchGitHubFile = async () => {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `token ${token}`
        }
      });
      if (res.status === 404) return {content: null, sha: null}; // Fichier inexistant, ok
      if (!res.ok) throw new Error('Erreur récupération fichier GitHub');
      const json = await res.json();
      const content = JSON.parse(atob(json.content));
      return {content, sha: json.sha};
    } catch (e) {
      console.error('Erreur fetchGitHubFile:', e);
      return {content: null, sha: null};
    }
  };

  // Met à jour localStorage / sessionStorage depuis données distantes
  const applyRemoteData = (remoteData) => {
    if (!remoteData) return;
    Object.entries(remoteData.localStorage || {}).forEach(([k,v]) => {
      if (!excludedKeys.includes(k)) localStorage.setItem(k, v);
    });
    Object.entries(remoteData.sessionStorage || {}).forEach(([k,v]) => {
      sessionStorage.setItem(k, v);
    });
    if (remoteData.cookies) {
      document.cookie = remoteData.cookies;
    }
  };

  // Push les données locales vers GitHub (création ou update)
  const pushToGitHub = async (data, sha=null) => {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    const body = {
      message: `Sync data for client ${clientId}`,
      content: btoa(JSON.stringify(data, null, 2)),
      branch,
    };
    if (sha) body.sha = sha;

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Erreur push GitHub');
      return true;
    } catch (e) {
      console.error('Erreur pushToGitHub:', e);
      return false;
    }
  };

  // Processus principal
  try {
    // 1. Récupérer le fichier distant
    const {content: remoteContent, sha} = await fetchGitHubFile();

    // 2. Appliquer les données distantes dans le navigateur
    if (remoteContent) {
      applyRemoteData(remoteContent);
      console.log('✅ Données distantes appliquées localement');
    }

    // 3. Préparer données locales pour envoyer (avec métadonnées si besoin)
    const localData = {
      localStorage: getLocalStorageData(),
      sessionStorage: {...sessionStorage},
      cookies: document.cookie,
      timestamp: new Date().toISOString(),
      clientId
    };

    // 4. Envoyer vers GitHub (update ou création)
    const success = await pushToGitHub(localData, sha);
    if (success) {
      console.log('✅ Données synchronisées avec GitHub');
    } else {
      console.error('❌ Échec synchronisation GitHub');
    }

  } catch (e) {
    console.error('Erreur synchronisation PU_Sync:', e);
  }
}
