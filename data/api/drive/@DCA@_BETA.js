document.write(`<!DOCTYPE html>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    // Tailwind config (fonts + colors proches de Notion)
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system"],
            mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo"],
          },
          colors: {
            brand: {
              50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8',
              500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81'
            }
          }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <!-- Font Awesome (icônes) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
  <!-- Libraries de rendu markdown + sanitize + highlight -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dompurify@2.3.6/dist/purify.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>document.addEventListener('DOMContentLoaded', () => hljs.highlightAll());</script>
  <style>
    :root { color-scheme: light dark; }
    /* Scrollbar */
    * { scrollbar-width: thin; scrollbar-color: rgba(100,116,139,.4) transparent; }
    *::-webkit-scrollbar { width: 10px; height: 10px; }
    *::-webkit-scrollbar-thumb { background: rgba(100,116,139,.4); border-radius: 8px; }

    /* Blocks style (Notion-like) */
    .callout { border-left: 4px solid #6366f1; background: rgba(99,102,241,.06); }
    .dark .callout { background: rgba(99,102,241,.12); }

    .math-block { background-color: #f3f4f6; border-left: 4px solid #3b82f6; padding: .5rem 1rem; margin: 1rem 0; font-family: 'JetBrains Mono', monospace; white-space: pre-wrap; }
    .dark .math-block { background-color: #111827; color: #cbd5e1; border-left-color: #3b82f6; }
    .math-inline { background-color: #e0f2fe; padding: 0 .2rem; font-family: 'JetBrains Mono', monospace; border-radius: 2px; }
    .dark .math-inline { background-color: #0c4a6e; color: #bae6fd; }
    mark { background-color: #fde68a; padding: 0 .2rem; border-radius: 2px; }
    .dark mark { background-color: #facc15; color: #111827; }
    sup { font-size: .7rem; vertical-align: super; cursor: help; color: #6b7280; }
    .dark sup { color: #9ca3af; }
  </style>

<body class="font-sans bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
  <!-- THEME CONTROLLER: auto (système) / clair / sombre -->
  <script>
    (function() {
      const apply = (mode) => {
        const root = document.documentElement;
        if (mode === 'system') {
          root.dataset.theme = 'system';
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.toggle('dark', prefersDark);
        } else if (mode === 'dark') {
          root.dataset.theme = 'dark';
          document.documentElement.classList.add('dark');
        } else {
          root.dataset.theme = 'light';
          document.documentElement.classList.remove('dark');
        }
      };
      const saved = localStorage.getItem('theme-mode') || 'system';
      apply(saved);
      window.__setTheme = (m) => { localStorage.setItem('theme-mode', m); apply(m); };
      // sync on system change when in system mode
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if ((localStorage.getItem('theme-mode') || 'system') === 'system') {
          document.documentElement.classList.toggle('dark', e.matches);
        }
      });
    })();
  </script>

  <!-- App container -->
  <div class="h-screen grid grid-cols-[280px_1fr_480px] grid-rows-[56px_1fr]">
    <!-- Topbar -->
    <header class="col-span-3 h-14 border-b border-neutral-200/70 dark:border-neutral-800/70 backdrop-blur bg-white/70 dark:bg-neutral-900/50 flex items-center px-3 gap-3">
      <button id="sidebar-collapse" class="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Basculer la navigation">
        <i class="fa-solid fa-bars"></i>
      </button>
      <div class="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <span class="font-semibold text-neutral-800 dark:text-neutral-100">Drive</span>
        <span>•</span>
        <nav aria-label="Fil d'Ariane" class="flex items-center gap-1" id="breadcrumb">
          <button class="px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" id="bc-root">Racine</button>
          <span>/</span>
          <span id="bc-current" class="truncate max-w-[40vw]">Chargement…</span>
        </nav>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <div class="relative">
          <input id="search" type="search" placeholder="Rechercher…" class="w-64 pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 outline-none focus:ring-2 focus:ring-brand-400/60" />
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
        </div>
        <div class="flex items-center gap-1" role="group" aria-label="Thème">
          <button class="px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Clair" onclick="__setTheme('light')"><i class="fa-regular fa-sun"></i></button>
          <button class="px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Auto" onclick="__setTheme('system')"><i class="fa-solid fa-circle-half-stroke"></i></button>
          <button class="px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Sombre" onclick="__setTheme('dark')"><i class="fa-regular fa-moon"></i></button>
        </div>
      </div>
    </header>

    <!-- Sidebar: dossiers racine + sous-dossiers -->
    <aside id="folder-list" class="row-start-2 col-start-1 border-r border-neutral-200/70 dark:border-neutral-800/70 overflow-y-auto bg-white dark:bg-neutral-950 flex flex-col">
      <h2 class="p-3 text-[13px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Dossiers</h2>
      <ul id="folders-ul" class="flex-1 px-2 space-y-1" aria-label="Liste des dossiers">
        <!-- Peuplé par vos scripts existants -->
      </ul>
      <div class="border-t border-neutral-200/70 dark:border-neutral-800/70 p-3">
        <h3 class="text-sm font-medium mb-2 text-neutral-600 dark:text-neutral-300">Sous-dossiers</h3>
        <ul id="folders-ul-inside" class="max-h-48 overflow-y-auto space-y-1 pr-1" aria-label="Sous-dossiers">
          <!-- Peuplé par vos scripts existants -->
        </ul>
      </div>
    </aside>

    <!-- Liste des fichiers (centre) -->
    <main id="file-list-section" class="row-start-2 col-start-2 flex flex-col overflow-hidden">
      <header class="h-12 border-b border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-neutral-950 px-3 flex items-center justify-between">
        <h2 id="current-folder-name" class="text-base font-semibold truncate">Chargement…</h2>
        <div class="flex items-center gap-2">
          <button id="btn-back-folder" class="px-2 py-1 text-sm text-brand-600 hover:bg-brand-50 dark:hover:bg-neutral-800 rounded disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            <i class="fa-solid fa-arrow-left mr-1"></i> Retour
          </button>
          <button id="btn-create-folder" class="px-3 py-1.5 rounded-xl bg-amber-400 text-neutral-900 hover:bg-amber-300 flex items-center gap-2" aria-label="Créer un dossier">
            <i class="fa-solid fa-folder-plus"></i>
            <span>Dossier</span>
          </button>
          <button id="btn-create-file" class="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Créer un fichier Markdown" disabled>
            <i class="fa-solid fa-file-circle-plus"></i>
            <span>Fichier</span>
          </button>
          <input type="file" id="file-input" multiple accept=".md" class="hidden" />
        </div>
      </header>
      <ul id="files-ul" class="flex-1 overflow-y-auto p-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 bg-white dark:bg-neutral-950" aria-live="polite">
        <!-- Peuplé par vos scripts existants. Chaque item peut être un card Notion-like -->
      </ul>
    </main>

    <!-- Panneau de droite: viewer + éditeur -->
    <section id="file-view-section" class="row-start-2 col-start-3 border-l border-neutral-200/70 dark:border-neutral-800/70 bg-white dark:bg-neutral-950 flex flex-col overflow-hidden hidden" aria-label="Visualisation du fichier">
      <header class="h-12 px-3 border-b border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-between">
        <h3 id="file-view-title" class="text-sm font-semibold truncate max-w-[70%]"></h3>
        <div class="flex items-center gap-2">
          <button id="btn-share" class="px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Partager"><i class="fa-solid fa-share-nodes"></i></button>
          <button id="btn-toggle-view" class="px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Basculer édition/preview"><i class="fa-solid fa-pen-to-square"></i></button>
          <button id="btn-close-view" class="px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Fermer"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </header>
      <div id="file-rendered-content" class="flex-1 overflow-y-auto p-6 prose prose-neutral dark:prose-invert max-w-none bg-neutral-50 dark:bg-neutral-950" style="white-space: pre-wrap;" tabindex="0"></div>
      <textarea id="file-content" class="flex-1 p-4 font-mono text-sm text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-950 resize-none outline-none hidden" spellcheck="false"></textarea>
      <footer class="h-14 px-3 border-t border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-end gap-2 bg-white/60 dark:bg-neutral-950/60">
        <button id="btn-save" class="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 hidden" disabled>
          <i class="fa-solid fa-floppy-disk mr-2"></i> Sauvegarder
        </button>
      </footer>
    </section>
  </div>

  <!-- Script Notion-like: interactions UI (sans toucher à vos API) -->
  <script>
    // Ce script ne remplace pas vos scripts d'API; il gère uniquement l'UX Notion-like
    const els = {
      foldersUl: document.getElementById('folders-ul'),
      foldersUlInside: document.getElementById('folders-ul-inside'),
      filesUl: document.getElementById('files-ul'),
      currentFolderName: document.getElementById('current-folder-name'),
      fileViewSection: document.getElementById('file-view-section'),
      fileRendered: document.getElementById('file-rendered-content'),
      fileContent: document.getElementById('file-content'),
      fileTitle: document.getElementById('file-view-title'),
      btnToggle: document.getElementById('btn-toggle-view'),
      btnSave: document.getElementById('btn-save'),
      btnClose: document.getElementById('btn-close-view'),
      breadcrumbCurrent: document.getElementById('bc-current'),
      btnBack: document.getElementById('btn-back-folder'),
      search: document.getElementById('search'),
    };

    // Exemples de helpers visuels (cartes dossier/fichier)
    function asFolderItem(name) {
      const li = document.createElement('li');
      li.className = 'group flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer';
      li.innerHTML = `<i class="fa-solid fa-folder text-amber-500"></i><span class="truncate">${name}</span>`;
      return li;
    }
    function asFileCard(name) {
      const li = document.createElement('li');
      li.className = 'border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 bg-white dark:bg-neutral-900 hover:shadow-sm transition-[box-shadow,transform] hover:-translate-y-0.5 cursor-pointer';
      li.innerHTML = `
        <div class="flex items-start gap-2">
          <i class="fa-regular fa-file-lines mt-0.5"></i>
          <div class="min-w-0">
            <div class="font-medium truncate">${name}</div>
            <div class="text-xs text-neutral-500 dark:text-neutral-400">Markdown • <span>–</span></div>
          </div>
        </div>`;
      return li;
    }

    // Rendu Markdown sécurisé (Notion-like)
    function renderMarkdown(md) {
      marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        highlight: (code, lang) => {
          if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
          }
          return hljs.highlightAuto(code).value;
        },
      });
      const dirty = marked.parse(md ?? '');
      const clean = DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });
      els.fileRendered.innerHTML = clean;
    }

    // Basculer viewer <-> éditeur
    let editMode = false;
    document.getElementById('btn-toggle-view').addEventListener('click', () => {
      editMode = !editMode;
      els.fileRendered.classList.toggle('hidden', editMode);
      els.fileContent.classList.toggle('hidden', !editMode);
      els.btnSave.classList.toggle('hidden', !editMode);
      if (editMode) els.fileContent.focus();
    });

    // Fermer panneau
    els.btnClose.addEventListener('click', () => {
      els.fileViewSection.classList.add('hidden');
    });

    // Démo non bloquante (peut être retirée): peupler un aperçu si vide
    document.addEventListener('DOMContentLoaded', () => {
      if (!els.foldersUl.children.length) {
        ['Docs', 'Specs', 'Notes'].forEach(n => els.foldersUl.appendChild(asFolderItem(n)));
      }
      if (!els.filesUl.children.length) {
        ['README.md', 'Roadmap.md', 'Design.md', 'API.md'].forEach(n => {
          const card = asFileCard(n);
          card.addEventListener('click', () => {
            els.fileViewSection.classList.remove('hidden');
            els.fileTitle.textContent = n;
            const sample = `# ${n}\n\n> Ceci est un aperçu *Notion‑like*.\n\n- Listes\n- **Gras** / _italique_\n\n\`\`\`js\nconsole.log('hello');\n\`\`\`\n`;
            els.fileContent.value = sample;
            renderMarkdown(sample);
          });
          els.filesUl.appendChild(card);
        });
      }
    });

    // Recherche client légère (filtrage visuel)
    els.search.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      Array.from(els.filesUl.children).forEach(li => {
        const name = li.textContent.toLowerCase();
        li.style.display = name.includes(q) ? '' : 'none';
      });
    });

    // Expose une API minimale si vos scripts veulent déclencher l'ouverture d'un fichier
    window.NotionLikeUI = {
      openFile({ name, content }) {
        els.fileViewSection.classList.remove('hidden');
        els.fileTitle.textContent = name;
        els.fileContent.value = content || '';
        renderMarkdown(content || '');
        editMode = false;
        els.fileRendered.classList.remove('hidden');
        els.fileContent.classList.add('hidden');
        els.btnSave.classList.add('hidden');
      },
      setCurrentFolder(name) {
        els.currentFolderName.textContent = name;
        document.getElementById('bc-current').textContent = name;
      }
    };
  </script>

  <!-- ✅ Conserve vos scripts existants avec leurs IDs (ne pas renommer ces IDs/éléments) -->
  <script id="script-drive" src="https://enes-cde.vercel.app/data/api/drive/@FCT-A@-DriveScript.js" defer></script>
  <script id="script-dma" src="https://enes-cde.vercel.app/data/api/drive/@FCT-A@-DMA.js" defer></script>


`);
