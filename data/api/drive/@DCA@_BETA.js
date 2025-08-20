document.write(`
  <script src="https://cdn.tailwindcss.com"></script>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
    rel="stylesheet"
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />
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
    /* Scrollbar for file list and folders */
    #folders-ul::-webkit-scrollbar,
    #files-ul::-webkit-scrollbar,
    #folders-ul-inside::-webkit-scrollbar {
      width: 8px;
    }
    #folders-ul::-webkit-scrollbar-thumb,
    #files-ul::-webkit-scrollbar-thumb,
    #folders-ul-inside::-webkit-scrollbar-thumb {
      background-color: rgba(107, 114, 128, 0.4);
      border-radius: 4px;
    }
    /* Notion-like scrollbar for Firefox */
    #folders-ul,
    #files-ul,
    #folders-ul-inside {
      scrollbar-width: thin;
      scrollbar-color: rgba(107, 114, 128, 0.4) transparent;
    }
  </style>

<body class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 h-screen flex flex-col">

  <div class="flex flex-1 min-h-0 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg shadow-md m-4">
    <!-- Sidebar: Dossiers -->
    <nav
      id="folder-list"
      class="w-72 bg-white dark:bg-gray-950 border-r border-gray-300 dark:border-gray-700 flex flex-col"
      aria-label="Liste des dossiers"
    >
      <h2 class="p-4 font-semibold border-b border-gray-300 dark:border-gray-700 dark:text-white text-black select-none">
        Dossiers racine
      </h2>
      <ul
        class="divide-y divide-gray-200 dark:divide-gray-700 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400"
        id="folders-ul"
        role="list"
        tabindex="0"
        aria-label="Liste des dossiers racine"
      >
        <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2" tabindex="0" role="listitem" aria-selected="false" id="repo/root-folder-1">
          <i class="fas fa-folder text-yellow-500"></i>
          <span class="truncate">Projet Alpha</span>
        </li>
        <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2" tabindex="0" role="listitem" aria-selected="false" id="repo/root-folder-2">
          <i class="fas fa-folder text-yellow-500"></i>
          <span class="truncate">Documentation</span>
        </li>
        <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2" tabindex="0" role="listitem" aria-selected="false" id="repo/root-folder-3">
          <i class="fas fa-folder text-yellow-500"></i>
          <span class="truncate">Archives 2023</span>
        </li>
        <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2" tabindex="0" role="listitem" aria-selected="false" id="repo/root-folder-4">
          <i class="fas fa-folder text-yellow-500"></i>
          <span class="truncate">Clients</span>
        </li>
        <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2" tabindex="0" role="listitem" aria-selected="false" id="repo/root-folder-5">
          <i class="fas fa-folder text-yellow-500"></i>
          <span class="truncate">Templates</span>
        </li>
      </ul>
      <div class="border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
        <h3 class="font-semibold mb-2 text-black dark:text-white select-none">Sous-dossiers</h3>
        <ul
          class="divide-y divide-gray-200 dark:divide-gray-700 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400"
          id="folders-ul-inside"
          role="list"
          tabindex="0"
          aria-label="Liste des sous-dossiers"
        >
          <li class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2" tabindex="0" role="listitem" aria-selected="false" id="repo/sub-folder-1">
            <i class="fas fa-folder text-yellow-400"></i>
            <span class="truncate">Design</span>
          </li>
          <li class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2" tabindex="0" role="listitem" aria-selected="false" id="repo/sub-folder-2">
            <i class="fas fa-folder text-yellow-400"></i>
            <span class="truncate">Réunions</span>
          </li>
          <li class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2" tabindex="0" role="listitem" aria-selected="false" id="repo/sub-folder-3">
            <i class="fas fa-folder text-yellow-400"></i>
            <span class="truncate">Brouillons</span>
          </li>
          <li class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2" tabindex="0" role="listitem" aria-selected="false" id="repo/sub-folder-4">
            <i class="fas fa-folder text-yellow-400"></i>
            <span class="truncate">Archives 2022</span>
          </li>
          <li class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2" tabindex="0" role="listitem" aria-selected="false" id="repo/sub-folder-5">
            <i class="fas fa-folder text-yellow-400"></i>
            <span class="truncate">Projets clients</span>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Main content area -->
    <section
      id="file-list-section"
      class="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900"
      aria-label="Liste des fichiers"
    >
      <header
        class="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 p-4 flex items-center justify-between select-none"
      >
        <h2
          id="current-folder-name"
          class="text-lg font-semibold truncate"
          aria-live="polite"
          aria-atomic="true"
        >
          Dossier: Projet Alpha
        </h2>
        <button
          id="btn-back-folder"
          class="text-blue-600 hover:underline disabled:text-gray-400 flex items-center gap-2"
          disabled
          aria-label="Retour au dossier précédent"
          title="Retour au dossier précédent"
        >
          <i class="fas fa-arrow-left"></i> Retour
        </button>
      </header>
      <ul
        id="files-ul"
        class="flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700 p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        role="list"
        tabindex="0"
        aria-live="polite"
        aria-label="Liste des fichiers dans le dossier"
      >
        <li
          class="py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer select-text"
          tabindex="0"
          role="listitem"
          id="file-1"
          aria-describedby="perm=read"
        >
          <i class="fas fa-file-alt text-gray-500 dark:text-gray-400"></i>
          <span class="truncate flex-1">README.md</span>
          <span class="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 select-none" id="perm=read">Lecture</span>
        </li>
        <li
          class="py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer select-text"
          tabindex="0"
          role="listitem"
          id="file-2"
          aria-describedby="perm=write"
        >
          <i class="fas fa-file-alt text-gray-500 dark:text-gray-400"></i>
          <span class="truncate flex-1">Planification.md</span>
          <span class="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 select-none" id="perm=write">Écriture</span>
        </li>
        <li
          class="py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer select-text"
          tabindex="0"
          role="listitem"
          id="file-3"
          aria-describedby="perm=read"
        >
          <i class="fas fa-file-alt text-gray-500 dark:text-gray-400"></i>
          <span class="truncate flex-1">Notes de réunion.md</span>
          <span class="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 select-none" id="perm=read">Lecture</span>
        </li>
        <li
          class="py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer select-text"
          tabindex="0"
          role="listitem"
          id="file-4"
          aria-describedby="perm=write"
        >
          <i class="fas fa-file-alt text-gray-500 dark:text-gray-400"></i>
          <span class="truncate flex-1">Brouillon de présentation.md</span>
          <span class="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 select-none" id="perm=write">Écriture</span>
        </li>
        <li
          class="py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer select-text"
          tabindex="0"
          role="listitem"
          id="file-5"
          aria-describedby="perm=read"
        >
          <i class="fas fa-file-alt text-gray-500 dark:text-gray-400"></i>
          <span class="truncate flex-1">Changelog.md</span>
          <span class="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 select-none" id="perm=read">Lecture</span>
        </li>
        <li
          class="py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer select-text"
          tabindex="0"
          role="listitem"
          id="file-6"
          aria-describedby="perm=write"
        >
          <i class="fas fa-file-alt text-gray-500 dark:text-gray-400"></i>
          <span class="truncate flex-1">Spécifications techniques.md</span>
          <span class="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 select-none" id="perm=write">Écriture</span>
        </li>
        <li
          class="py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer select-text"
          tabindex="0"
          role="listitem"
          id="file-7"
          aria-describedby="perm=read"
        >
          <i class="fas fa-file-alt text-gray-500 dark:text-gray-400"></i>
          <span class="truncate flex-1">Guide utilisateur.md</span>
          <span class="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 select-none" id="perm=read">Lecture</span>
        </li>
        <li
          class="py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer select-text"
          tabindex="0"
          role="listitem"
          id="file-8"
          aria-describedby="perm=write"
        >
          <i class="fas fa-file-alt text-gray-500 dark:text-gray-400"></i>
          <span class="truncate flex-1">Roadmap.md</span>
          <span class="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 select-none" id="perm=write">Écriture</span>
        </li>
        <li
          class="py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer select-text"
          tabindex="0"
          role="listitem"
          id="file-9"
          aria-describedby="perm=read"
        >
          <i class="fas fa-file-alt text-gray-500 dark:text-gray-400"></i>
          <span class="truncate flex-1">FAQ.md</span>
          <span class="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 select-none" id="perm=read">Lecture</span>
        </li>
        <li
          class="py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer select-text"
          tabindex="0"
          role="listitem"
          id="file-10"
          aria-describedby="perm=write"
        >
          <i class="fas fa-file-alt text-gray-500 dark:text-gray-400"></i>
          <span class="truncate flex-1">Notes personnelles.md</span>
          <span class="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 select-none" id="perm=write">Écriture</span>
        </li>
      </ul>
    </section>

    <!-- File view panel -->
    <section
      id="file-view-section"
      class="w-96 bg-white dark:bg-gray-900 border-l border-gray-300 dark:border-gray-700 flex flex-col overflow-hidden hidden"
      aria-label="Visualisation du fichier"
    >
      <header
        class="p-4 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between dark:bg-gray-950 dark:text-white text-black select-none"
      >
        <h3
          id="file-view-title"
          class="text-lg font-semibold truncate max-w-[70%]"
          aria-live="polite"
          aria-atomic="true"
        >
          README.md
        </h3>
        <div class="flex items-center gap-3">
          <button
            id="btn-share"
            class="text-blue-600 hover:text-blue-800"
            title="Partager ce fichier"
            aria-label="Partager ce fichier"
            type="button"
          >
            <i class="fas fa-share-alt"></i>
          </button>
          <button
            id="btn-close-view"
            class="text-gray-600 hover:text-gray-900"
            title="Fermer la visualisation"
            aria-label="Fermer la visualisation"
            type="button"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </header>
      <div
        id="file-rendered-content"
        class="flex-1 overflow-y-auto p-6 prose max-w-full bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100"
        style="white-space: pre-wrap;"
        aria-label="Contenu rendu du fichier markdown"
        tabindex="0"
      >
        <h1>Bienvenue dans le projet Alpha</h1>
        <p>
          Ceci est un exemple de contenu markdown affiché dans la vue fichier.
          Vous pouvez éditer, visualiser et gérer vos fichiers facilement.
        </p>
        <pre class="math-block">E = mc^2</pre>
        <p>
          Voici une formule en ligne : <code class="math-inline">a^2 + b^2 = c^2</code> dans le texte.
        </p>
        <mark>Important :</mark> N'oubliez pas de sauvegarder vos modifications.
      </div>
      <textarea
        id="file-content"
        class="flex-1 p-4 font-mono text-sm text-gray-800 dark:text-gray-100 resize-none outline-none hidden"
        spellcheck="false"
        aria-label="Contenu du fichier markdown"
        readonly
      ></textarea>
      <footer class="p-4 border-t border-gray-300 dark:border-gray-700 flex justify-end gap-2">
        <button
          id="btn-save"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hidden"
          disabled
          aria-label="Sauvegarder les modifications"
          type="button"
        >
          <i class="fas fa-save mr-2"></i> Sauvegarder
        </button>
      </footer>
    </section>
  </div>
  <script src="https://enes-cde.vercel.app/data/api/drive/@FCT-A@-DriveScript.js" defer></script>
`);
