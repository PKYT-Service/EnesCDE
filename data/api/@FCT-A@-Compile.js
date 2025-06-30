document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("drive").innerHTML = `     
  <script src="https://enes-cde.vercel.app/data/api/@FCT-A@-Everyone_Drive.js"></script>
  <script src="https://enes-cde.vercel.app/data/api/@FCT-A@-Class.js"></script>

      <nav
      id="folder-list"
      class="w-64 bg-white border-r border-gray-300 overflow-y-auto flex flex-col"
      aria-label="Liste des dossiers"
    >
      <h2 class="p-4 font-semibold  border-b border-gray-300">Dossiers racine</h2>
      <ul class="divide-y divide-gray-200 bg-white dark:bg-gray-950 flex-1 overflow-y-auto" id="folders-ul"></ul>
      <div class="border-t border-gray-300 bg-white dark:bg-gray-950 p-4">
        <h3 class="font-semibold mb-2">Sous-dossiers</h3>
        <ul class="divide-y divide-gray-200 max-h-48 overflow-y-auto" id="folders-ul-inside"></ul>
      </div>
    </nav>

    <section
      id="file-list-section"
      class="flex-1 flex flex-col overflow-hidden"
      aria-label="Liste des fichiers"
    >
      <header class="bg-white dark:bg-gray-900 text-gray-900   dark:text-gray-100   border-b border-gray-300 p-4 flex items-center justify-between">
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
      </header>
      <ul
        id="files-ul"
        class=" bg-white text-gray-950 dark:bg-gray-900  dark:text-gray-100 flex-1 overflow-y-auto bg-white divide-y divide-gray-200 p-4"
        aria-live="polite"
      ></ul>
    </section>

    <section
      id="file-view-section"
      class="w-[28rem] bg-white text-gray-900 dark:bg-gray-900  dark:text-gray-100 textborder-l border-gray-300 flex flex-col overflow-hidden hidden"
      aria-label="Visualisation du fichier"
    >
      <header
        class="p-4 border-b border-gray-300 flex items-center justify-between"
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
  </main>
            `;
  });





