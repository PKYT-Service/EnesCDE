    // Configuration GitHub API
    const OWNER = "PKYT-Service";
    const REPO = "database_dev";
    const BRANCH = "main";
    const BASE_PATH = "NEW*DRIVE";
    let TOKEN = null;

    // DOM Elements
    const foldersUl = document.getElementById("folders-ul");
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
    let currentFolder = null;
    let currentFile = null;
    let historyStack = [];
    let isEditing = false;

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

    // Create folder (GitHub API: create empty .gitkeep file inside new folder)
    async function createFolder(folderName) {
      if (!folderName) return;
      const path = `${BASE_PATH}/${folderName}/.gitkeep`;
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
        await loadRoot();
        openFolder(folderName);
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
      const path = folder === "Non trier" ? `${BASE_PATH}/${filename}` : `${BASE_PATH}/${folder}/${filename}`;
      try {
        const dateStr = new Date().toISOString().split('T')[0];
        const defaultContent = `**Date :** \`${dateStr}\`  \n**RAPPEL :** \`Ne pas supprimer cette ligne !\``;
        const contentEncoded = btoa(unescape(encodeURIComponent(defaultContent)));
        const commitMessage = `Création du fichier ${filename} dans ${folder} via Explorateur MD`;
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
        alert(`Fichier "${filename}" créé avec succès dans "${folder === "Non trier" ? "racine" : folder}".`);
        await refreshFolderFiles(folder);
        openFile(folder, { name: filename });
      } catch (e) {
        alert("Erreur lors de la création du fichier : " + e.message);
      }
    }

    // Load root folder content and organize files/folders
    async function loadRoot() {
      currentFolder = null;
      historyStack = [];
      currentFolderName.textContent = "Racine / Non trié";
      btnBackFolder.disabled = true;
      btnCreateFile.disabled = true;
      filesUl.innerHTML = "";
      foldersUl.innerHTML = "";
      folders = [];
      filesByFolder = {};

      try {
        const rootContent = await githubApi(BASE_PATH);
        // Separate folders and files
        const rootFolders = rootContent.filter((item) => item.type === "dir");
        const rootFiles = rootContent.filter((item) => item.type === "file");

        // Add folders to folders list
        folders = rootFolders.map((f) => f.name);

        // Add "Non trier" folder for root files
        folders.unshift("Non trier");

        // Files in root go to "Non trier"
        filesByFolder["Non trier"] = rootFiles.filter((f) =>
          f.name.toLowerCase().endsWith(".md")
        );

        // For each folder, load its files (only md)
        for (const folderName of rootFolders.map((f) => f.name)) {
          const folderContent = await githubApi(`${BASE_PATH}/${folderName}`);
          filesByFolder[folderName] = folderContent.filter(
            (item) => item.type === "file" && item.name.toLowerCase().endsWith(".md")
          );
        }

        renderFolders();
        renderFiles("Non trier");
      } catch (e) {
        alert("Erreur lors du chargement des fichiers : " + e.message);
      }
    }

    // Render folders list
    function renderFolders() {
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
          openFolder(folder);
        });
        li.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFolder(folder);
          }
        });
        foldersUl.appendChild(li);
      });
    }

    // Render files list for a folder
    function renderFiles(folder) {
      currentFolder = folder;
      currentFolderName.textContent = folder === "Non trier" ? "Non trié" : folder;
      filesUl.innerHTML = "";
      btnBackFolder.disabled = historyStack.length === 0;
      btnCreateFile.disabled = false;

      const files = filesByFolder[folder] || [];
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
        text.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");

      let html = escapeHtml(md);

      html = html.replace(/::(.*?)::/g, '<mark>$1</mark>');
      html = html.replace(/\*(.*?)\*/g, '<b>$1</b>');
      html = html.replace(/\$\$(.*?)\$\$/gs, '<div class="math-block">$1</div>');
      html = html.replace(/\$(.*?)\$/g, '<span class="math-inline">$1</span>');
      html = html.replace(/\[\[toc\]\]/g, '<div id="table-of-contents"></div>');
      html = html.replace(/\[\^([^\]]+)\]/g, '<sup id="footnote-$1">$1</sup>');
      html = html.replace(/`(.*?)`/g, '<code style="background: rgb(243, 243, 243); border-radius: 2px; color: rgb(68, 68, 68); font-family: &quot;Roboto Mono&quot;, monospace; font-size: 0.85em; margin: 0px 0.2em; padding: 0.1em 0.5em; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">$1</code>');

      html = html.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
      html = html.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
      html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
      html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
      html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
      html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');

      html = html.replace(/^(?:\s*[-*+] (.*)(\n|$))+/gm, (match) => {
        const items = match.trim().split(/\n/).map(line => {
          return '<li>' + line.replace(/^[-*+] /, '') + '</li>';
        }).join('');
        return '<ul>' + items + '</ul>';
      });

      html = html.replace(/^(?:\s*\d+\. (.*)(\n|$))+/gm, (match) => {
        const items = match.trim().split(/\n/).map(line => {
          return '<li>' + line.replace(/^\d+\. /, '') + '</li>';
        }).join('');
        return '<ol>' + items + '</ol>';
      });

      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

      html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

      html = html.split(/\n{2,}/).map(block => {
        if (/^<(h[1-6]|ul|ol|div|pre|blockquote|table|p|code|mark|b|sup|a|span)[ >]/.test(block.trim())) {
          return block;
        }
        return '<p>' + block.trim().replace(/\n/g, '<br>') + '</p>';
      }).join('');

      return html;
    }

    function renderMarkdown(md) {
      fileRenderedContent.innerHTML = customMarkdownRender(md);
    }

    // Open folder (push current folder to history)
    function openFolder(folder) {
      if (currentFolder !== null) {
        historyStack.push(currentFolder);
      }
      renderFiles(folder);
      fileViewSection.classList.add("hidden");
      currentFile = null;
      fileContent.value = "";
      btnSave.disabled = true;
      isEditing = false;
      updateHash("", "");
      btnCreateFile.disabled = false;
    }

    // Back folder
    btnBackFolder.addEventListener("click", () => {
      if (historyStack.length > 0) {
        const previousFolder = historyStack.pop();
        renderFiles(previousFolder);
        fileViewSection.classList.add("hidden");
        currentFile = null;
        fileContent.value = "";
        btnSave.disabled = true;
        isEditing = false;
        updateHash("", "");
        btnCreateFile.disabled = false;
      }
    });

    // Open file: fetch content via GitHub API and show viewer (rendered)
    async function openFile(folder, file) {
      try {
        const path = folder === "Non trier" ? `${BASE_PATH}/${file.name}` : `${BASE_PATH}/${folder}/${file.name}`;
        if (!TOKEN) throw new Error("Token GitHub non chargé");
        const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
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
        fileContent.value = decodedContent;
        renderMarkdown(decodedContent);
        btnSave.disabled = true;
        isEditing = false;
        toggleViewMode(false);
        fileViewSection.classList.remove("hidden");
        fileRenderedContent.focus();
        updateHash(folder, file.name);
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
      if (!folders.includes(folder)) return;
      const files = filesByFolder[folder] || [];
      const file = files.find((f) => f.name === filename);
      if (!file) return;
      openFolder(folder);
      openFile(folder, file);
    }

    // Toggle between viewer and editor mode
    function toggleViewMode(editMode) {
      isEditing = editMode;
      if (editMode) {
        fileContent.classList.remove("hidden");
        fileRenderedContent.classList.add("hidden");
        btnSave.classList.remove("hidden");
        btnToggleView.innerHTML = '<i class="fas fa-eye"></i>';
        fileContent.focus();
      } else {
        fileContent.classList.add("hidden");
        fileRenderedContent.classList.remove("hidden");
        btnSave.classList.add("hidden");
        btnToggleView.innerHTML = '<i class="fas fa-edit"></i>';
        fileRenderedContent.focus();
      }
    }

    btnToggleView.addEventListener("click", () => {
      if (!currentFile) return;
      if (isEditing) {
        renderMarkdown(fileContent.value);
        toggleViewMode(false);
        btnSave.disabled = true;
      } else {
        toggleViewMode(true);
      }
    });

    fileContent.addEventListener("input", () => {
      if (!currentFile) return;
      btnSave.disabled = false;
    });

    btnSave.addEventListener("click", async () => {
      if (!currentFile) return;
      btnSave.disabled = true;
      const { folder, file } = currentFile;
      try {
        const path = folder === "Non trier" ? `${BASE_PATH}/${file.name}` : `${BASE_PATH}/${folder}/${file.name}`;
        const metaRes = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`,
          {
            headers: {
              Authorization: `token ${TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        if (!metaRes.ok) throw new Error("Impossible de récupérer les métadonnées du fichier");
        const meta = await metaRes.json();

        const contentEncoded = btoa(unescape(encodeURIComponent(fileContent.value)));
        const commitMessage = `Modification du fichier ${file.name} via Explorateur MD`;

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
              sha: meta.sha,
              branch: BRANCH,
            }),
          }
        );
        if (!putRes.ok) {
          const err = await putRes.json();
          throw new Error(err.message || "Erreur lors de la sauvegarde");
        }
        alert("Fichier sauvegardé avec succès !");
        btnSave.disabled = true;
        await refreshFolderFiles(folder);
        renderMarkdown(fileContent.value);
        toggleViewMode(false);
      } catch (e) {
        alert("Erreur lors de la sauvegarde : " + e.message);
        btnSave.disabled = false;
      }
    });

    async function refreshFolderFiles(folder) {
      try {
        if (folder === "Non trier") {
          const rootContent = await githubApi(BASE_PATH);
          filesByFolder["Non trier"] = rootContent.filter(
            (item) => item.type === "file" && item.name.toLowerCase().endsWith(".md")
          );
        } else {
          const folderContent = await githubApi(`${BASE_PATH}/${folder}`);
          filesByFolder[folder] = folderContent.filter(
            (item) => item.type === "file" && item.name.toLowerCase().endsWith(".md")
          );
        }
        renderFiles(folder);
      } catch (e) {
        console.warn("Erreur lors de la mise à jour des fichiers du dossier", folder, e);
      }
    }

    btnCloseView.addEventListener("click", () => {
      fileViewSection.classList.add("hidden");
      currentFile = null;
      fileContent.value = "";
      btnSave.disabled = true;
      isEditing = false;
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

    btnImport.addEventListener("click", () => {
      fileInput.value = "";
      fileInput.click();
    });

    fileInput.addEventListener("change", async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const mdFiles = files.filter((f) => f.name.toLowerCase().endsWith(".md"));
      if (mdFiles.length === 0) {
        alert("Veuillez sélectionner uniquement des fichiers Markdown (.md).");
        return;
      }

      for (const file of mdFiles) {
        try {
          const content = await file.text();
          await createFile(currentFolder || "Non trier", file.name);
          await saveFileContent(currentFolder || "Non trier", file.name, content);
        } catch (err) {
          alert(`Erreur lors de l'import du fichier ${file.name} : ${err.message}`);
        }
      }
      alert("Import terminé !");
      await loadRoot();
    });

    async function saveFileContent(folder, filename, content) {
      try {
        const path = folder === "Non trier" ? `${BASE_PATH}/${filename}` : `${BASE_PATH}/${folder}/${filename}`;
        const metaRes = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`,
          {
            headers: {
              Authorization: `token ${TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        if (!metaRes.ok) throw new Error("Impossible de récupérer les métadonnées du fichier");
        const meta = await metaRes.json();

        const contentEncoded = btoa(unescape(encodeURIComponent(content)));
        const commitMessage = `Mise à jour du fichier ${filename} via Explorateur MD`;

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
              sha: meta.sha,
              branch: BRANCH,
            }),
          }
        );
        if (!putRes.ok) {
          const err = await putRes.json();
          throw new Error(err.message || "Erreur lors de la sauvegarde");
        }
      } catch (e) {
        throw e;
      }
    }

    btnCreateFolder.addEventListener("click", async () => {
      const folderName = prompt("Nom du nouveau dossier (sans espaces ni caractères spéciaux) :");
      if (!folderName) return;
      if (!/^[a-zA-Z0-9-_]+$/.test(folderName)) {
        alert("Nom de dossier invalide. Utilisez uniquement lettres, chiffres, tirets et underscores.");
        return;
      }
      await createFolder(folderName);
    });

    btnCreateFile.addEventListener("click", async () => {
      if (!currentFolder) {
        alert("Veuillez sélectionner un dossier pour créer un fichier.");
        return;
      }
      const filename = prompt("Nom du nouveau fichier Markdown (avec extension .md) :");
      if (!filename) return;
      if (!filename.toLowerCase().endsWith(".md")) {
        alert("Le fichier doit avoir une extension .md");
        return;
      }
      await createFile(currentFolder, filename);
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
