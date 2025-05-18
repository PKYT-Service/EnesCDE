
// UTF-8 compatibility is ensured by <meta charset="UTF-8"> and proper encoding/decoding in JS

    //let BASE_PATH = null;

    
    // ECDE Config
let drive = localStorage.getItem("repo/"); // exemple: "mon-drive"

let BASE_PATH = "";

if (!drive || drive.trim() === "") {
  console.warn("Aucun drive specifie, utilisation du dossier racine.");
  BASE_PATH = "NEW*DRIVE/"; // dossier racine par defaut
} else {
  BASE_PATH = `NEW*DRIVE/${drive}/`;
}

console.log(BASE_PATH);

    // Configuration GitHub API
    const OWNER = "PKYT-Service";
    const REPO = "database_dev";
    const BRANCH = "main";
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
    const driveAdmDiv = document.getElementById("drive/adm");

    // State
    let folders = [];
    let filesByFolder = {};
    let foldersByFolder = {};
    let currentFolder = null; // null means root
    let currentFile = null;
    let historyStack = [];
    let isEditing = false;

    // Helper to check if editing is allowed (buttons present and drive/adm div exists and has "adm" in id)
    function isEditingAllowed() {
      return (
        btnToggleView &&
        btnSave &&
        driveAdmDiv &&
        driveAdmDiv.id.includes("adm")
      );
    }

    // Load token from external JSON
    async function loadToken() {
      try {
        const res = await fetch(
          "https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js",
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Impossible de charger le token");
        const json = await res.json();
        if (!json.GITHUB_TOKEN)
          throw new Error("Token GitHub manquant dans le fichier");
        TOKEN = json.GITHUB_TOKEN;
      } catch (e) {
        alert("Erreur lors du chargement du token : " + e.message);
      }
    }

    // Helper: GitHub API call with auth
    async function githubApi(path) {
      if (!TOKEN) throw new Error("Token GitHub non chargé");
      const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(
        path
      )}?ref=${BRANCH}`;
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

    // Create folder (GitHub API: create empty .gitkeep file inside new folder)
    async function createFolder(folderName) {
      if (!folderName) return;
      let path;
      if (currentFolder === null) {
        path = `${BASE_PATH}/${folderName}/.gitkeep`;
      } else {
        path = `${BASE_PATH}/${currentFolder}/${folderName}/.gitkeep`;
      }
      try {
        const contentEncoded = btoa("");
        const commitMessage = `Création du dossier ${folderName} via Explorateur MD`;
        const putRes = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(
            path
          )}`,
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
        openFolder(currentFolder === null ? folderName : currentFolder + "/" + folderName);
      } catch (e) {
        alert("Erreur lors de la création du dossier : " + e.message);
      }
    }

    // Create file (empty .md file with default content)
    async function createFile(folder, filename) {
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
        const dateStr = new Date().toISOString().split("T")[0];
        const defaultContent = `\` :: Votre Texte ICI :: \`  \n\n\n\` **Date :** ${dateStr} \`  \n\` **RAPPEL :** \n :: Ne pas supprimer cette ligne ! :: \``;
        const contentEncoded = btoa(unescape(encodeURIComponent(defaultContent)));
        const commitMessage = `Création du fichier ${filename} dans ${
          folder === null ? "racine" : folder
        } via Explorateur MD`;
        const putRes = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(
            path
          )}`,
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

    // Load folder content recursively and organize files/folders
    async function loadFolderRecursive(pathKey) {
      let path = BASE_PATH;
      if (pathKey !== null) {
        path += "/" + pathKey;
      }
      try {
        const content = await githubApi(path);
        const foldersInThis = content.filter((i) => i.type === "dir").map((d) => d.name);
        const filesInThis = content.filter(
          (i) => i.type === "file" && i.name.toLowerCase().endsWith(".md")
        );

        filesByFolder[pathKey === null ? "Non trier" : pathKey] = filesInThis;
        foldersByFolder[pathKey === null ? "root" : pathKey] = foldersInThis;

        if (pathKey === null) {
          folders = foldersInThis.slice();
          folders.unshift("Non trier");
        }

        for (const folderName of foldersInThis) {
          const subPathKey = pathKey === null ? folderName : pathKey + "/" + folderName;
          await loadFolderRecursive(subPathKey);
        }
      } catch (e) {
        alert("Erreur lors du chargement du dossier " + (pathKey || "racine") + " : " + e.message);
      }
    }

    // Load root and all subfolders recursively
    async function loadRoot() {
      currentFolder = null;
      historyStack = [];
      if (currentFolderName) currentFolderName.textContent = "Racine / Non trié";
      if (btnBackFolder) btnBackFolder.disabled = true;
      if (filesUl) filesUl.innerHTML = "";
      if (foldersUl) foldersUl.innerHTML = "";
      if (foldersInsideUl) foldersInsideUl.innerHTML = "";
      folders = [];
      filesByFolder = {};
      foldersByFolder = {};

      await loadFolderRecursive(null);

      renderFolders();
      renderFoldersInside(null);
      renderFiles("Non trier");
    }

    // Reload current folder content (files and folders)
    async function reloadCurrentFolder() {
      if (currentFolder === null) {
        await loadRoot();
      } else {
        const keysToRemove = Object.keys(filesByFolder).filter(
          (k) => k === currentFolder || k.startsWith(currentFolder + "/")
        );
        keysToRemove.forEach((k) => {
          delete filesByFolder[k];
          delete foldersByFolder[k];
        });
        await loadFolderRecursive(currentFolder);
        renderFoldersInside(currentFolder);
        renderFiles(currentFolder);
      }
    }

    // Render folders list (root folders)
    function renderFolders() {
      if (!foldersUl) return;
      foldersUl.innerHTML = "";
      folders.forEach((folder) => {
        const li = document.createElement("li");
        li.className =
          "cursor-pointer hover:bg-blue-100 px-4 py-3 flex items-center gap-3 select-none";
        li.setAttribute("tabindex", "0");
        li.setAttribute("role", "button");
        li.setAttribute("aria-pressed", "false");
        li.textContent = folder;
        li.addEventListener("click", () => {
          openFolder(folder === "Non trier" ? null : folder);
        });
        li.addEventListener("keydown", (e) => {
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
      if (!foldersInsideUl) return;
      foldersInsideUl.innerHTML = "";
      let subfolders = [];
      if (folder === null) {
        subfolders = folders.filter((f) => f !== "Non trier");
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
      subfolders.forEach((subfolder) => {
        const li = document.createElement("li");
        li.className =
          "cursor-pointer hover:bg-blue-100 px-4 py-3 flex items-center gap-3 select-none";
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
          let newFolderPath;
          if (folder === null) {
            newFolderPath = subfolder;
          } else {
            newFolderPath = folder + "/" + subfolder;
          }
          openFolder(newFolderPath);
        });
        li.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            let newFolderPath;
            if (folder === null) {
              newFolderPath = subfolder;
            } else {
              newFolderPath = folder + "/" + subfolder;
            }
            openFolder(newFolderPath);
          }
        });

        foldersInsideUl.appendChild(li);
      });
    }

    // Render files list for a folder
    function renderFiles(folder) {
      currentFolder = folder;
      if (currentFolderName) currentFolderName.textContent = folder === null ? "Non trier" : folder;
      if (filesUl) filesUl.innerHTML = "";
      if (btnBackFolder) btnBackFolder.disabled = historyStack.length === 0;

      // Enable create file only if editing allowed and folder is not null
      if (btnCreateFile) {
        btnCreateFile.disabled = !isEditingAllowed() || folder === null;
      }
      if (btnCreateFolder) {
        btnCreateFolder.disabled = !isEditingAllowed();
      }
      if (btnImport) {
        btnImport.disabled = !isEditingAllowed();
      }

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

      files.forEach((file) => {
        const li = document.createElement("li");
        li.className =
          "cursor-pointer hover:bg-gray-100 rounded p-2 flex items-center gap-3 select-none";
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
        li.addEventListener("keydown", (e) => {
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
      const escapeHtml = (text) =>
        text
          .replace(/&/g, "&amp;")
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
        listBuffer.forEach((item) => {
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

        text = text.replace(
          /\[\{(.+?)\}\]/g,
          '<a class="inline-block text-white bg-blue-500 hover:bg-blue-600 font-semibold text-sm px-3 py-1 rounded-full shadow transition duration-150">$1</a>'
        );

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

     
