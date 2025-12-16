document.write(`
<style>
    body {
      font-family: 'Inter', sans-serif;
    }
    /* Math block styling */
    .math-block {
      background-color: #f3f4f6;
      border-left: 4px solid #3b82f6;
      padding: 0.5rem 1rem;
      margin: 1rem 0;
      font-family: 'Courier New', Courier, monospace;
      white-space: pre-wrap;
    }
    .dark .math-block {
      background-color: #1e293b;
      color: #cbd5e1;
      border-left-color: #3b82f6;
    }
    .math-inline {
      background-color: #e0f2fe;
      padding: 0 0.2rem;
      font-family: 'Courier New', Courier, monospace;
      border-radius: 2px;
    }
    .dark .math-inline {
      background-color: #0c4a6e;
      color: #bae6fd;
    }
    mark {
      background-color: #fde68a;
      padding: 0 0.2rem;
      border-radius: 2px;
    }
    .dark mark {
      background-color: #facc15;
      color: #1e293b;
    }
    #table-of-contents {
      border: 1px solid #d1d5db;
      padding: 0.5rem 1rem;
      margin-bottom: 1rem;
      background-color: #f9fafb;
      font-size: 0.9rem;
      color: #374151;
    }
    .dark #table-of-contents {
      border-color: #374151;
      background-color: #1f2937;
      color: #d1d5db;
    }
    sup {
      font-size: 0.7rem;
      vertical-align: super;
      cursor: help;
      color: #6b7280;
    }
    .dark sup {
      color: #9ca3af;
    }
    /* Scrollbar */
    #content-ul::-webkit-scrollbar {
      width: 8px;
    }
    #content-ul::-webkit-scrollbar-thumb {
      background-color: rgba(107, 114, 128, 0.4);
      border-radius: 4px;
    }
</style>

<section
    id="content-list-section"
    class="flex-1 flex flex-col overflow-hidden"
    aria-label="Explorateur de fichiers"
>
    <header class="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border-b border-gray-300 p-4 flex items-center justify-between">
        <h2 id="current-folder-name" class="text-lg font-semibold truncate">
            Chargement...
        </h2>
        <div class="flex gap-2">
             <button
                id="btn-create-folder"
                class="text-gray-600 hover:text-blue-600 disabled:text-gray-400"
                title="Nouveau dossier"
                disabled
            >
                <i class="fas fa-folder-plus"></i>
            </button>
            <button
                id="btn-create-file"
                class="text-gray-600 hover:text-blue-600 disabled:text-gray-400"
                title="Nouveau fichier"
                disabled
            >
                <i class="fas fa-file-medical"></i>
            </button>
             <button
                id="btn-import"
                class="text-gray-600 hover:text-blue-600 disabled:text-gray-400"
                title="Importer"
                disabled
            >
                <i class="fas fa-file-upload"></i>
            </button>
            <input type="file" id="file-input" multiple accept=".md" class="hidden" />
            <div class="w-px h-6 bg-gray-300 mx-1"></div>
            <button
                id="btn-back-folder"
                class="text-blue-600 hover:underline disabled:text-gray-400"
                disabled
                aria-label="Retour au dossier précédent"
            >
                <i class="fas fa-arrow-left"></i> Retour
            </button>
        </div>
    </header>
    <ul
        id="content-ul"
        class="bg-white text-gray-950 dark:bg-gray-900 dark:text-gray-100 flex-1 overflow-y-auto divide-y divide-gray-200 p-4"
        aria-live="polite"
    ></ul>
</section>

<!-- Resizer -->
<div id="resizer" class="w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize hidden select-none transition-colors z-10 flex-shrink-0"></div>

<section
    id="file-view-section"
    class="w-[28rem] bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 border-l border-gray-300 flex flex-col overflow-hidden hidden"
    aria-label="Visualisation du fichier"
>
    <header
        class="p-4 border-b border-gray-300 flex items-center justify-between dark:bg-gray-950 dark:text-white text-black"
    >
        <h3 id="file-view-title" class="text-lg font-semibold truncate max-w-[70%]"></h3>
        <div class="flex items-center gap-3">
             <button
                id="btn-toggle-view"
                class="text-gray-600 hover:text-gray-900"
                title="Basculer vue/édition"
            >
                <i class="fas fa-edit"></i>
            </button>
            <button
                id="btn-share"
                class="text-blue-600 hover:text-blue-800"
                title="Partager ce fichier"
                aria-label="Partager ce fichier"
            >
                <i class="fas fa-share-alt"></i>
            </button>
            <button
                id="btn-close-view"
                class="text-gray-600 hover:text-gray-900"
                title="Fermer la visualisation"
                aria-label="Fermer la visualisation"
            >
                <i class="fas fa-times"></i>
            </button>
        </div>
    </header>
    <div
        id="file-rendered-content"
        class="flex-1 overflow-y-auto p-4 prose max-w-full bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100"
        style="white-space: pre-wrap;"
        aria-label="Contenu rendu du fichier markdown"
        tabindex="0"
    ></div>
    <textarea
        id="file-content"
        class="flex-1 p-4 font-mono text-sm
         bg-white text-gray-900 
         placeholder-gray-400
         focus:outline-none
         dark:bg-gray-800
         dark:text-gray-100
         dark:placeholder-gray-500 resize-none outline-none hidden"
        spellcheck="false"
        aria-label="Contenu du fichier markdown"
        readonly
    ></textarea>
    <footer class="p-4 border-t border-gray-300 flex justify-end gap-2">
        <button
            id="btn-save"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hidden"
            disabled
            aria-label="Sauvegarder les modifications"
        >
            <i class="fas fa-save mr-2"></i> Sauvegarder
        </button>
    </footer>
</section>
<div id="drive/adm" class="hidden"></div> 
`);

