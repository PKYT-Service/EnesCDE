// --- Inclusions des bibliothèques nécessaires (à placer dans le <head> ou avant votre script principal) ---
/*
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dompurify@2.3.6/dist/purify.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script>hljs.highlightAll();</script>
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- Récupération des éléments DOM ---
    const folderList = document.getElementById('folder-list');
    const fileListSection = document.getElementById('file-list-section');
    const fileViewSection = document.getElementById('file-view-section');
    const openFolderListBtn = document.getElementById('open-folder-list-btn');
    const closeFolderListBtn = document.getElementById('close-folder-list-btn');
    const closeFileViewBtn = document.getElementById('btn-close-file-view');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const filesUl = document.getElementById('files-ul');
    const foldersUl = document.getElementById('folders-ul');
    const foldersUlInside = document.getElementById('folders-ul-inside');
    const btnBackFolder = document.getElementById('btn-back-folder');
    const fileRenderedContent = document.getElementById('file-rendered-content');
    const fileContentTextarea = document.getElementById('file-content');
    const btnSave = document.getElementById('btn-save');
    const btnToggleView = document.getElementById('btn-toggle-view');

    // --- Fonctions de gestion des panneaux UI (Responsive) ---

    /**
     * Ouvre la liste des dossiers sur mobile.
     */
    const openFolderList = () => {
        if (window.innerWidth < 768) { // Breakpoint 'md' de Tailwind
            folderList.style.transform = 'translateX(0)';
            mobileOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Empêche le défilement du corps
        }
    };

    /**
     * Ferme la liste des dossiers sur mobile.
     */
    const closeFolderList = () => {
        if (window.innerWidth < 768) { // Breakpoint 'md' de Tailwind
            folderList.style.transform = 'translateX(-100%)';
            mobileOverlay.style.display = 'none';
            document.body.style.overflow = ''; // Réactive le défilement du corps
        }
    };

    /**
     * Ouvre la section de visualisation/édition du fichier.
     */
    const openFileView = () => {
        if (window.innerWidth < 768) { // Breakpoint 'md' de Tailwind
            fileListSection.style.display = 'none'; // Cache la liste des fichiers
            folderList.style.transform = 'translateX(-100%)'; // Assure que la sidebar est fermée
            mobileOverlay.style.display = 'none'; // Cache l'overlay
            fileViewSection.style.display = 'flex'; // Affiche la vue fichier
            fileViewSection.style.transform = 'translateX(0)';
            document.body.style.overflow = 'hidden'; // Empêche le défilement du corps
        } else {
            // Comportement desktop : assure qu'il est visible et prend la bonne largeur
            fileViewSection.style.display = 'flex';
            fileViewSection.style.width = '28rem'; // Largeur desktop
            fileViewSection.style.transform = 'translateX(0)';
            document.body.style.overflow = ''; // S'assure que le défilement est activé sur desktop
        }
    };

    /**
     * Ferme la section de visualisation/édition du fichier.
     */
    const closeFileView = () => {
        if (window.innerWidth < 768) { // Breakpoint 'md' de Tailwind
            fileViewSection.style.transform = 'translateX(100%)';
            // Utilise setTimeout pour cacher après l'animation (selon ta transition CSS)
            setTimeout(() => {
                fileViewSection.style.display = 'none';
                fileListSection.style.display = 'flex'; // Réaffiche la liste des fichiers
                document.body.style.overflow = ''; // Réactive le défilement du corps
            }, 300);
        } else {
            // Comportement desktop : cacher complètement
            fileViewSection.style.display = 'none';
            fileViewSection.style.width = '0'; // Réduit la largeur pour cacher
            document.body.style.overflow = '';
        }
    };

    // --- Gestion de l'état responsive au chargement et au redimensionnement ---
    /**
     * Ajuste la disposition des panneaux en fonction de la taille de l'écran (mobile/desktop).
     */
    const handleLayout = () => {
        const isMobile = window.innerWidth < 768; // Définis ton breakpoint (ex: 768px pour 'md' de Tailwind)

        // Gestion de la liste des dossiers (#folder-list)
        if (isMobile) {
            folderList.style.position = 'fixed';
            folderList.style.top = '0';
            folderList.style.bottom = '0';
            folderList.style.left = '0';
            folderList.style.width = '16rem'; // Une largeur pour mobile, ex: w-64 Tailwind
            folderList.style.zIndex = '30';
            folderList.style.transform = 'translateX(-100%)'; // Masqué par défaut sur mobile
            // Affiche les boutons spécifiques mobile
            if (openFolderListBtn) openFolderListBtn.style.display = 'block';
            if (closeFolderListBtn) closeFolderListBtn.style.display = 'block';
        } else {
            // Desktop
            folderList.style.position = 'relative';
            folderList.style.top = 'auto';
            folderList.style.bottom = 'auto';
            folderList.style.left = 'auto';
            folderList.style.width = '16rem'; // Largeur desktop, ex: w-64 Tailwind
            folderList.style.zIndex = 'auto';
            folderList.style.transform = 'translateX(0)'; // Toujours visible sur desktop
            // Masque les boutons spécifiques mobile
            if (openFolderListBtn) openFolderListBtn.style.display = 'none';
            if (closeFolderListBtn) closeFolderListBtn.style.display = 'none';
        }

        // Gestion de la section de visualisation des fichiers (#file-view-section)
        if (isMobile) {
            fileViewSection.style.position = 'fixed';
            fileViewSection.style.top = '0';
            fileViewSection.style.bottom = '0';
            fileViewSection.style.right = '0';
            fileViewSection.style.width = '100%'; // Toute la largeur sur mobile
            fileViewSection.style.zIndex = '40';
            fileViewSection.style.transform = 'translateX(100%)'; // Masqué par défaut sur mobile
            fileViewSection.style.display = 'none'; // S'assure qu'il est caché au démarrage mobile
            if (closeFileViewBtn) closeFileViewBtn.style.display = 'block'; // Affiche le bouton de fermeture mobile
        } else {
            // Desktop
            fileViewSection.style.position = 'relative';
            fileViewSection.style.top = 'auto';
            fileViewSection.style.bottom = 'auto';
            fileViewSection.style.right = 'auto';
            fileViewSection.style.width = '28rem'; // Largeur desktop, ex: w-[28rem] Tailwind
            fileViewSection.style.zIndex = 'auto';
            fileViewSection.style.transform = 'translateX(0)'; // Visible sur desktop (si un fichier est ouvert)
            fileViewSection.style.display = 'flex'; // Par défaut visible sur desktop
            if (closeFileViewBtn) closeFileViewBtn.style.display = 'none'; // Masque le bouton de fermeture mobile
        }

        // Gestion de l'overlay mobile
        if (mobileOverlay) {
            mobileOverlay.style.display = 'none'; // Toujours masqué par défaut, géré par open/closeFolderList
            mobileOverlay.style.position = 'fixed';
            mobileOverlay.style.inset = '0';
            mobileOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
            mobileOverlay.style.zIndex = '20';
        }

        // Gestion de la section de liste des fichiers (#file-list-section)
        fileListSection.style.display = 'flex'; // Toujours visible (sauf si fileViewSection prend le dessus sur mobile)
        fileListSection.style.flex = '1';
        fileListSection.style.overflow = 'hidden';

        document.body.style.overflow = ''; // Réinitialise le défilement du body lors du redimensionnement
    };

    // --- Fonctions de gestion des données (Dossiers et Fichiers) ---

    // Simule une API pour les données de dossiers et fichiers.
    // REMPLACER CECI par vos VRAIS appels API !
    const mockApiData = {
        '/': {
            folders: [{ name: 'Documents' }, { name: 'Photos' }, { name: 'Projets' }],
            files: [{ id: 'file1', name: 'README.md' }, { id: 'file2', name: 'Notes.md' }]
        },
        '/Documents': {
            folders: [{ name: 'Travail' }, { name: 'Personnel' }],
            files: [{ id: 'file3', name: 'Rapport.md' }]
        },
        '/Documents/Travail': {
            folders: [],
            files: [{ id: 'file4', name: 'Presentation.md' }]
        },
        '/Photos': {
            folders: [{ name: 'Vacances' }],
            files: [{ id: 'file5', name: 'image_info.md' }]
        },
        '/Projets': {
            folders: [],
            files: [{ id: 'file6', name: 'ProjectPlan.md' }]
        },
        // Contenu des fichiers Markdown
        'file1': '# Bienvenue sur votre Drive !\n\nCeci est un fichier **README**.\n\n```javascript\nconsole.log("Hello World");\n```',
        'file2': '# Mes Notes\n\n- Idée 1\n- Idée 2\n\n## Liste de tâches\n- [ ] Faire les courses\n- [x] Répondre aux emails',
        'file3': '# Rapport Annuel\n\nUn résumé du rapport...\n\n```python\nprint("Hello Python")\n```',
        'file4': '# Présentation du projet\n\nDiapositive 1...\n',
        'file5': '## Info Image\n\nUne photo prise en 2024.',
        'file6': '# Plan de Projet\n\nPhase 1: Initialisation\nPhase 2: Développement'
    };

    /**
     * Charge et affiche le contenu d'un dossier (sous-dossiers et fichiers).
     * @param {string} folderPath - Le chemin du dossier à charger (ex: '/', '/Documents').
     */
    const loadFolderContent = async (folderPath = '/') => {
        document.getElementById('current-folder-name').textContent = folderPath === '/' ? 'Dossiers racine' : folderPath.split('/').pop();

        const foldersUlInside = document.getElementById('folders-ul-inside');
        const filesUl = document.getElementById('files-ul');
        foldersUlInside.innerHTML = '<li class="p-2 text-gray-500">Chargement...</li>';
        filesUl.innerHTML = '<li class="p-2 text-gray-500">Chargement...</li>';

        // Simuler un appel API asynchrone (REMPLACER PAR VOTRE VRAI APPEL FETCH)
        await new Promise(resolve => setTimeout(resolve, 300)); // Délai pour simuler réseau

        const data = mockApiData[folderPath] || { folders: [], files: [] };

        // Remplir la liste des sous-dossiers
        foldersUlInside.innerHTML = ''; // Nettoyer
        if (data.folders.length > 0) {
            data.folders.forEach(folder => {
                const li = document.createElement('li');
                li.className = 'p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center';
                li.dataset.folderPath = `${folderPath === '/' ? '' : folderPath}/${folder.name}`;
                li.innerHTML = `<i class="fas fa-folder mr-2 text-yellow-500"></i> ${folder.name}`;
                foldersUlInside.appendChild(li);
            });
        } else {
            foldersUlInside.innerHTML = '<li class="p-2 text-gray-500">Aucun sous-dossier.</li>';
        }

        // Remplir la liste des fichiers
        filesUl.innerHTML = ''; // Nettoyer
        if (data.files.length > 0) {
            data.files.forEach(file => {
                const li = document.createElement('li');
                li.className = 'p-2 hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer flex items-center';
                li.dataset.fileId = file.id; // Stocke l'ID du fichier
                li.dataset.fileName = file.name; // Stocke le nom du fichier pour le titre
                li.innerHTML = `<i class="fas fa-file-alt mr-2 text-blue-500"></i> ${file.name}`;
                filesUl.appendChild(li);
            });
        } else {
            filesUl.innerHTML = '<li class="p-2 text-gray-500">Aucun fichier dans ce dossier.</li>';
        }

        // Gérer le bouton "Retour"
        if (folderPath !== '/') {
            btnBackFolder.disabled = false;
            // Calcule le chemin du dossier parent
            btnBackFolder.dataset.parentPath = folderPath.substring(0, folderPath.lastIndexOf('/')) || '/';
        } else {
            btnBackFolder.disabled = true;
        }
    };

    /**
     * Charge et affiche le contenu d'un fichier Markdown.
     * @param {string} fileId - L'ID ou le chemin du fichier à charger.
     * @param {string} fileName - Le nom du fichier à afficher dans le titre.
     */
    const loadFileContent = async (fileId, fileName) => {
        document.getElementById('file-view-title').textContent = `Chargement de ${fileName}...`;
        fileRenderedContent.innerHTML = '<p class="text-center text-gray-500">Chargement...</p>';
        fileContentTextarea.value = ''; // Efface le textarea

        // Simuler un appel API asynchrone (REMPLACER PAR VOTRE VRAI APPEL FETCH)
        await new Promise(resolve => setTimeout(resolve, 300));

        const markdownContent = mockApiData[fileId] || '# Contenu non trouvé\n\nCe fichier n\'existe pas ou son contenu est vide.';

        fileContentTextarea.value = markdownContent; // Met le contenu dans le textarea
        document.getElementById('file-view-title').textContent = fileName; // Met à jour le titre

        // Rendu Markdown en HTML
        let renderedHtml = '';
        if (typeof marked !== 'undefined') { // Vérifie si Marked.js est chargé
            renderedHtml = marked.parse(markdownContent);
            if (typeof DOMPurify !== 'undefined') { // Vérifie si DOMPurify est chargé
                renderedHtml = DOMPurify.sanitize(renderedHtml); // Sécuriser le HTML
            } else {
                console.warn('DOMPurify non trouvé. Le contenu rendu pourrait être vulnérable aux XSS.');
            }
        } else {
            console.error('Marked.js non trouvé. Le Markdown ne sera pas rendu.');
            renderedHtml = `<pre>${markdownContent}</pre>`; // Affiche le texte brut si Marked n'est pas là
        }
        fileRenderedContent.innerHTML = renderedHtml;

        // Appliquer la coloration syntaxique (si highlight.js est chargé)
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('#file-rendered-content pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }

        openFileView(); // Ouvre la vue du fichier après le chargement
    };


    // --- Écouteurs d'événements ---

    // 1. Boutons de navigation mobile
    if (openFolderListBtn) {
        openFolderListBtn.addEventListener('click', openFolderList);
    }
    if (closeFolderListBtn) {
        closeFolderListBtn.addEventListener('click', closeFolderList);
    }
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeFolderList); // Ferme la sidebar en cliquant sur l'overlay
    }
    if (closeFileViewBtn) {
        closeFileViewBtn.addEventListener('click', closeFileView);
    }

    // 2. Clics sur les fichiers pour ouvrir la vue et charger le contenu
    filesUl.addEventListener('click', (event) => {
        const listItem = event.target.closest('li[data-file-id]');
        if (listItem) {
            const fileId = listItem.dataset.fileId;
            const fileName = listItem.dataset.fileName;
            loadFileContent(fileId, fileName);
        }
    });

    // 3. Clics sur les dossiers (liste racine)
    foldersUl.addEventListener('click', (event) => {
        const listItem = event.target.closest('li[data-folder-path]');
        if (listItem) {
            loadFolderContent(listItem.dataset.folderPath);
            if (window.innerWidth < 768) {
                closeFolderList(); // Ferme la sidebar sur mobile après la sélection
            }
        }
    });

    // 4. Clics sur les sous-dossiers (liste interne)
    foldersUlInside.addEventListener('click', (event) => {
        const listItem = event.target.closest('li[data-folder-path]');
        if (listItem) {
            loadFolderContent(listItem.dataset.folderPath);
            if (window.innerWidth < 768) {
                closeFolderList(); // Ferme la sidebar sur mobile après la sélection
            }
        }
    });

    // 5. Clic sur le bouton "Retour au dossier précédent"
    btnBackFolder.addEventListener('click', () => {
        const parentPath = btnBackFolder.dataset.parentPath || '/';
        loadFolderContent(parentPath);
    });

    // 6. Basculement entre la vue et l'édition d'un fichier
    if (btnToggleView) {
        btnToggleView.addEventListener('click', () => {
            if (fileRenderedContent.style.display !== 'none') {
                // Passer en mode édition
                fileRenderedContent.style.display = 'none';
                fileContentTextarea.style.display = 'block';
                btnSave.style.display = 'block';
                btnToggleView.innerHTML = '<i class="fas fa-eye"></i>'; // Icône "voir"
                fileContentTextarea.focus();
            } else {
                // Passer en mode visualisation
                fileContentTextarea.style.display = 'none';
                fileRenderedContent.style.display = 'block';
                btnSave.style.display = 'none';
                btnToggleView.innerHTML = '<i class="fas fa-edit"></i>'; // Icône "éditer"

                // Re-rendre le Markdown si modifié
                const markdownContent = fileContentTextarea.value;
                let renderedHtml = '';
                if (typeof marked !== 'undefined') {
                    renderedHtml = marked.parse(markdownContent);
                    if (typeof DOMPurify !== 'undefined') {
                        renderedHtml = DOMPurify.sanitize(renderedHtml);
                    }
                } else {
                    renderedHtml = `<pre>${markdownContent}</pre>`;
                }
                fileRenderedContent.innerHTML = renderedHtml;

                // Appliquer la coloration syntaxique
                if (typeof hljs !== 'undefined') {
                    document.querySelectorAll('#file-rendered-content pre code').forEach((block) => {
                        hljs.highlightElement(block);
                    });
                }
            }

            // S'assurer que la vue fichier est affichée si on bascule en mode édition/visualisation sur mobile
            if (window.innerWidth < 768 && fileViewSection.style.display === 'none') {
                openFileView();
            }
        });
    }

    // --- Initialisation ---
    window.addEventListener('resize', handleLayout); // Écoute les changements de taille de fenêtre
    handleLayout(); // Appelle au chargement pour définir la disposition initiale
    loadFolderContent('/'); // Charge le contenu du dossier racine au démarrage
});
        
