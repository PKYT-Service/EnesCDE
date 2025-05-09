// Configuration GitHub API
const OWNER = "PKYT-Service";
const REPO = "database_dev";
const BRANCH = "main";
const BASE_PATH = "NEW*DRIVE/TheHorrorFBD";
let TOKEN = null;

// DOM Elements
const foldersUl = document.getElementById("folders-ul");
const foldersInsideUl = document.getElementById("folders-ul-inside");
const filesUl = document.getElementById("files-ul");
const currentFolderName = document.getElementById("current-folder-name");
const btnBackFolder = document.getElementById("btn-back-folder");
const fileViewSection = document.getElementById("file-view-section");
const fileViewTitle = document.getElementById("file-view-title");
const fileRenderedContent = document.getElementById("file-rendered-content");
const btnCloseView = document.getElementById("btn-close-view");
const btnShare = document.getElementById("btn-share");

// State
let folders = [];
let filesByFolder = {};
let foldersByFolder = {};
let currentFolder = null; // null means root
let currentFile = null;
let historyStack = [];

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
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${BASE_PATH}?ref=${BRANCH}`;
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

// Load folder content recursively (any depth)
async function loadFolderContent(path) {
  try {
    const content = await githubApi(path);
    const folders = content.filter(item => item.type === "dir").map(d => d.name);
    const files = content.filter(item => item.type === "file" && item.name.toLowerCase().endsWith(".md"));
    return { folders, files };
  } catch (e) {
    alert("Erreur lors du chargement du dossier : " + e.message);
    return { folders: [], files: [] };
  }
}

// Load root folder content and organize files/folders
async function loadRoot() {
  currentFolder = null;
  historyStack = [];
  currentFolderName.textContent = "Racine / Non trié";
  btnBackFolder.disabled = true;
  filesUl.innerHTML = "";
  foldersUl.innerHTML = "";
  foldersInsideUl.innerHTML = "";
  folders = [];
  filesByFolder = {};
  foldersByFolder = {};

  try {
    const rootContent = await githubApi(BASE_PATH);
    const rootFolders = rootContent.filter(item => item.type === "dir").map(d => d.name);
    const rootFiles = rootContent.filter(item => item.type === "file" && item.name.toLowerCase().endsWith(".md"));

    folders = rootFolders;
    folders.unshift("Non trier");

    filesByFolder["Non trier"] = rootFiles;

    // Load subfolders and files for each root folder
    for (const folderName of rootFolders) {
      const { folders: subfolders, files } = await loadFolderContent(`${BASE_PATH}/${folderName}`);
      foldersByFolder[folderName] = subfolders;
      filesByFolder[folderName] = files;
    }

    renderFolders();
    renderFoldersInside(null);
    renderFiles("Non trier");
  } catch (e) {
    alert("Erreur lors du chargement des fichiers : " + e.message);
  }
}

// Reload current folder content (files and folders)
async function reloadCurrentFolder() {
  if (currentFolder === null) {
    await loadRoot();
  } else {
    try {
      const { folders: subfolders, files } = await loadFolderContent(`${BASE_PATH}/${currentFolder}`);
      foldersByFolder[currentFolder] = subfolders;
      filesByFolder[currentFolder] = files;
      renderFoldersInside(currentFolder);
      renderFiles(currentFolder);
    } catch (e) {
      alert("Erreur lors du rechargement des fichiers : " + e.message);
    }
  }
}

// Render folders list (root folders)
function renderFolders() {
  foldersUl.innerHTML = "";
  folders.forEach(folder => {
    const li = document.createElement("li");
    li.className = "cursor-pointer hover:bg-blue-100 px-4 py-3 flex items-center gap-3 select-none";
    li.setAttribute("tabindex", "0");
    li.setAttribute("role", "button");
    li.setAttribute("aria-pressed", "false");
    li.textContent = folder;
    li.addEventListener("click", () => {
      openFolder(folder === "Non trier" ? null : folder);
    });
    li.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFolder(folder === "Non trier" ? null : folder);
      }
    });
    foldersUl.appendChild(li);
  });
}

// Render folders inside current folder (subfolders)
function renderFoldersInside(folder) {
  foldersInsideUl.innerHTML = "";
  let subfolders = [];
  if (folder === null) {
    subfolders = folders.filter(f => f !== "Non trier");
  } else {
    subfolders = foldersByFolder[folder] || [];
  }
  if (subfolders.length === 0) {
    const li = document.createElement("li");
    li.className = "text-gray-500 italic p-4";
    li.textContent = "Aucun dossier dans ce dossier.";
    foldersInsideUl.appendChild(li);
    return;
  }
  subfolders.forEach(subfolder => {
    const li = document.createElement("li");
    li.className = "cursor-pointer hover:bg-blue-100 px-4 py-3 flex items-center gap-3 select-none";
    li.setAttribute("tabindex", "0");
    li.setAttribute("role", "button");
    li.setAttribute("aria-pressed", "false");

    const icon = document.createElement("i");
    icon.className = "fas fa-folder text-yellow-500";
    li.appendChild(icon);

    const span = document.createElement("span");
    span.textContent = subfolder;
    li.appendChild(span);

    li.addEventListener("click", () => {
      openFolder(folder === null ? subfolder : `${folder}/${subfolder}`);
    });
    li.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFolder(folder === null ? subfolder : `${folder}/${subfolder}`);
      }
    });

    foldersInsideUl.appendChild(li);
  });
}

// Render files list for a folder
function renderFiles(folder) {
  currentFolder = folder;
  currentFolderName.textContent = folder === null ? "Non trié" : folder;
  filesUl.innerHTML = "";
  btnBackFolder.disabled = historyStack.length === 0;

  let files;
  if (folder === null) {
    files = filesByFolder["Non trier"] || [];
  } else {
    files = filesByFolder[folder] || [];
  }
  if (files.length === 0) {
    const li = document.createElement("li");
    li.className = "text-gray-500 italic p-4";
    li.textContent = "Aucun fichier Markdown dans ce dossier.";
    filesUl.appendChild(li);
    return;
  }

  files.forEach(file => {
    const li = document.createElement("li");
    li.className = "cursor-pointer hover:bg-gray-100 rounded p-2 flex items-center gap-3 select-none";
    li.setAttribute("tabindex", "0");
    li.setAttribute("role", "button");
    li.setAttribute("aria-pressed", "false");

    const icon = document.createElement("i");
    icon.className = "fas fa-file-alt text-gray-600";
    li.appendChild(icon);

    const span = document.createElement("span");
    span.textContent = file.name;
    li.appendChild(span);

    li.addEventListener("click", () => {
      openFile(folder, file);
    });
    li.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFile(folder, file);
      }
    });

    filesUl.appendChild(li);
  });
}

// Custom markdown rendering with specified replacements
function customMarkdownRender(md) {
  const escapeHtml = text =>
    text.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const lines = md.split(/\r?\n/);

  let html = "";
  let inCodeBlock = false;
  let codeBlockLang = "";
  let inList = false;
  let listType = null;
  let listBuffer = [];
  let inBlockquote = false;
  let blockquoteBuffer = [];

  function flushList() {
    if (!inList) return;
    const tag = listType;
    html += `<${tag} class="pl-6 mb-4 list-${tag === "ul" ? "disc" : "decimal"}">`;
    listBuffer.forEach(item => {
      html += `<li>${item}</li>`;
    });
    html += `</${tag}>`;
    listBuffer = [];
    inList = false;
    listType = null;
  }

  function flushBlockquote() {
    if (!inBlockquote) return;
    html += `<blockquote class="border-l-4 border-gray-400 pl-4 italic mb-4">`;
    html += blockquoteBuffer.join("<br>");
    html += `</blockquote>`;
    blockquoteBuffer = [];
    inBlockquote = false;
  }

  function inlineReplacements(text) {
    text = escapeHtml(text);
    text = text.replace(/`([^`\n]+)`/g, '<code class="bg-gray-100 rounded px-1 font-mono text-sm">$1</code>');
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong class="font-bold">$1</strong>');
    text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em class="italic">$1</em>');
    text = text.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '<em class="italic">$1</em>');
    text = text.replace(/::(.*?)::/g, '<mark class="bg-yellow-200">$1</mark>');
    text = text.replace(/\$(.+?)\$/g, '<span class="font-mono bg-gray-200 px-1 rounded">$1</span>');
    text = text.replace(/\[\^([^\]]+)\]/g, '<sup id="footnote-$1" class="text-xs align-super">$1</sup>');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">$1</a>');
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full my-2 rounded shadow-md"/>');
    text = text.replace(/^---$/gm, '<hr class="my-4 border-gray-300"/>');
    text = text.replace(/^### (.*)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
    text = text.replace(/^## (.*)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>');
    text = text.replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');
    text = text.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-400 pl-4 italic text-gray-700">$1</blockquote>');
    text = text.replace(/^\d+\.\s(.+)$/gm, '<li class="ml-4">$1</li>');
    text = text.replace(/(<li class="ml-4">.*<\/li>)/g, '<ol class="list-decimal ml-6">$1</ol>');
    text = text.replace(/^[-*]\s(.+)$/gm, '<li class="ml-4">$1</li>');
    text = text.replace(/(<li class="ml-4">.*<\/li>)/g, '<ul class="list-disc ml-6">$1</ul>');
    text = text.replace(/\[\{(.+?)\}\]/g, '<a class="inline-block text-white bg-blue-500 hover:bg-blue-600 font-semibold text-sm px-3 py-1 rounded-full shadow transition duration-150">$1</a>');
    return text;
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (/^```/.test(line)) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
        html += `<pre class="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto"><code>`;
      } else {
        inCodeBlock = false;
        html += `</code></pre>`;
      }
      continue;
    }
    if (inCodeBlock) {
      html += escapeHtml(line) + "\n";
      continue;
    }
    let headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      flushList();
      flushBlockquote();
      const level = headerMatch[1].length;
      const content = inlineReplacements(headerMatch[2].trim());
      html += `<h${level} class="font-semibold mt-6 mb-2 text-gray-900">${content}</h${level}>`;
      continue;
    }
    if (/^\s*>/.test(line)) {
      flushList();
      const content = line.replace(/^\s*> ?/, "");
      inBlockquote = true;
      blockquoteBuffer.push(inlineReplacements(content));
      if (i + 1 >= lines.length || !/^\s*>/.test(lines[i + 1])) {
        flushBlockquote();
      }
      continue;
    } else {
      flushBlockquote();
    }
    let ulMatch = line.match(/^\s*([-*+])\s+(.*)$/);
    if (ulMatch) {
      const content = inlineReplacements(ulMatch[2].trim());
      if (!inList) {
        inList = true;
        listType = "ul";
        listBuffer.push(content);
      } else if (listType === "ul") {
        listBuffer.push(content);
      } else {
        flushList();
        inList = true;
        listType = "ul";
        listBuffer.push(content);
      }
      if (i + 1 >= lines.length || !/^\s*([-*+])\s+/.test(lines[i + 1])) {
        flushList();
      }
      continue;
    }
    let olMatch = line.match(/^\s*(\d+)\.\s+(.*)$/);
    if (olMatch) {
      const content = inlineReplacements(olMatch[2].trim());
      if (!inList) {
        inList = true;
        listType = "ol";
        listBuffer.push(content);
      } else if (listType === "ol") {
        listBuffer.push(content);
      } else {
        flushList();
        inList = true;
        listType = "ol";
        listBuffer.push(content);
      }
      if (i + 1 >= lines.length || !/^\s*\d+\.\s+/.test(lines[i + 1])) {
        flushList();
      }
      continue;
    }
    flushList();
    if (/^(\*\s*){3,}$/.test(line) || /^(-\s*){3,}$/.test(line) || /^(_\s*){3,}$/.test(line)) {
      html += `<hr class="my-6 border-gray-300">`;
      continue;
    }
    if (/^\$\$/.test(line)) {
      flushList();
      let mathBlock = [];
      if (/^\$\$(.*)\$\$$/.test(line)) {
        const content = line.replace(/^\$\$(.*)\$\$$/, "$1");
        html += `<div class="math-block my-4 p-2 bg-gray-100 rounded font-mono whitespace-pre-wrap">${escapeHtml(content)}</div>`;
        continue;
      }
      i++;
      while (i < lines.length && !/^\$\$/.test(lines[i])) {
        mathBlock.push(lines[i]);
        i++;
      }
      const content = mathBlock.join("\n");
      html += `<div class="math-block my-4 p-2 bg-gray-100 rounded font-mono whitespace-pre-wrap">${escapeHtml(content)}</div>`;
      continue;
    }
    if (/^\s*$/.test(line)) {
      html += `<br>`;
      continue;
    }
    const inline = inlineReplacements(line.trim());
    html += `<p class="mb-2 leading-relaxed text-gray-800">${inline}</p>`;
  }
  return html;
}

function renderMarkdown(md) {
  fileRenderedContent.innerHTML = customMarkdownRender(md);
}

// Open folder (push current folder to history)
async function openFolder(folder) {
  if (currentFolder !== null && currentFolder !== folder) {
    historyStack.push(currentFolder);
  }
  currentFolder = folder;
  currentFolderName.textContent = folder === null ? "Non trié" : folder;
  btnBackFolder.disabled = historyStack.length === 0;
  fileViewSection.classList.add("hidden");
  currentFile = null;

  if (folder === null) {
    await loadRoot();
  } else {
    try {
      const { folders: subfolders, files } = await loadFolderContent(`${BASE_PATH}/${folder}`);
      foldersByFolder[folder] = subfolders;
      filesByFolder[folder] = files;
    } catch (e) {
      alert("Erreur lors du chargement du dossier : " + e.message);
      return;
    }
  }
  renderFoldersInside(folder);
  renderFiles(folder);
  updateHash("", "");
}

// Back folder
btnBackFolder.addEventListener("click", () => {
  if (historyStack.length > 0) {
    const previousFolder = historyStack.pop();
    openFolder(previousFolder);
  }
});

// Open file: fetch content via GitHub API and show viewer (rendered)
async function openFile(folder, file) {
  try {
    let path;
    if (folder === null) {
      path = `${BASE_PATH}/${file.name}`;
    } else {
      path = `${BASE_PATH}/${folder}/${file.name}`;
    }
    if (!TOKEN) throw new Error("Token GitHub non chargé");
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${BASE_PATH}?ref=${BRANCH}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `token ${TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!res.ok) throw new Error("Impossible de charger le fichier");
    const json = await res.json();
    if (!json.content) throw new Error("Contenu du fichier introuvable");
    const decodedContent = atob(json.content.replace(/\n/g, ''));
    currentFile = { folder, file };
    fileViewTitle.textContent = file.name;
    renderMarkdown(decodedContent);
    fileViewSection.classList.remove("hidden");
    fileRenderedContent.focus();
    updateHash(folder === null ? "Non trier" : folder, file.name);
  } catch (e) {
    alert("Erreur lors de l'ouverture du fichier : " + e.message);
  }
}

// Update URL hash for sharing
function updateHash(folder, filename) {
  if (!folder || !filename) {
    history.replaceState(null, "", location.pathname + location.search);
    return;
  }
  const safeFolder = encodeURIComponent(folder);
  const safeFile = encodeURIComponent(filename);
  history.replaceState(null, "", `#${safeFolder}-${safeFile}`);
}

// Parse URL hash to open file if present
async function openFileFromHash() {
  if (!location.hash) return;
  const hash = location.hash.substring(1);
  const sepIndex = hash.indexOf("-");
  if (sepIndex === -1) return;
  const folder = decodeURIComponent(hash.substring(0, sepIndex));
  const filename = decodeURIComponent(hash.substring(sepIndex + 1));
  let folderKey = folder === "Non trier" ? null : folder;
  if (folderKey !== null && !folders.includes(folderKey) && !Object.keys(foldersByFolder).some(k => folderKey.startsWith(k))) return;
  const files = filesByFolder[folderKey === null ? "Non trier" : folderKey] || [];
  const file = files.find(f => f.name === filename);
  if (!file) return;
  await openFolder(folderKey);
  openFile(folderKey, file);
}

btnCloseView.addEventListener("click", () => {
  fileViewSection.classList.add("hidden");
  currentFile = null;
  updateHash("", "");
});

btnShare.addEventListener("click", () => {
  if (!currentFile) return;
  const url = location.href;
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert("URL de partage copiée dans le presse-papiers !");
    })
    .catch(() => {
      alert("Impossible de copier l'URL dans le presse-papiers.");
    });
});

// On load
window.addEventListener("load", async () => {
  await loadToken();
  if (!TOKEN) return;
  await loadRoot();
  await openFileFromHash();
});

// Listen hash change to open file
window.addEventListener("hashchange", () => {
  openFileFromHash();
});