document.addEventListener("DOMContentLoaded", async () => {
    // --- Configuration ---
    let BASE_PATH = null;
    const OWNER = "PKYT-Service";
    const REPO = "database_dev";
    const BRANCH = "main";
    let TOKEN = null;

    // --- DOM Elements ---
    const contentUl = document.getElementById("content-ul");
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
    const resizer = document.getElementById("resizer");
    const driveAdmDiv = document.getElementById("drive/adm");

    // --- State ---
    let filesByFolder = {};
    let foldersByFolder = {};
    let currentFolder = null; // null means root
    let currentFile = null;
    let isEditing = false;

    // --- Initialization Logic ---
    const repoDiv = document.querySelector('[id^="repo/"]');
    if (repoDiv) {
        const drive = repoDiv.id.split("/")[1];
        if (!drive) {
            console.error("Erreur : Aucun drive spécifié.");
        } else {
            BASE_PATH = `NEW*DRIVE/${drive}`;
            console.log("BASE_PATH:", BASE_PATH);
        }
    } else {
        console.warn("Aucune div 'repo/' trouvée. Mode dégradé ou attente.");
    }

    if (!BASE_PATH) {
        BASE_PATH = "NEW*DRIVE/Forum";
        console.warn("Utilisation du BASE_PATH par défaut :", BASE_PATH);
    }

    // --- Permissions ---
    function isEditingAllowed() {
        return true;
    }

    // --- GitHub API ---
    async function loadToken() {
        try {
            const res = await fetch(
                "https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js",
                { cache: "no-store" }
            );
            if (!res.ok) throw new Error("Impossible de charger le token");
            const json = await res.json();
            if (!json.GITHUB_TOKEN) throw new Error("Token manquant");
            TOKEN = json.GITHUB_TOKEN;
        } catch (e) {
            console.error("Erreur token:", e);
            alert("Erreur token: " + e.message);
        }
    }

    async function githubApi(path, method = "GET", body = null) {
        if (!TOKEN) throw new Error("Token non chargé");
        const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
        const options = {
            method,
            headers: {
                Authorization: `token ${TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            },
        };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(url, options);
        if (!res.ok && res.status !== 404) throw new Error(`GitHub API error: ${res.status}`);
        if (method === "GET" || (method === "PUT" && res.status === 200) || (method === "PUT" && res.status === 201)) {
            return res.json();
        }
        return res; // For DELETE or other status
    }

    async function getFileSha(path) {
        try {
            const data = await githubApi(path);
            return data.sha;
        } catch (e) {
            return null; // File doesn't exist
        }
    }

    async function createFile(path, content, message = "Update file") {
        const sha = await getFileSha(path);
        const body = {
            message: message,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: BRANCH
        };
        if (sha) body.sha = sha;
        await githubApi(path, "PUT", body);
    }

    async function deleteFile(path, message = "Delete file") {
        const sha = await getFileSha(path);
        if (!sha) return; // Already deleted
        const body = {
            message: message,
            sha: sha,
            branch: BRANCH
        };
        await githubApi(path, "DELETE", body);
    }

    // --- Core Logic ---

    async function loadContent(folder) {
        const key = folder === null ? "root" : folder;
        let path = BASE_PATH;
        if (folder !== null) path += "/" + folder;

        try {
            const content = await githubApi(path);
            if (Array.isArray(content)) {
                const foldersInThis = content.filter((i) => i.type === "dir").map((d) => d.name);
                const filesInThis = content.filter(
                    (i) => i.type === "file" && i.name.toLowerCase().endsWith(".md")
                );
                foldersByFolder[key] = foldersInThis;
                filesByFolder[key] = filesInThis;
            } else {
                // Empty folder or single file returned (should not happen for dir list)
                foldersByFolder[key] = [];
                filesByFolder[key] = [];
            }
        } catch (e) {
            console.error("Erreur loadContent", e);
            // Assume empty if error (e.g. new folder)
            foldersByFolder[key] = [];
            filesByFolder[key] = [];
        }
    }

    async function openFolder(folder) {
        currentFolder = folder;
        if (currentFolderName) currentFolderName.textContent = folder === null ? "Racine" : folder;

        // Logic for back button: disabled if root
        if (btnBackFolder) btnBackFolder.disabled = currentFolder === null;

        const canEdit = isEditingAllowed();
        if (btnCreateFile) {
            btnCreateFile.disabled = !canEdit;
            btnCreateFile.classList.remove("hidden");
        }
        if (btnCreateFolder) {
            btnCreateFolder.disabled = !canEdit;
            btnCreateFolder.classList.remove("hidden");
        }
        if (btnImport) {
            btnImport.disabled = !canEdit;
            btnImport.classList.remove("hidden");
        }

        if (fileViewSection) fileViewSection.classList.add("hidden");
        if (resizer) resizer.classList.add("hidden");
        currentFile = null;

        contentUl.innerHTML = '<li class="p-4 text-gray-500">Chargement...</li>';
        try {
            await loadContent(folder);
            renderContent(folder);
        } catch (e) {
            contentUl.innerHTML = '<li class="p-4 text-red-500">Erreur de chargement.</li>';
        }
    }

    function renderContent(folder) {
        const key = folder === null ? "root" : folder;
        const folders = foldersByFolder[key] || [];
        const files = filesByFolder[key] || [];

        contentUl.innerHTML = "";

        if (folders.length === 0 && files.length === 0) {
            contentUl.innerHTML = '<li class="p-4 text-gray-500 italic">Dossier vide.</li>';
            return;
        }

        folders.forEach(folderName => {
            const li = document.createElement("li");
            li.className = "cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 px-4 py-3 flex items-center justify-between select-none border-b border-gray-100 dark:border-gray-800 group";

            const leftDiv = document.createElement("div");
            leftDiv.className = "flex items-center gap-3";
            leftDiv.innerHTML = `<i class="fas fa-folder text-yellow-500 text-xl"></i> <span class="font-medium">${folderName}</span>`;
            leftDiv.onclick = () => {
                const newPath = folder === null ? folderName : folder + "/" + folderName;
                openFolder(newPath);
            };

            const rightDiv = document.createElement("div");
            rightDiv.className = "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity";

            // Rename Button
            const btnRename = document.createElement("button");
            btnRename.innerHTML = '<i class="fas fa-pen text-gray-500 hover:text-blue-600"></i>';
            btnRename.title = "Renommer";
            btnRename.onclick = (e) => {
                e.stopPropagation();
                renameItem(folder, folderName, true);
            };
            rightDiv.appendChild(btnRename);

            li.appendChild(leftDiv);
            li.appendChild(rightDiv);
            contentUl.appendChild(li);
        });

        files.forEach(file => {
            const li = document.createElement("li");
            li.className = "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-3 flex items-center justify-between select-none border-b border-gray-100 dark:border-gray-800 group";

            const leftDiv = document.createElement("div");
            leftDiv.className = "flex items-center gap-3";
            leftDiv.innerHTML = `<i class="fas fa-file-alt text-gray-500 text-xl"></i> <span>${file.name.replace(/\.md$/i, "")}</span>`;
            leftDiv.onclick = () => openFile(folder, file);

            const rightDiv = document.createElement("div");
            rightDiv.className = "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity";

            // Rename Button
            const btnRename = document.createElement("button");
            btnRename.innerHTML = '<i class="fas fa-pen text-gray-500 hover:text-blue-600"></i>';
            btnRename.title = "Renommer";
            btnRename.onclick = (e) => {
                e.stopPropagation();
                renameItem(folder, file.name, false);
            };
            rightDiv.appendChild(btnRename);

            li.appendChild(leftDiv);
            li.appendChild(rightDiv);
            contentUl.appendChild(li);
        });
    }

    async function openFile(folder, file) {
        try {
            let path = folder === null ? `${BASE_PATH}/${file.name}` : `${BASE_PATH}/${folder}/${file.name}`;
            const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`, {
                headers: { Authorization: `token ${TOKEN}`, Accept: "application/vnd.github.v3+json" }
            });
            if (!res.ok) throw new Error("Erreur chargement fichier");
            const json = await res.json();
            const content = decodeURIComponent(escape(atob(json.content.replace(/\n/g, ""))));

            currentFile = { folder, file };
            fileViewTitle.textContent = file.name;
            fileContent.value = content;
            renderMarkdown(content);

            fileViewSection.classList.remove("hidden");
            if (resizer) resizer.classList.remove("hidden");

            // Reset view mode
            isEditing = false;
            fileContent.classList.add("hidden");
            fileRenderedContent.classList.remove("hidden");
            btnSave.classList.add("hidden");
            btnSave.disabled = true;

        } catch (e) {
            alert("Erreur ouverture fichier: " + e.message);
        }
    }

    // --- Markdown Rendering ---
    function customMarkdownRender(md) {
        const escapeHtml = (text) =>
            text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

        // 1. Fonction de remplacement interne
        function inlineReplacements(text) {
            text = text.replace(
                /`([^`\n]+)`|\[([oxOX])\]/g,
                (match, code, box) => {
                    if (code) return `<code class="bg-gray-100 dark:bg-gray-900 rounded px-1 font-mono text-sm">${code}</code>`;
                    if (box.toLowerCase() === "x") return `<span class="bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200 rounded px-1">☑</span>`;
                    if (box.toLowerCase() === "o") return `<span class="bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-200 rounded px-1">☐</span>`;
                    return match; // Retourne le match original si aucune condition ne correspond
                }
            );
            text = text.replace(/`([^`\n]+)`/g, '<code class="bg-gray-100 dark:bg-gray-900 rounded px-1 font-mono text-sm">$1</code>');
            text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
            text = text.replace(/__(.+?)__/g, '<strong class="font-bold">$1</strong>');
            text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em class="italic">$1</em>');
            text = text.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '<em class="italic">$1</em>');
            text = text.replace(/~~(.+?)~~/g, '<s class="line-through text-gray-700 dark:text-gray-300">$1</s>');
            text = text.replace(/::(.*?)::/g, '<mark class="bg-yellow-200 dark:bg-yellow-500 dark:text-gray-900">$1</mark>');
            text = text.replace(/\$(.+?)\$/g, '<span class="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">$1</span>');
            text = text.replace(/\[\^([^\]]+)\]/g, '<sup id="footnote-$1" class="text-xs align-super text-blue-600 hover:underline cursor-pointer">$1</sup>');
            text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">$1</a>');
            text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full my-2 rounded shadow-md"/>');
            text = text.replace(/\[\{(.+?)\}\]/g, '<a class="inline-block text-white bg-blue-500 hover:bg-blue-600 font-semibold text-sm px-3 py-1 rounded-full shadow transition duration-150">$1</a>');
            text = text.replace(/(\*\*\*|___)(.+?)\1/g, '<strong class="font-bold"><em class="italic">$2</em></strong>');

            // Legal
            text = text.replace(/\[\[Procès:\s*(.+?)\]\]/g, '<span class="font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900 px-1 rounded">$1</span>');
            text = text.replace(/\(\(Avocat:\s*(.+?)\)\)/g, '<span class="font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900 px-1 rounded">$1</span>');
            text = text.replace(/\{\{Juge:\s*(.+?)\}\}/g, '<span class="font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900 px-1 rounded">$1</span>');
            text = text.replace(/\[Décret:\s*(.+?)\]/g, '<span class="font-mono text-blue-800 dark:text-blue-200 bg-blue-50 dark:bg-blue-900 px-1 rounded">$1</span>');
            text = text.replace(/\[Certificat:\s*(.+?)\]/g, '<span class="font-mono text-indigo-800 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-900 px-1 rounded">$1</span>');
            text = text.replace(/\[Document:\s*(.+?)\]/g, '<span class="font-mono text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 px-1 rounded">$1</span>');

            // Tribunal
            text = text.replace(/\(Dossier:\s*([^\)]+)\)/g, '<span class="font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-1 rounded-sm border border-gray-300 dark:border-gray-600">Dossier #$1</span>');
            text = text.replace(/\(Audience:\s*([^\)]+)\)/g, '<span class="font-semibold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 px-1 rounded-sm">Audience du $1</span>');
            text = text.replace(/\(Plaignant:\s*([^\)]+)\)/g, '<span class="font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900 px-1 rounded-sm">Plaignant: $1</span>');
            text = text.replace(/\(Accusé:\s*([^\)]+)\)/g, '<span class="font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900 px-1 rounded-sm">Accusé: $1</span>');
            text = text.replace(/\(Témoin:\s*([^\)]+)\)/g, '<span class="font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900 px-1 rounded-sm">Témoin: $1</span>');
            text = text.replace(/\(Preuve:\s*([^\)]+)\)/g, '<span class="font-mono text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900 px-1 rounded-sm">Preuve: $1</span>');
            text = text.replace(/\(ArtLoi:\s*([^\)]+)\)/g, '<span class="font-semibold text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900 px-1 rounded-sm">Article de loi: $1</span>');

            // Code block style
            text = text.replace(/```([\s\S]+?)```/g, '<code class="font-mono text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded block whitespace-pre-wrap">$1</code>');
            
            text = text.replace(/\(Verdict:\s*(Culpabilité|Acquittement|Non-lieu)\)/g, (match, p1) => {
                let bgColor = '';
                let textColor = '';
                if (p1 === 'Culpabilité') {
                    bgColor = 'bg-red-200 dark:bg-red-800';
                    textColor = 'text-red-900 dark:text-red-100';
                } else if (p1 === 'Acquittement' || p1 === 'Non-lieu') {
                    bgColor = 'bg-green-200 dark:bg-green-800';
                    textColor = 'text-green-900 dark:text-green-100';
                }
                return `<span class="font-extrabold ${textColor} ${bgColor} px-2 py-0.5 rounded-md shadow-sm">VERDICT: ${p1}</span>`;
            });

            return text;
        }

        // 2. Helper pour générer le tableau HTML
        function generateTableHTML(rows) {
            // rows doit contenir [Header, Separator, Data1, Data2, ...]
            if (rows.length < 3) return rows.join('<br>'); // Pas un tableau valide

            // Nettoyage des barres verticales | au début et fin
            const parseRow = (row) => row.replace(/^\||\|$/g, '').split('|').map(c => c.trim());

            const headerRow = parseRow(rows[0]);
            // rows[1] est la ligne de séparation |---|---| qu'on ignore dans le rendu
            const bodyRows = rows.slice(2);

            let html = '<div class="overflow-x-auto my-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">';
            html += '<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 text-sm">';

            // Header
            html += '<thead class="bg-gray-100 dark:bg-gray-900"><tr>';
            headerRow.forEach(cell => {
                html += `<th class="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider border-b border-gray-300 dark:border-gray-600">${inlineReplacements(cell)}</th>`;
            });
            html += '</tr></thead>';

            // Body
            html += '<tbody class="divide-y divide-gray-200 dark:divide-gray-700">';
            bodyRows.forEach(rowString => {
                if (!rowString.trim()) return;
                const cells = parseRow(rowString);
                html += '<tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">';
                cells.forEach(cell => {
                    html += `<td class="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-gray-300">${inlineReplacements(cell)}</td>`;
                });
                html += '</tr>';
            });
            html += '</tbody></table></div>';
            return html;
        }


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

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            const trimmedLine = line.trim();

            // 1. Code Block (Priorité 1)
            if (/^```/.test(line)) {
                if (!inCodeBlock) {
                    flushList();
                    flushBlockquote();
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

            // 2. Headers (Priorité 2)
            let headerMatch = line.match(/^(\#{1,6})\s+(.*)$/);
            if (headerMatch) {
                flushList();
                flushBlockquote();
                const level = headerMatch[1].length;
                const content = inlineReplacements(headerMatch[2].trim());
                // J'ajoute une classe text-4xl/3xl/2xl/xl/lg pour améliorer l'apparence des titres
                const sizeClasses = ['text-4xl', 'text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base'];
                html += `<h${level} class="font-extrabold ${sizeClasses[level - 1]} mt-6 mb-2 text-gray-900 dark:text-gray-100">${content}</h${level}>`;
                continue;
            }

            // 3. Horizontal Rule (Priorité 3)
            if (/^(\*\s*){3,}$/.test(line) || /^(-\s*){3,}$/.test(line) || /^(_\s*){3,}$/.test(line)) {
                flushList();
                flushBlockquote();
                html += `<hr class="my-6 border-gray-300 dark:border-gray-700">`;
                continue;
            }

            // 4. Table Detection (Priorité 4) - V3: Beaucoup plus robuste aux lignes vides et espaces
            // Vérifier si la ligne actuelle est un potentiel début de tableau (ligne d'en-tête)
            if (trimmedLine.startsWith('|') && trimmedLine.includes('|', 1)) {

                let tableRows = [line]; // Commence avec la ligne d'en-tête potentielle
                let separatorFound = false;
                let tempIndex = i + 1;

                // 4a. Recherche du séparateur (|---|), en sautant les lignes vides
                while (tempIndex < lines.length) {
                    const nextLine = lines[tempIndex];
                    const trimmedNextLine = nextLine.trim();

                    if (trimmedNextLine === '') {
                        tempIndex++; // Sauter la ligne vide
                        continue;
                    }

                    // Le séparateur a été trouvé (doit commencer et finir par | et contenir des ---)
                    if (/^\s*\|.*[:\-]+.*\|/i.test(trimmedNextLine) && !/[a-zA-Z]/.test(trimmedNextLine)) {
                        tableRows.push(nextLine);
                        separatorFound = true;
                        tempIndex++;
                        break; // Séparateur trouvé, passer à la collecte des données
                    }

                    // Si on rencontre une ligne non vide et qui n'est pas un séparateur/début de tableau, on arrête
                    if (!trimmedNextLine.startsWith('|')) {
                        break;
                    }

                    // Si la ligne commence par '|' mais n'est pas le séparateur attendu
                    // C'est probablement une table qui manque le séparateur, ou le format est cassé. On arrête la détection de table.
                    break;
                }

                // 4b. Si le séparateur est trouvé, collecter les lignes de données, en sautant les lignes vides
                if (separatorFound) {
                    let dataLineCount = 0;
                    while (tempIndex < lines.length) {
                        const nextLine = lines[tempIndex];
                        const trimmedNextLine = nextLine.trim();

                        if (trimmedNextLine === '') {
                            tempIndex++; // Sauter la ligne vide
                            continue;
                        }

                        // Ligne de données valide?
                        if (trimmedNextLine.startsWith('|') && trimmedNextLine.includes('|', 1)) {
                            tableRows.push(nextLine);
                            dataLineCount++;
                            tempIndex++;
                            continue;
                        }

                        // Arrêt si on rencontre un autre type de contenu
                        break;
                    }

                    // 4c. Doit avoir au moins une ligne de données
                    if (dataLineCount > 0) {
                        flushList();
                        flushBlockquote();
                        html += generateTableHTML(tableRows);
                        i = tempIndex - 1; // Mettre à jour l'index
                        continue;
                    }
                }
                // Si la vérification échoue, la ligne i continue vers le paragraphe (9).
            }

            // 5. Blockquotes (Priorité 5)
            if (/^\s*>/.test(line)) {
                flushList();
                const content = line.replace(/^\s*> ?/, "");
                inBlockquote = true;
                blockquoteBuffer.push(inlineReplacements(content));
                if (i + 1 >= lines.length || (!/^\s*>/.test(lines[i + 1]) && lines[i + 1].trim() !== '')) {
                    flushBlockquote();
                }
                continue;
            } else {
                flushBlockquote();
            }

            // 6. Lists (Priorité 6)
            let ulMatch = line.match(/^\s*([-*+])\s+(.*)$/);
            let olMatch = line.match(/^\s*(\d+)\.\s+(.*)$/);

            if (ulMatch || olMatch) {
                const match = ulMatch || olMatch;
                const type = ulMatch ? "ul" : "ol";
                const content = inlineReplacements(match[2].trim());

                if (!inList) {
                    inList = true;
                    listType = type;
                    listBuffer.push(content);
                } else if (listType === type) {
                    listBuffer.push(content);
                } else {
                    flushList();
                    inList = true;
                    listType = type;
                    listBuffer.push(content);
                }

                // Check if the next line continues the list (heuristic: check for the same list type prefix or indent)
                const nextLine = lines[i + 1] || '';
                const continuesList = (type === "ul" && /^\s*([-*+])\s+/.test(nextLine)) ||
                    (type === "ol" && /^\s*\d+\.\s+/.test(nextLine)) ||
                    /^\s{2,}/.test(nextLine); // Check for indentation for nested/multi-line items

                if (i + 1 >= lines.length || (!continuesList && nextLine.trim() !== '')) {
                    flushList();
                }
                continue;
            }
            flushList();

            // 7. Math Block ($$) (Priorité 7)
            if (/^\$\$/.test(line)) {
                let mathBlock = [];
                if (/^\$\$(.*)\$\$$/.test(line)) {
                    const content = line.replace(/^\$\$(.*)\$\$$/, "$1");
                    html += `<div class="math-block my-4 p-2 bg-gray-100 dark:bg-gray-900 rounded font-mono whitespace-pre-wrap">${escapeHtml(content)}</div>`;
                    continue;
                }
                i++;
                while (i < lines.length && !/^\$\$/.test(lines[i])) {
                    mathBlock.push(lines[i]);
                    i++;
                }
                const content = mathBlock.join("\n");
                html += `<div class="math-block my-4 p-2 bg-gray-100 dark:bg-gray-900 rounded font-mono whitespace-pre-wrap">${escapeHtml(content)}</div>`;
                continue;
            }

            // 8. Empty Line (Priorité 8)
            if (/^\s*$/.test(line)) {
                // Seulement ajouter un <br> si la ligne précédente n'était pas déjà un bloc de type non-paragraphique ou vide.
                if (i > 0 && !/^\s*$/.test(lines[i - 1])) {
                    html += `<br>`;
                }
                continue;
            }

            // 9. Paragraph (Dernière Priorité)
            const inline = inlineReplacements(line.trim());
            html += `<p class="mb-2 leading-relaxed text-gray-800 dark:text-gray-100">${inline}</p>`;
        }

        return html;
    }

    function renderMarkdown(md) {
        if (fileRenderedContent) fileRenderedContent.innerHTML = customMarkdownRender(md);
    }

    // --- Admin Functions ---

    async function moveFolder(oldPath, newPath) {
        // 1. Lister le contenu du dossier
        let contents = [];
        try {
            const res = await githubApi(oldPath);
            if (Array.isArray(res)) {
                contents = res;
            }
        } catch (e) {
            // Si le dossier est vide ou n'existe pas (ce qui est bizarre si on le renomme), on ignore
            console.warn("Dossier vide ou erreur lecture:", oldPath, e);
            return;
        }

        // 2. Créer le dossier destination (via un fichier .keep si nécessaire, ou implicitement par les fichiers)
        // GitHub crée les dossiers automatiquement quand on crée un fichier dedans.

        // 3. Parcourir et déplacer
        for (const item of contents) {
            const itemOldPath = item.path; // ex: NEW*DRIVE/Forum/OldFolder/file.md
            const itemName = item.name;
            const itemNewPath = `${newPath}/${itemName}`;

            if (item.type === "file") {
                // Déplacer fichier
                try {
                    // a. Lire contenu
                    const fileRes = await githubApi(itemOldPath);
                    const content = decodeURIComponent(escape(atob(fileRes.content.replace(/\n/g, ""))));

                    // b. Créer nouveau fichier
                    await createFile(itemNewPath, content, `Move ${itemName} to new folder`);

                    // c. Supprimer ancien fichier
                    await deleteFile(itemOldPath, `Moved ${itemName}`);
                } catch (err) {
                    console.error(`Erreur déplacement fichier ${itemName}:`, err);
                    alert(`Erreur lors du déplacement de ${itemName}: ` + err.message);
                }
            } else if (item.type === "dir") {
                // Récursion pour les sous-dossiers
                await moveFolder(itemOldPath, itemNewPath);
            }
        }
    }

    async function renameItem(folder, oldName, isFolder) {
        const newName = prompt("Nouveau nom :", oldName.replace(/\.md$/i, ""));
        if (!newName || newName === oldName.replace(/\.md$/i, "")) return;

        const finalNewName = isFolder ? newName : (newName.endsWith(".md") ? newName : newName + ".md");
        const oldPath = folder === null ? `${BASE_PATH}/${oldName}` : `${BASE_PATH}/${folder}/${oldName}`;
        const newPath = folder === null ? `${BASE_PATH}/${finalNewName}` : `${BASE_PATH}/${folder}/${finalNewName}`;

        if (confirm(`Renommer "${oldName}" en "${finalNewName}" ?`)) {
            try {
                if (isFolder) {
                    // IMPLEMENTATION DU RENOMMAGE DOSSIER
                    alert("Renommage du dossier en cours... Cela peut prendre du temps selon le nombre de fichiers.");
                    await moveFolder(oldPath, newPath);
                    alert("Dossier renommé (déplacé) avec succès !");
                    openFolder(folder); // Refresh parent
                    return;
                }

                // 1. Get content of old file
                const sha = await getFileSha(oldPath);
                if (!sha) throw new Error("Fichier original introuvable.");

                const res = await githubApi(oldPath);
                const content = decodeURIComponent(escape(atob(res.content.replace(/\n/g, ""))));

                // 2. Create new file
                await createFile(newPath, content, `Renamed ${oldName} to ${finalNewName}`);

                // 3. Delete old file
                await deleteFile(oldPath, `Renamed ${oldName} to ${finalNewName}`);

                alert("Renommé avec succès !");
                openFolder(folder); // Refresh
            } catch (e) {
                console.error(e);
                alert("Erreur lors du renommage : " + e.message);
            }
        }
    }

    // --- Event Listeners ---

    // FIX: Back button uses parent directory logic
    btnBackFolder.onclick = () => {
        if (!currentFolder) return; // Already at root
        const lastSlashIndex = currentFolder.lastIndexOf('/');
        if (lastSlashIndex === -1) {
            openFolder(null); // Go to root
        } else {
            openFolder(currentFolder.substring(0, lastSlashIndex));
        }
    };

    btnCloseView.onclick = () => {
        fileViewSection.classList.add("hidden");
        if (resizer) resizer.classList.add("hidden");
        currentFile = null;
    };

    // FIX: Share button
    btnShare.onclick = async () => {
        if (!currentFile) return;

        // 1. Prepare Data
        let path = currentFile.folder === null ? currentFile.file.name : `${currentFile.folder}/${currentFile.file.name}`;
        const url = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(path)}`;
        const domain = window.location.hostname; // e.g. "campyskerie.vercel.app" or "localhost"

        // Content Preview (First 2 lines)
        const rawContent = fileContent.value || "";
        const lines = rawContent.split(/\r?\n/).filter(line => line.trim() !== "");
        const preview = lines.slice(0, 2).join("\n");

        // File Name without extension
        const fileName = currentFile.file.name.replace(/\.md$/i, "");

        // Construct Message
        const message = `${fileName}\n\n${preview}\n\n-----------------\nProvient de : ${domain}\nFichier partagé : ${url}`;

        const shareData = {
            title: fileName,
            text: message,
            url: url
        };

        // 2. Always try to copy to clipboard (Message + URL for better context in clipboard)
        try {
            await navigator.clipboard.writeText(message);
        } catch (err) {
            console.error('Erreur copie presse-papier:', err);
        }

        // 3. Try native share
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Erreur partage:', err);
            }
        } else {
            // Only alert if native share is not available
            alert("Message et lien copiés dans le presse-papier !");
        }
    };

    // Admin Buttons Logic
    btnCreateFolder.onclick = async () => {
        const name = prompt("Nom du nouveau dossier :");
        if (!name) return;
        // GitHub doesn't support empty folders. We create a .keep file inside.
        const path = currentFolder === null ? `${BASE_PATH}/${name}/.keep` : `${BASE_PATH}/${currentFolder}/${name}/.keep`;
        try {
            await createFile(path, "", "Create folder");
            alert("Dossier créé !");
            openFolder(currentFolder);
        } catch (e) {
            alert("Erreur création dossier: " + e.message);
        }
    };

    btnCreateFile.onclick = async () => {
        const name = prompt("Nom du fichier (sans .md) :");
        if (!name) return;
        const fileName = name.endsWith(".md") ? name : name + ".md";
        const path = currentFolder === null ? `${BASE_PATH}/${fileName}` : `${BASE_PATH}/${currentFolder}/${fileName}`;
        try {
            await createFile(path, "# " + name, "Create file");
            alert("Fichier créé !");
            openFolder(currentFolder);
        } catch (e) {
            alert("Erreur création fichier: " + e.message);
        }
    };

    btnImport.onclick = () => {
        fileInput.click();
    };

    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const content = ev.target.result;
            const path = currentFolder === null ? `${BASE_PATH}/${file.name}` : `${BASE_PATH}/${currentFolder}/${file.name}`;
            try {
                await createFile(path, content, "Import file");
                alert("Fichier importé !");
                openFolder(currentFolder);
            } catch (err) {
                alert("Erreur import: " + err.message);
            }
        };
        reader.readAsText(file);
    };

    btnToggleView.onclick = () => {
        isEditing = !isEditing;
        if (isEditing) {
            fileRenderedContent.classList.add("hidden");
            fileContent.classList.remove("hidden");
            fileContent.removeAttribute("readonly"); // ✅ Retire readonly pour éditer
            btnSave.classList.remove("hidden");
            btnSave.disabled = false;
        } else {
            fileContent.classList.add("hidden");
            fileRenderedContent.classList.remove("hidden");
            fileContent.setAttribute("readonly", "true"); // ✅ Remet readonly
            btnSave.classList.add("hidden");
            btnSave.disabled = true;
            // Re-render markdown from textarea
            renderMarkdown(fileContent.value);
        }
    };
    btnSave.onclick = async () => {
        if (!currentFile) return;
        const content = fileContent.value;
        const path = currentFile.folder === null ? `${BASE_PATH}/${currentFile.file.name}` : `${BASE_PATH}/${currentFile.folder}/${currentFile.file.name}`;
        try {
            await createFile(path, content, "Update file content");
            alert("Sauvegardé !");
            isEditing = false;
            fileContent.classList.add("hidden");
            fileRenderedContent.classList.remove("hidden");
            btnSave.classList.add("hidden");
            btnSave.disabled = true;
            renderMarkdown(content);
        } catch (e) {
            alert("Erreur sauvegarde: " + e.message);
        }
    };

    // --- Resizer Logic ---
    let isResizing = false;

    if (resizer) {
        resizer.addEventListener("mousedown", (e) => {
            isResizing = true;
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none"; // Prevent text selection
        });

        document.addEventListener("mousemove", (e) => {
            if (!isResizing) return;
            // Calculate width from the right side of the screen
            const newWidth = window.innerWidth - e.clientX;
            // Min width 200px, Max width 80% of screen
            if (newWidth > 200 && newWidth < (window.innerWidth * 0.8)) {
                if (fileViewSection) {
                    fileViewSection.style.width = `${newWidth}px`;
                    // Ensure flex doesn't mess it up
                    fileViewSection.style.flex = "none";
                }
            }
        });

        document.addEventListener("mouseup", () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
            }
        });
    }

    // --- Start ---
    await loadToken();
    if (TOKEN) {
        // FIX: Deep Linking
        const hash = window.location.hash.substring(1);
        if (hash) {
            const path = decodeURIComponent(hash);
            if (path.toLowerCase().endsWith('.md')) {
                // It's a file
                const lastSlash = path.lastIndexOf('/');
                let folder = null;
                let fileName = path;
                if (lastSlash !== -1) {
                    folder = path.substring(0, lastSlash);
                    fileName = path.substring(lastSlash + 1);
                }
                await openFolder(folder);
                await openFile(folder, { name: fileName });
            } else {
                // It's a folder
                await openFolder(path);
            }
        } else {
            await openFolder(null);
        }
    }
});

// Ajout dynamique de Font Awesome
(function () {
    const faLink = document.createElement("link");
    faLink.rel = "stylesheet";
    faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    faLink.integrity = "sha512-6I1Y6dHQJiwLvt/ZZktBCfyVc2CalK3ldx6R3cFdBsZIX5yYkDeR3QoL1iVurITrjkzD4rG2ifF8qqPpLmIIPw==";
    faLink.crossOrigin = "anonymous";
    faLink.referrerPolicy = "no-referrer";
    document.head.appendChild(faLink);
})();
