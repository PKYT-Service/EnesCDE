// @FCT-A@-MobileLayoutManager.js

/**
 * Gère l'affichage adaptatif de l'interface utilisateur sur les appareils mobiles.
 * Inclut la gestion des listes de dossiers/fichiers, de la prévisualisation plein écran
 * et des boutons de navigation spécifiques au mobile.
 *
 * @param {string} nativeURL - L'URL de base vers laquelle le bouton "Retour à l'accueil" doit rediriger.
 */
export default function initMobileLayoutManager(nativeURL) {
    const folderList = document.getElementById('folder-list');
    const fileListSection = document.getElementById('file-list-section');
    const fileViewSection = document.getElementById('file-view-section');
    const ecdeMenu = document.getElementById('ecde');

    let isViewingFiles = true; // État pour savoir si on affiche les fichiers ou les dossiers

    // Elements qui seront créés dynamiquement pour la navigation mobile
    let backToHomeContainer = null;
    let switchButtonsContainer = null;
    let showFoldersButton = null;
    let showFilesButton = null;
    let backToHomeButton = null;


    function setupMobileElements() {
        // Supprimer les anciens conteneurs de boutons si déjà présents (pour le redimensionnement)
        const oldSwitchButtonsContainer = document.querySelector('.bottom-navigation-mobile');
        if (oldSwitchButtonsContainer) oldSwitchButtonsContainer.remove();
        const oldBackToHomeContainer = document.querySelector('.back-to-home-mobile');
        if (oldBackToHomeContainer) oldBackToHomeContainer.remove();

        // --- Conteneur et bouton "Retour à l'accueil" ---
        backToHomeContainer = document.createElement('div');
        backToHomeContainer.classList.add('fixed', 'bottom-[3.5rem]', 'left-0', 'w-full', 'bg-gray-100', 'border-t', 'z-30', 'p-2', 'flex', 'justify-center', 'back-to-home-mobile');

        backToHomeButton = document.createElement('button');
        backToHomeButton.innerHTML = '<i class="fas fa-arrow-left fa-lg mr-2"></i> Retour à l\'accueil';
        backToHomeButton.classList.add('focus:outline-none', 'bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded');
        backToHomeButton.addEventListener('click', () => {
            window.location.href = nativeURL;
        });

        backToHomeContainer.appendChild(backToHomeButton);
        document.body.appendChild(backToHomeContainer);

        // --- Conteneur et boutons "Dossiers" / "Fichiers" ---
        switchButtonsContainer = document.createElement('div');
        switchButtonsContainer.classList.add('fixed', 'bottom-0', 'left-0', 'w-full', 'bg-gray-100', 'border-t', 'z-30', 'flex', 'justify-around', 'p-2', 'bottom-navigation-mobile');

        showFoldersButton = document.createElement('button');
        showFoldersButton.innerHTML = '<i class="fas fa-folder-open fa-lg"></i><span class="block text-xs">Dossiers</span>';
        showFoldersButton.classList.add('focus:outline-none');
        showFoldersButton.addEventListener('click', () => {
            isViewingFiles = false;
            folderList.style.display = 'block';
            fileListSection.style.display = 'none';
            switchButtonsContainer.style.display = 'flex';
            backToHomeContainer.style.display = 'flex';
        });

        showFilesButton = document.createElement('button');
        showFilesButton.innerHTML = '<i class="fas fa-file fa-lg"></i><span class="block text-xs">Fichiers</span>';
        showFilesButton.classList.add('focus:outline-none');
        showFilesButton.addEventListener('click', () => {
            isViewingFiles = true;
            folderList.style.display = 'none';
            fileListSection.style.display = 'block';
            switchButtonsContainer.style.display = 'flex';
            backToHomeContainer.style.display = 'flex';
        });

        switchButtonsContainer.appendChild(showFoldersButton);
        switchButtonsContainer.appendChild(showFilesButton);
        document.body.appendChild(switchButtonsContainer);

        // Cacher le menu ECDE sur mobile
        if (ecdeMenu) {
            ecdeMenu.style.display = 'none';
        }
    }

    function removeMobileElements() {
        const oldSwitchButtonsContainer = document.querySelector('.bottom-navigation-mobile');
        if (oldSwitchButtonsContainer) oldSwitchButtonsContainer.remove();
        const oldBackToHomeContainer = document.querySelector('.back-to-home-mobile');
        if (oldBackToHomeContainer) oldBackToHomeContainer.remove();

        if (ecdeMenu) {
            ecdeMenu.style.display = 'block';
        }
    }


    function adaptLayout() {
        if (window.innerWidth < 768) {
            // Appliquer les styles et créer les éléments mobiles
            setupMobileElements();

            folderList.classList.remove('w-64', 'border-r', 'flex', 'flex-col');
            folderList.classList.add('fixed', 'top-[4rem]', 'left-0', 'w-full', 'h-auto', 'bg-white', 'border-b', 'z-20', 'overflow-y-auto');
            folderList.style.maxHeight = 'calc(100vh - 11rem)'; // Ajuster la hauteur
            folderList.style.display = 'none'; // Cacher initialement

            fileListSection.classList.remove('flex-1');
            fileListSection.style.marginTop = '0';

            // Afficher la bonne section au chargement initial sur mobile
            if (!isViewingFiles) {
                fileListSection.style.display = 'none';
                folderList.style.display = 'block';
            } else {
                fileListSection.style.display = 'block';
                folderList.style.display = 'none';
            }

            // Assurer que la section de prévisualisation est prête pour l'animation plein écran mobile
            fileViewSection.classList.add('mobile-full-screen-view'); // Ajoutez cette classe pour vos styles CSS mobile
            fileViewSection.classList.remove('desktop-side-view'); // Supprimez la classe desktop si elle existe
            fileViewSection.classList.add('is-hidden-initial'); // Pour l'état initial masqué

        } else {
            // Rétablir la mise en page pour les écrans plus grands
            removeMobileElements();

            folderList.classList.add('w-64', 'border-r', 'flex', 'flex-col');
            folderList.classList.remove('fixed', 'top-[4rem]', 'left-0', 'w-full', 'h-auto', 'bg-white', 'border-b', 'z-20', 'overflow-y-auto');
            folderList.style.maxHeight = '';
            folderList.style.display = 'flex'; // Toujours visible sur desktop

            fileListSection.classList.add('flex-1');
            fileListSection.style.marginTop = '';
            fileListSection.style.display = 'flex'; // Toujours visible sur desktop

            // Rétablir la section de prévisualisation pour le bureau
            fileViewSection.classList.remove('mobile-full-screen-view');
            fileViewSection.classList.add('desktop-side-view'); // Ajoutez cette classe pour vos styles CSS bureau
            fileViewSection.classList.remove('is-hidden-initial'); // Pas de masquage initial
            fileViewSection.classList.remove('is-open'); // S'assurer qu'elle est fermée par défaut
            fileViewSection.classList.add('hidden'); // Cacher la section de prévisualisation par défaut sur bureau (si vous la voulez cachée)
        }
    }

    // Gérer l'affichage de la prévisualisation (clic sur un fichier)
    const fileUl = document.getElementById('files-ul');
    if (fileUl) {
        fileUl.addEventListener('click', (e) => {
            if (e.target.closest('li')) {
                fileViewSection.classList.add('is-open'); // Déclenche l'animation
                fileViewSection.classList.remove('hidden', 'is-hidden-initial'); // S'assurer qu'elle est visible
                document.body.classList.add('file-view-active'); // Masque le reste de l'UI
            }
        });
    }

    // Gérer le retour depuis la prévisualisation (bouton retour dans le header de la vue)
    const btnBackFromView = document.getElementById('btn-back-from-view');
    if (btnBackFromView) {
        btnBackFromView.addEventListener('click', () => {
            fileViewSection.classList.remove('is-open'); // Déclenche l'animation de fermeture
            // Attendre la fin de l'animation avant de cacher complètement et retirer la classe body
            fileViewSection.addEventListener('transitionend', function handler() {
                fileViewSection.classList.add('hidden'); // Cacher après l'animation
                fileViewSection.removeEventListener('transitionend', handler);
            }, { once: true }); // N'exécuter l'écouteur qu'une seule fois
            document.body.classList.remove('file-view-active'); // Réafficher le reste de l'UI
        });
    }

    // Bouton de fermeture classique (pour le bureau, mais au cas où)
    const btnCloseView = document.getElementById('btn-close-view');
    if (btnCloseView) {
        btnCloseView.addEventListener('click', () => {
            fileViewSection.classList.remove('is-open');
            fileViewSection.addEventListener('transitionend', function handler() {
                fileViewSection.classList.add('hidden');
                fileViewSection.removeEventListener('transitionend', handler);
            }, { once: true });
            document.body.classList.remove('file-view-active');
        });
    }

    // Initialisation
    document.addEventListener('DOMContentLoaded', adaptLayout);
    window.addEventListener('resize', adaptLayout);
}
