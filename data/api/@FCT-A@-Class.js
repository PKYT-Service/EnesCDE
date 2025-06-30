  const fileViewSection = document.getElementById('file-view-section');
  const btnCloseView = document.getElementById('btn-close-view');
  const fileUl = document.getElementById('files-ul');

  // Quand un fichier est clique (attente du contenu charge)
  fileUl.addEventListener('click', (e) => {
    if (e.target.closest('li')) {
      fileViewSection.classList.add('open');
    }
  });

  // Bouton pour fermer
  btnCloseView.addEventListener('click', () => {
    fileViewSection.classList.remove('open');
  });
