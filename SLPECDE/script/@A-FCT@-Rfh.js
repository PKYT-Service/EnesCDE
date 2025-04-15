export function Secure_Ref() {
    function checkRefreshStatus() {
        let refreshStatus = localStorage.getItem("EnesCDE_ADM:Refresh") === "true";

        if (refreshStatus) {
            console.log("🛡️[E-CDE] | 🔄 Refresh");
            location.reload();
        } else {
            console.log("🛡️[E-CDE] | 🔄 No refresh");
        }
    }

    // Lancer la vérification toutes les 60 secondes
    setInterval(checkRefreshStatus, 60000);

    console.log("🚀 Vérification automatique activée !");
}
