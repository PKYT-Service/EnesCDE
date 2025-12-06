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
                class="text-gray-600 hover:text-blue-600 disabled:text-gray-400 hidden"
                title="Nouveau dossier"
                disabled
            >
                <i class="fas fa-folder-plus"></i>
            </button>
            <button
                id="btn-create-file"
                class="text-gray-600 hover:text-blue-600 disabled:text-gray-400 hidden"
                title="Nouveau fichier"
                disabled
            >
                <i class="fas fa-file-medical"></i>
            </button>
             <button
                id="btn-import"
                class="text-gray-600 hover:text-blue-600 disabled:text-gray-400 hidden"
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
        class="flex-1 p-4 font-mono text-sm text-gray-800 dark:text-gray-100 resize-none outline-none hidden"
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

    async function githubApi(path) {
        if (!TOKEN) throw new Error("Token non chargé");
        const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
        const res = await fetch(url, {
            headers: {
                Authorization: `token ${TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            },
        });
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        return res.json();
    }

    // --- Core Logic ---

    async function loadContent(folder) {
        const key = folder === null ? "root" : folder;
        let path = BASE_PATH;
        if (folder !== null) path += "/" + folder;

        try {
            const content = await githubApi(path);
            const foldersInThis = content.filter((i) => i.type === "dir").map((d) => d.name);
            const filesInThis = content.filter(
                (i) => i.type === "file" && i.name.toLowerCase().endsWith(".md")
            );

            foldersByFolder[key] = foldersInThis;
            filesByFolder[key] = filesInThis;
        } catch (e) {
            console.error("Erreur loadContent", e);
            alert("Impossible d'ouvrir le dossier : " + e.message);
            throw e;
        }
    }

    async function openFolder(folder) {
        currentFolder = folder;
        if (currentFolderName) currentFolderName.textContent = folder === null ? "Racine" : folder;

        // Logic for back button: disabled if root
        if (btnBackFolder) btnBackFolder.disabled = currentFolder === null;

        const canEdit = isEditingAllowed();
        if (btnCreateFile) btnCreateFile.disabled = !canEdit;
        if (btnCreateFolder) btnCreateFolder.disabled = !canEdit;
        if (btnImport) btnImport.disabled = !canEdit;

        if (fileViewSection) fileViewSection.classList.add("hidden");
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
            li.className = "cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 px-4 py-3 flex items-center gap-3 select-none border-b border-gray-100 dark:border-gray-800";
            li.innerHTML = `<i class="fas fa-folder text-yellow-500 text-xl"></i> <span class="font-medium">${folderName}</span>`;
            li.onclick = () => {
                const newPath = folder === null ? folderName : folder + "/" + folderName;
                openFolder(newPath);
            };
            contentUl.appendChild(li);
        });

        files.forEach(file => {
            const li = document.createElement("li");
            li.className = "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-3 flex items-center gap-3 select-none border-b border-gray-100 dark:border-gray-800";
            li.innerHTML = `<i class="fas fa-file-alt text-gray-500 text-xl"></i> <span>${file.name.replace(/\.md$/i, "")}</span>`;
            li.onclick = () => openFile(folder, file);
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
            fileViewTitle.textContent = file.name.replace(/\.md$/i, "");
            fileContent.value = content;
            renderMarkdown(content);

            fileViewSection.classList.remove("hidden");
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
            text = text.replace(
                /`([^`\n]+)`|\[([oxOX])\]/g,
                (match, code, box) => {
                    if (code) return `<code class="bg-gray-100 dark:bg-gray-900 rounded px-1 font-mono text-sm">${code}</code>`;
                    if (box.toLowerCase() === "x") return `<span class="bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200 rounded px-1">☑</span>`;
                    if (box.toLowerCase() === "o") return `<span class="bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-200 rounded px-1">☐</span>`;
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

            let headerMatch = line.match(/^(\#{1,6})\s+(.*)$/);
            if (headerMatch) {
                flushList();
                flushBlockquote();
                const level = headerMatch[1].length;
                const content = inlineReplacements(headerMatch[2].trim());
                html += `<h${level} class="font-semibold mt-6 mb-2 text-gray-900 dark:text-gray-100">${content}</h${level}>`;
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
                    html += `<div class="math-block my-4 p-2 bg-gray-100 dark:bg-gray-900 rounded font-mono whitespace-pre-wrap">${escapeHtml(content)}</div>`;
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
            html += `<p class="mb-2 leading-relaxed text-gray-800 dark:text-gray-100">${inline}</p>`;
        }

        return html;
    }

    function renderMarkdown(md) {
        if (fileRenderedContent) fileRenderedContent.innerHTML = customMarkdownRender(md);
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
