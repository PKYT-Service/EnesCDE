// E-CDE/ban_verif.js

export function checkBanAccount3V_pkyt() {
    // Vérifier si le compte existe dans le localStorage
    const account = localStorage.getItem('account');

    // Si le compte n'existe pas, on ne fait rien
    if (!account) {
        console.log('❇️ | ❌ CheckBanAccountV3 [ Aucun compte disponible .]');
        return;
    }

    // Fonction pour vérifier l'existence du fichier de bannissement
    function checkBanStatus() {
        // Construire l'URL pour vérifier l'existence du fichier
        const banUrl = `https://pkyt-database-up.vercel.app/code-source/pkyt-secure/user-secure/ban/${account}.html`;

        // Faire une requête fetch pour vérifier si le fichier existe
        fetch(banUrl, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // Si le fichier existe, rediriger l'utilisateur
                    window.location.href = banUrl;
                } else {
                    console.log(`❇️ | 🟢 CheckBanAccountV3 [ Profile Clean ! Attention : Compte PKYT-Service V3 et non E_CDE V4 !  .]`);
                }
            })
            .catch(error => {
                console.log('❇️ | 🟥 CheckBanAccountV3 [ Erreur lors de la vérification du fichier .]', error);
            });
    }

    // Appeler la fonction pour vérifier le statut de bannissement
    checkBanStatus();
}
