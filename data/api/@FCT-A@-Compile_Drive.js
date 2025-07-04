function creerInterfaceFichiers() {
  const main = document.getElementById("main-container");
  if (!main) {
    console.error("Aucun <main> avec l'id 'main-container' trouvé.");
    return;
  }

  // NAV : dossier racine
  const nav = document.createElement("nav");
  nav.id = "folder-list";
  nav.className = "w-64 bg-white border-r border-gray-300 overflow-y-auto flex flex-col";
  nav.setAttribute("aria-label", "Liste des dossiers");

  const h2 = document.createElement("h2");
  h2.className = "p-4 font-semibold border-b border-gray-300";
  h2.textContent = "Dossiers racine";
  nav.appendChild(h2);

  const ulDossiers = document.createElement("ul");
  ulDossiers.id = "folders-ul";
  ulDossiers.className = "divide-y divide-gray-200 bg-white dark:bg-gray-950 flex-1 overflow-y-auto";
  nav.appendChild(ulDossiers);

  const sousDossierDiv = document.createElement("div");
  sousDossierDiv.className = "border-t border-gray-300 bg-white dark:bg-gray-950 p-4";

  const h3 = document.createElement("h3");
  h3.className = "font-semibold mb-2";
  h3.textContent = "Sous-dossiers";
  sousDossierDiv.appendChild(h3);

  const ulSous = document.createElement("ul");
  ulSous.id = "folders-ul-inside";
  ulSous.className = "divide-y divide-gray-200 max-h-48 overflow-y-auto";
  sousDossierDiv.appendChild(ulSous);

  nav.appendChild(sousDossierDiv);

  // SECTION : Liste des fichiers
  const fileListSection = document.createElement("section");
  fileListSection.id = "file-list-section";
  fileListSection.className = "flex-1 flex flex-col overflow-hidden";
  fileListSection.setAttribute("aria-label", "Liste des fichiers");

  const header = document.createElement("header");
  header.className = "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-b border-gray-300 p-4 flex items-center justify-between";

  const h2Current = document.createElement("h2");
  h2Current.id = "current-folder-name";
  h2Current.className = "text-lg font-semibold truncate";
  h2Current.textContent = "Chargement...";
  header.appendChild(h2Current);

  const btnBack = document.createElement("button");
  btnBack.id = "btn-back-folder";
  btnBack.className = "text-blue-600 hover:underline disabled:text-gray-400";
  btnBack.disabled = true;
  btnBack.setAttribute("aria-label", "Retour au dossier précédent");
  btnBack.innerHTML = '<i class="fas fa-arrow-left"></i> Retour';
  header.appendChild(btnBack);

  fileListSection.appendChild(header);

  const ulFiles = document.createElement("ul");
  ulFiles.id = "files-ul";
  ulFiles.className = "bg-white text-gray-950 dark:bg-gray-900 dark:text-gray-100 flex-1 overflow-y-auto bg-white divide-y divide-gray-200 p-4";
  ulFiles.setAttribute("aria-live", "polite");
  fileListSection.appendChild(ulFiles);

  // SECTION : Visualisation du fichier
  const fileViewSection = document.createElement("section");
  fileViewSection.id = "file-view-section";
  fileViewSection.className = "w-[28rem] bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 textborder-l border-gray-300 flex flex-col overflow-hidden hidden";
  fileViewSection.setAttribute("aria-label", "Visualisation du fichier");

  const viewHeader = document.createElement("header");
  viewHeader.className = "p-4 border-b border-gray-300 flex items-center justify-between";

  const viewTitle = document.createElement("h3");
  viewTitle.id = "file-view-title";
  viewTitle.className = "text-lg font-semibold truncate max-w-[70%]";
  viewHeader.appendChild(viewTitle);

  const viewButtons = document.createElement("div");
  viewButtons.className = "flex items-center gap-3";

  const btnShare = document.createElement("button");
  btnShare.id = "btn-share";
  btnShare.className = "text-blue-600 hover:text-blue-800";
  btnShare.title = "Partager ce fichier";
  btnShare.setAttribute("aria-label", "Partager ce fichier");
  btnShare.innerHTML = '<i class="fas fa-share-alt"></i>';
  viewButtons.appendChild(btnShare);

  const btnToggle = document.createElement("button");
  btnToggle.id = "btn-toggle-view";
  btnToggle.className = "text-blue-600 hover:text-blue-800";
  btnToggle.title = "Basculer entre édition et visualisation";
  btnToggle.setAttribute("aria-label", "Basculer entre édition et visualisation");
  btnToggle.innerHTML = '<i class="fas fa-edit"></i>';
  viewButtons.appendChild(btnToggle);

  const btnClose = document.createElement("button");
  btnClose.id = "btn-close-view";
  btnClose.className = "text-gray-600 hover:text-gray-900";
  btnClose.title = "Fermer la visualisation";
  btnClose.setAttribute("aria-label", "Fermer la visualisation");
  btnClose.innerHTML = '<i class="fas fa-times"></i>';
  viewButtons.appendChild(btnClose);

  viewHeader.appendChild(viewButtons);
  fileViewSection.appendChild(viewHeader);

  const fileRendered = document.createElement("div");
  fileRendered.id = "file-rendered-content";
  fileRendered.className = "flex-1 overflow-y-auto p-4 prose max-w-full bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100";
  fileRendered.style.whiteSpace = "pre-wrap";
  fileRendered.setAttribute("aria-label", "Contenu rendu du fichier markdown");
  fileRendered.tabIndex = 0;
  fileViewSection.appendChild(fileRendered);

  const textarea = document.createElement("textarea");
  textarea.id = "file-content";
  textarea.className = "flex-1 p-4 font-mono text-sm text-gray-800 dark:text-gray-100 resize-none outline-none hidden";
  textarea.spellcheck = false;
  textarea.setAttribute("aria-label", "Contenu du fichier markdown");
  textarea.readOnly = true;
  fileViewSection.appendChild(textarea);

  const footer = document.createElement("footer");
  footer.className = "p-4 border-t border-gray-300 flex justify-end gap-2";

  const btnSave = document.createElement("button");
  btnSave.id = "btn-save";
  btnSave.className = "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hidden";
  btnSave.disabled = true;
  btnSave.setAttribute("aria-label", "Sauvegarder les modifications");
  btnSave.innerHTML = '<i class="fas fa-save mr-2"></i> Sauvegarder';
  footer.appendChild(btnSave);

  fileViewSection.appendChild(footer);

  // On ajoute tout dans <main>
  main.appendChild(nav);
  main.appendChild(fileListSection);
  main.appendChild(fileViewSection);
}

window.addEventListener("DOMContentLoaded", creerInterfaceFichiers);
