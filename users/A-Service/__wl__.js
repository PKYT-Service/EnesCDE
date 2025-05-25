// Fonction pour récupérer les emails de la whitelist depuis wl.json
async function getWhitelistEmails() {
    const response = await fetch('./wl.json');
    const data = await response.json();
    return data.map(user => user.email);  // Retourne un tableau d'emails
}

// Fonction pour vérifier l'email de l'utilisateur
function checkUserEmail() {
    const storedAccount = JSON.parse(localStorage.getItem('compte'));  // Récupère les informations du compte stockées dans le local storage
    if (!storedAccount || !storedAccount.email) {
        window.location.href = '../index.html';  // Si aucun compte n'est trouvé, redirige vers index.html
        return;
    }

    const userEmail = storedAccount.email;  // Récupère l'email de l'utilisateur
    getWhitelistEmails().then(whitelist => {
        if (whitelist.includes(userEmail)) {
            console.log('Accès autorisé !');  // Si l'email est dans la whitelist, accès autorisé
        } else {
            console.log('Email non autorisé, redirection...');
            window.location.href = '../index.html';  // Si l'email n'est pas dans la whitelist, redirige vers index.html
        }
    });
}

// Appel de la fonction lors du chargement de la page
window.onload = checkUserEmail;
  
