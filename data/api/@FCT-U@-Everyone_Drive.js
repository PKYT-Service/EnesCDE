// ECDE Config
// Trouver la div dont l'id commence par "repo/"
const repoDiv = document.querySelector('[id^="repo/"]');

if (repoDiv) {
  const drive = repoDiv.id.split("/")[1]; // extrait la partie après "repo/"

  if (!drive) {
    console.error("Erreur : Aucun drive spécifié. Accès privé.");
    // Redirection vers la page d'erreur 403
    window.location.href = "https://enes-cde.vercel.app/pages/403.html";
  } else {
    const BASE_PATH = `NEW*DRIVE/${drive}`;
    console.log(BASE_PATH); // Affiche le chemin généré
  }
} else {
  console.warn("Aucune div avec un id commencant par 'repo/' n'a été trouvée.");
}

// Configuration GitHub API
const OWNER = "PKYT-Service";
const REPO = "database_dev";
const BRANCH = "main";
// const BASE_PATH = "NEW*DRIVE";
let TOKEN = null;

// DOM Elements
const foldersUl = document.getElementById("folders-ul");
const foldersInsideUl = document.getElementById("folders-ul-inside");
const filesUl = document.getElementById("files-ul");
const currentFolderName = document.getElementById("current-folder-name");
const btnBackFolder = document.getElementById("btn-back-folder");
const fileViewSection = document.getElementById("file-view-section");
const fileViewTitle = document.getElementById("file-view-title");
const fileContent = document.getElementById("file-content");
const fileRenderedContent = document.getElementById("file-rendered-content");
const btnSave = document.getElementById("btn-save");
const btnCloseView = document.getElementById("btn-close-view");
const btnShare = document.getElementById("btn-share");
const btnImport = document.getElementById("btn-import");
const fileInput = document.getElementById("file-input");
const btnToggleView = document.getElementById("btn-toggle-view");
const btnCreateFolder = document.getElementById("btn-create-folder");
const btnCreateFile = document.getElementById("btn-create-file");

// State
let folders = [];
let filesByFolder = {};
let foldersByFolder = {};
let currentFolder = null; // null means root
let currentFile = null;
let historyStack = [];
let isEditing = false;
const isClient = true; // Flag to check if user is a "client"

// Load token from external JSON
async function loadToken() {
  try {
    const res = await fetch("https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js", {cache: "no-store"});
    if (!res.ok) throw new Error("Impossible de charger le token");
    const json = await res.json();
    if (!json.GITHUB_TOKEN) throw new Error("Token GitHub manquant dans le fichier");
    TOKEN = json.GITHUB_TOKEN;
  } catch (e) {
    alert("Erreur lors du chargement du token : " + e.message);
  }
}

// Helper: GitHub API call with auth
async function githubApi(path) {
  if (!TOKEN) throw new Error("Token GitHub non chargé");
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Function to disable client-specific features
function disableClientFeatures() {
  if (isClient) {
    btnCreateFolder.disabled = true;
    btnCreateFile.disabled = true;
    btnImport.disabled = true;
    btnSave.disabled = true;
  }
}

// Create folder (GitHub API: create empty .gitkeep file inside new folder)
async function createFolder(folderName) {
  if (isClient) return; // Prevent folder creation for clients
  if (!folderName) return;
  const path = currentFolder === null ? `${BASE_PATH}/${folderName}/.gitkeep` : `${BASE_PATH}/${currentFolder}/${folderName}/.gitkeep`;
  try {
    const contentEncoded = btoa("");
    const commitMessage = `Création du dossier ${folderName} via Explorateur MD`;
    const putRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: commitMessage,
          content: contentEncoded,
          branch: BRANCH,
        }),
      }
    );
    if (!putRes.ok) {
      const err = await putRes.json();
      throw new Error(err.message || "Erreur lors de la création du dossier");
    }
    alert(`Dossier "${folderName}" créé avec succès.`);
    await reloadCurrentFolder();
    openFolder(folderName);
  } catch (e) {
    alert("Erreur lors de la création du dossier : " + e.message);
  }
}

// Create file (empty .md file with default content)
async function createFile(folder, filename) {
  if (isClient) return; // Prevent file creation for clients
  if (!filename) return;
  if (!filename.toLowerCase().endsWith(".md")) {
    alert("Le fichier doit avoir une extension .md");
    return;
  }
  let path;
  if (folder === null) {
    path = `${BASE_PATH}/${filename}`;
  } else {
    path = `${BASE_PATH}/${folder}/${filename}`;
  }
  try {
    const dateStr = new Date().toISOString().split('T')[0];
    const defaultContent = `\` :: Votre Texte ICI :: \`  \n\n\n\` **Date :** ${dateStr} \`  \n\` **RAPPEL :** \n :: Ne pas supprimer cette ligne ! :: \``;
    const contentEncoded = btoa(unescape(encodeURIComponent(defaultContent)));
    const commitMessage = `Création du fichier ${filename} dans ${folder === null ? "racine" : folder} via Explorateur MD`;
    const putRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: commitMessage,
          content: contentEncoded,
          branch: BRANCH,
        }),
      }
    );
    if (!putRes.ok) {
      const err = await putRes.json();
      throw new Error(err.message || "Erreur lors de la création du fichier");
    }
    alert(`Fichier "${filename}" créé avec succès dans "${folder === null ? "racine" : folder}".`);
    await refreshFolderFiles(folder);
    openFile(folder, { name: filename });
  } catch (e) {
    alert("Erreur lors de la création du fichier : " + e.message);
  }
}

// Disable creation for clients when loading the page
disableClientFeatures();
