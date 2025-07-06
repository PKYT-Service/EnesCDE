document.addEventListener('DOMContentLoaded', () => {
    const folderList = document.getElementById('folder-list');
    const fileListSection = document.getElementById('file-list-section');
    const fileViewSection = document.getElementById('file-view-section');
    const openFolderListBtn = document.getElementById('open-folder-list-btn');
    const closeFolderListBtn = document.getElementById('close-folder-list-btn');
    const closeFileViewBtn = document.getElementById('btn-close-file-view'); // Utilise le nouvel ID
    const mobileOverlay = document.getElementById('mobile-overlay');

    // Fonction pour ouvrir la liste des dossiers sur mobile
    function openFolderList() {
        folderList.classList.remove('-translate-x-full'); // Fait apparaître la sidebar
        folderList.classList.add('translate-x-0');
        mobileOverlay.classList.remove('hidden'); // Affiche l'overlay
        document.body.style.overflow = 'hidden'; // Empêche le défilement du corps
    }

    // Fonction pour fermer la liste des dossiers sur mobile
    function closeFolderList() {
        folderList.classList.remove('translate-x-0'); // Fait disparaître la sidebar
        folderList.classList.add('-translate-x-full');
        mobileOverlay.classList.add('hidden'); // Masque l'overlay
        document.body.style.overflow = ''; // Rétablit le défilement du corps
    }

    // Fonction pour ouvrir la vue du fichier sur mobile
    function openFileView() {
        // Cache la liste des fichiers et la barre latérale des dossiers si visibles sur mobile
        if (window.innerWidth < 768) { // S'applique uniquement sur mobile
            fileListSection.classList.add('hidden');
            folderList.classList.add('hidden'); // Assure que la liste des dossiers est masquée
        }
        fileViewSection.classList.remove('translate-x-full'); // Fait apparaître la vue fichier
        fileViewSection.classList.add('translate-x-0');
        fileViewSection.classList.remove('hidden'); // S'assure que la section est visible
        document.body.style.overflow = 'hidden'; // Empêche le défilement du corps
    }

    // Fonction pour fermer la vue du fichier sur mobile
    function closeFileView() {
        fileViewSection.classList.remove('translate-x-0'); // Fait disparaître la vue fichier
        fileViewSection.classList.add('translate-x-full');
        fileViewSection.classList.add('hidden'); // Masque la section après l'animation
        if (window.innerWidth < 768) { // S'applique uniquement sur mobile
            fileListSection.classList.remove('hidden'); // Réaffiche la liste des fichiers
        }
        document.body.style.overflow = ''; // Rétablit le défilement du corps
    }

    // Gestionnaires d'événements
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

    // Intercepter la sélection de fichier pour ouvrir la vue du fichier
    // Ceci est une hypothèse car je ne vois pas le JS qui ouvre normalement les fichiers.
    // Tu devras adapter cela à la logique existante de ton '@FCT-A@-DriveScript.js'.
    // Par exemple, si tu as une fonction `displayFile(fileId)` ou si le clic sur un `li` dans `files-ul` déclenche l'affichage :
    const filesUl = document.getElementById('files-ul');
    if (filesUl) {
        filesUl.addEventListener('click', (event) => {
            const listItem = event.target.closest('li');
            // Assure-toi que c'est bien un fichier cliqué et non un élément enfant
            if (listItem && listItem.hasAttribute('data-file-id')) { // Assumes a data-file-id attribute
                 // Ton code existant pour charger et afficher le fichier ici
                 // ...
                openFileView(); // Appelle notre fonction pour gérer l'affichage responsive
            }
        });
    }

    // Initialisation de la visibilité sur grand écran
    // Assure que les éléments sont dans leur état desktop par défaut si le script est chargé après le HTML
    const handleResize = () => {
        if (window.innerWidth >= 768) { // Si > breakpoint 'md' de Tailwind
            folderList.classList.remove('-translate-x-full', 'translate-x-0');
            folderList.classList.add('md:relative', 'md:w-64', 'md:flex', 'md:flex-col');
            fileViewSection.classList.remove('-translate-x-full', 'translate-x-0', 'hidden');
            fileViewSection.classList.add('md:relative', 'md:w-[28rem]', 'md:flex');
            fileListSection.classList.remove('hidden'); // Assure que la liste des fichiers est visible sur desktop
            mobileOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        } else {
            // Sur mobile, assure que les états initiaux sont appliqués (masqués)
            if (!folderList.classList.contains('translate-x-0')) { // Si pas déjà ouvert
                 folderList.classList.add('-translate-x-full');
            }
            if (!fileViewSection.classList.contains('translate-x-0')) { // Si pas déjà ouvert
                fileViewSection.classList.add('translate-x-full');
                fileViewSection.classList.add('hidden'); // Masquer le panneau de visualisation au démarrage mobile
            }
            // Au chargement, la liste des fichiers est visible sur mobile
            fileListSection.classList.remove('hidden');
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Appel initial pour définir l'état correct au chargement
});
