async function submitForm(event) {
    event.preventDefault(); 

    // Recup et nettoyage
    const fields = {
        email: document.getElementById("email").value.trim(),
        mdp: document.getElementById("mdp").value.trim(),
        service: document.getElementById("service").value.trim(),
        nom: document.getElementById("nom").value.trim(),
        prenom: document.getElementById("prenom").value.trim(),
        pdp: document.getElementById("pdp").value.trim(),
        pseudo: document.getElementById("pseudo").value.trim(),
        reseau: document.getElementById("reseau").value.trim(),
        type: document.getElementById("type").value.trim(),
        description: document.getElementById("description").value.trim()
    };

    for (let key in fields) {
        if (!fields[key]) {
            alert(`Le champ ${key} est requis.`);
            return;
        }
    }

    const ecdeID = localStorage.getItem("ECDE:ID") || "ECDE-" + Math.floor(Math.random() * 100000);
    const now = new Date();
    const date = now.toLocaleDateString("fr-FR") + " - " + now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    const others = {};
    for (let i = 1; i <= 10; i++) others[String(i).padStart(2, "0")] = "EnesCDE";
    others["IR"] = "EnesCDE";

    const data = {
        "CompteInfo": {
            "Email": fields.email,
            "MDP": fields.mdp,
            "ECDE-ID": ecdeID,
            "Date": date,
            "Service": fields.service
        },
        "ProfilInfo": {
            "Nom": fields.nom,
            "Prenom": fields.prenom,
            "Pdp": fields.pdp,
            "Pseudo": fields.pseudo,
            "Reseau": fields.reseau,
            "Type": fields.type,
            "Description": fields.description
        },
        "Others": others,
        "Details": {
            "Permissions": "000",
            "Admin": "None"
        }
    };

    const fileName = `${fields.email}*-*${fields.mdp}.json`;
    const filePath = `compte/v4/${fileName}`;

    try {
        // Récupération du token depuis le tocken.js ECDE
        const tokenRes = await fetch("https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js");
        const tokenJSON = await tokenRes.json();
        const GITHUB_TOKEN = tokenJSON["GITHUB_TOKEN"];

        if (!GITHUB_TOKEN) {
            throw new Error("Token GitHub introuvable dans le fichier.");
        }

        const jsonContent = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

        const response = await fetch(`https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/${filePath}`, {
            method: "PUT",
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `Ajout du compte ${fields.email}`,
                content: jsonContent
            })
        });

        if (response.ok) {
            alert("Compte enregistre avec succes !");
        } else {
            const err = await response.json();
            alert("Erreur GitHub : " + (err.message || "Inconnue"));
        }
    } catch (err) {
        alert("Echec de l'enregistrement : " + err.message);
        console.error("Erreur de soumission :", err);
    }
}
