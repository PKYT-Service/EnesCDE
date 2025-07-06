document.addEventListener('DOMContentLoaded', () => {
    const folderList = document.getElementById('folder-list');
    const fileListSection = document.getElementById('file-list-section');
    const fileViewSection = document.getElementById('file-view-section');
    const openFolderListBtn = document.getElementById('open-folder-list-btn'); // Bouton hamburger (à ajouter dans ton HTML si ce n'est pas fait)
    const closeFolderListBtn = document.getElementById('close-folder-list-btn'); // Bouton de fermeture de la sidebar (à ajouter)
    const closeFileViewBtn = document.getElementById('btn-close-file-view'); // Bouton de fermeture de la vue fichier (à ajouter)
    const mobileOverlay = document.getElementById('mobile-overlay'); // Overlay (à ajouter)
    const filesUl = document.getElementById('files-ul'); // Pour détecter le clic sur un fichier

    // --- Fonctions de gestion des panneaux ---

    // Ouvre la liste des dossiers sur mobile
    const openFolderList = () => {
        if (window.innerWidth < 768) { // Seulement sur mobile
            folderList.style.transform = 'translateX(0)';
            mobileOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Empêche le scroll du corps
        }
    };

    // Ferme la liste des dossiers sur mobile
    const closeFolderList = () => {
        if (window.innerWidth < 768) { // Seulement sur mobile
            folderList.style.transform = 'translateX(-100%)';
            mobileOverlay.style.display = 'none';
            document.body.style.overflow = ''; // Réactive le scroll du corps
        }
    };

    // Ouvre la section de visualisation du fichier
    const openFileView = () => {
        if (window.innerWidth < 768) { // Seulement sur mobile
            fileListSection.style.display = 'none'; // Cache la liste des fichiers
            fileViewSection.style.display = 'flex'; // Affiche la vue fichier
            fileViewSection.style.transform = 'translateX(0)';
            document.body.style.overflow = 'hidden'; // Empêche le scroll du corps
        } else {
            // Comportement desktop : assure qu'il est visible et prend la bonne largeur
            fileViewSection.style.display = 'flex';
            fileViewSection.style.width = '28rem'; // Largeur desktop
            fileViewSection.style.transform = 'translateX(0)';
        }
    };

    // Ferme la section de visualisation du fichier
    const closeFileView = () => {
        if (window.innerWidth < 768) { // Seulement sur mobile
            fileViewSection.style.transform = 'translateX(100%)';
            // Utilise setTimeout pour cacher après l'animation (ex: 300ms, selon ta transition CSS)
            setTimeout(() => {
                fileViewSection.style.display = 'none';
                fileListSection.style.display = 'flex'; // Réaffiche la liste des fichiers
                document.body.style.overflow = ''; // Réactive le scroll du corps
            }, 300);
        } else {
            // Comportement desktop : cacher complètement
            fileViewSection.style.display = 'none';
        }
    };

    // --- Gestion de l'état responsive au chargement et au redimensionnement ---
    const handleLayout = () => {
        const isMobile = window.innerWidth < 768; // Définis ton breakpoint (ex: 768px pour 'md' de Tailwind)

        // Gestion de la liste des dossiers (#folder-list)
        if (isMobile) {
            folderList.style.position = 'fixed';
            folderList.style.top = '0';
            folderList.style.bottom = '0';
            folderList.style.left = '0';
            folderList.style.width = '16rem'; // Une largeur pour mobile, ex: 64 unités Tailwind
            folderList.style.zIndex = '30';
            folderList.style.transform = 'translateX(-100%)'; // Masqué par défaut sur mobile
            folderList.style.transition = 'transform 0.3s ease-out'; // Ajoute une transition
            // Affiche les boutons spécifiques mobile
            if (openFolderListBtn) openFolderListBtn.style.display = 'block';
            if (closeFolderListBtn) closeFolderListBtn.style.display = 'block';
        } else {
            // Desktop
            folderList.style.position = 'relative';
            folderList.style.top = 'auto';
            folderList.style.bottom = 'auto';
            folderList.style.left = 'auto';
            folderList.style.width = '16rem'; // Largeur desktop, ex: w-64
            folderList.style.zIndex = 'auto';
            folderList.style.transform = 'translateX(0)'; // Toujours visible sur desktop
            folderList.style.transition = 'none'; // Désactive la transition sur desktop
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
            fileViewSection.style.transition = 'transform 0.3s ease-out'; // Ajoute une transition
            if (closeFileViewBtn) closeFileViewBtn.style.display = 'block'; // Affiche le bouton de fermeture mobile
        } else {
            // Desktop
            fileViewSection.style.position = 'relative';
            fileViewSection.style.top = 'auto';
            fileViewSection.style.bottom = 'auto';
            fileViewSection.style.right = 'auto';
            fileViewSection.style.width = '28rem'; // Largeur desktop
            fileViewSection.style.zIndex = 'auto';
            fileViewSection.style.transform = 'translateX(0)'; // Visible sur desktop (si un fichier est ouvert)
            fileViewSection.style.transition = 'none'; // Désactive la transition sur desktop
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
    };

    // --- Écouteurs d'événements ---

    // Clic sur le bouton hamburger pour ouvrir la liste des dossiers
    if (openFolderListBtn) {
        openFolderListBtn.addEventListener('click', openFolderList);
    }

    // Clic sur le bouton pour fermer la liste des dossiers
    if (closeFolderListBtn) {
        closeFolderListBtn.addEventListener('click', closeFolderList);
    }

    // Clic sur l'overlay pour fermer la liste des dossiers
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeFolderList);
    }

    // Clic sur le bouton pour fermer la vue fichier
    if (closeFileViewBtn) {
        closeFileViewBtn.addEventListener('click', closeFileView);
    }

    // Détecte le clic sur un fichier pour ouvrir la vue du fichier
    // Tu devras adapter cette partie à la logique exacte de ton application
    if (filesUl) {
        filesUl.addEventListener('click', (event) => {
            const listItem = event.target.closest('li[data-file-id]'); // Assumes you have a data-file-id on your list items
            if (listItem) {
                // Ici, tu mettrais le code pour charger le contenu du fichier sélectionné
                // Puis tu appelles openFileView()
                console.log('Fichier cliqué, ouverture de la vue :', listItem.dataset.fileId);
                openFileView();
            }
        });
    }

    // Initialisation et gestion du redimensionnement
    window.addEventListener('resize', handleLayout);
    handleLayout(); // Appel initial pour définir l'état correct au chargement

    // On peut aussi ajouter un écouteur sur le bouton de bascule d'édition/visualisation
    // pour s'assurer que la vue fichier est bien affichée si on passe en mode édition
    const btnToggleView = document.getElementById('btn-toggle-view');
    if (btnToggleView) {
        btnToggleView.addEventListener('click', () => {
            // S'assurer que la vue fichier est affichée si on la bascule en mode édition sur mobile
            if (window.innerWidth < 768 && fileViewSection.style.display === 'none') {
                openFileView();
            }
        });
    }
});
