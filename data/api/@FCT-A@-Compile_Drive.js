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
</style>

<nav
    id="folder-list"
    class="w-64 bg-white border-r border-gray-300 overflow-y-auto flex flex-col"
    aria-label="Liste des dossiers"
>
    <h2 class="p-4 font-semibold  border-b border-gray-300 dark:bg-gray-950 bg-white dark:text-white text-black ">Dossiers racine</h2>
    <ul class="divide-y divide-gray-200 bg-white dark:bg-gray-950 flex-1 overflow-y-auto" id="folders-ul"></ul>
    <div class="border-t border-gray-300 bg-white dark:bg-gray-950 p-4">
        <h3 class="font-semibold mb-2 text-black dark:text-white">Sous-dossiers</h3>
        <ul class="divide-y divide-gray-200 max-h-48 overflow-y-auto" id="folders-ul-inside"></ul>
    </div>
</nav>

<section
    id="file-list-section"
    class="flex-1 flex flex-col overflow-hidden"
    aria-label="Liste des fichiers"
>
    <header class="bg-white dark:bg-gray-950 text-gray-900   dark:text-gray-100   border-b border-gray-300 p-4 flex items-center justify-between">
        <h2 id="current-folder-name" class="text-lg font-semibold truncate">
            Chargement...
        </h2>
        <button
            id="btn-back-folder"
            class="text-blue-600 hover:underline disabled:text-gray-400"
            disabled
            aria-label="Retour au dossier précédent"
        >
            <i class="fas fa-arrow-left"></i> Retour
        </button>
        <!--<div class="flex items-center gap-2">
            <input type="file" id="file-input" class="hidden" multiple accept=".md">
            <button id="btn-import" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-upload mr-1"></i> Importer
            </button>
            <button id="btn-create-file" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-plus mr-1"></i> Fichier
            </button>
            <button id="btn-create-folder" class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fas fa-folder-plus mr-1"></i> Dossier
            </button>
        </div>-->
    </header>
    <ul
        id="files-ul"
        class=" bg-white text-gray-950 dark:bg-gray-900  dark:text-gray-100 flex-1 overflow-y-auto bg-white divide-y divide-gray-200 p-4"
        aria-live="polite"
    ></ul>
</section>

<section
    id="file-view-section"
    class="w-[28rem] bg-white text-gray-900 dark:bg-gray-900  dark:text-gray-100 border-l border-gray-300 flex flex-col overflow-hidden hidden"
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
                id="btn-toggle-view"
                class="text-blue-600 hover:text-blue-800"
                title="Basculer entre édition et visualisation"
                aria-label="Basculer entre édition et visualisation"
            >
                <i class="fas fa-edit"></i>
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
`);
