// ID_storage.js
// By Enes-cde.vercel.app
// - - - - - - - - - - - -

export function ID_stock_ecde() {
    // Vérifier si "rules" est activé dans le localStorage
    if (localStorage.getItem("rules") === "true") {
        // Récupérer l'IP de l'utilisateur
        fetch("https://api64.ipify.org?format=json")
            .then(response => response.json())
            .then(data => {
                const ip = data.ip;

                // Vérifier et définir ECDE:ID_IP
                if (!localStorage.getItem("ECDE:ID_IP")) {
                    localStorage.setItem("ECDE:ID_IP", ip);
                }

                // Inverser l'IP
                const reversedIP = ip.split(".").reverse().join(".");

                // Vérifier et définir ECDE:ID_RP
                if (!localStorage.getItem("ECDE:ID_RP")) {
                    localStorage.setItem("ECDE:ID_RP", reversedIP);
                }

                // Générer un identifiant unique
                const deviceType = /Mobi|Android|iPhone|iPad/.test(navigator.userAgent) ? "mobile" : "pc";
                const userAgent = navigator.userAgent.replace(/\s/g, "");
                const randomID = crypto.randomUUID();
                const uniqueID = btoa(`${deviceType}-${userAgent}-${ip}-${reversedIP}-${randomID}`);

                // Vérifier et définir ECDE:ID_DF
                if (!localStorage.getItem("ECDE:ID_DF")) {
                    localStorage.setItem("ECDE:ID_DF", uniqueID);
                }

                // Générer une ID aléatoire
                const randomECDE_ID = crypto.randomUUID();

                // Vérifier et définir ECDE:ID
                if (!localStorage.getItem("ECDE:ID")) {
                    localStorage.setItem("ECDE:ID", randomECDE_ID);
                }
            })
            .catch(error => console.error("🛡️[E-CDE] | ❌ ID_Stock [ Erreur lors de la récupération de l'IP. ]", error));
    }
}
