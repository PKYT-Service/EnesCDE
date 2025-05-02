// ID_verif.js

import { GITHUB_TOKEN } from "https://pkyt-database-up.vercel.app/code-source/admin-dashboard/secute_private/tocken.js";  // Assure-toi que ce chemin est correct

export const ID_verif_ecde = async () => {
  // Vérifier si 'rules' dans le localStorage est true
  const rulesAccepted = localStorage.getItem('rules') === 'true';
  if (!rulesAccepted) {
    console.log("🛡️[E-CDE] | ❌ Les règles ne sont pas acceptées, le code ne s'exécute pas.");
    return; // Si 'rules' n'est pas true, arrêter l'exécution de la fonction
  }

  try {
    // Récupération des 4 clés du localStorage
    const keys = [
      "ECDE:ID",
      "ECDE:ID_DF",
      "ECDE:ID_RP",
      "ECDE:ID_IP",
    ];

    for (let key of keys) {
      const value = localStorage.getItem(key);
      if (value) {
        console.log(`🛡️[E-CDE] | 🔑 ID_Verif [ Succès lors de la récupérations de "${key}" ]`);
      } else {
        console.log(`🛡️[E-CDE] | 🔑 ID_Verif [ Problème lors de la récupérations de "${key}" ]`);
      }
    }

    // Fetch du fichier JSON contenant les rapports depuis l'API GitHub
    const response = await fetch(
      "https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/ID/bloque_acces.json",
      {
        method: "GET",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,  // Utilisation du token pour l'authentification
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      // Décodage du contenu du fichier JSON à partir de la réponse de GitHub (Base64)
      const reportData = JSON.parse(atob(data.content));

      console.log("🛡️[E-CDE] | 🔧 ID_Verif [ Succès lors de la récupérations du rapport. ]");

      // Comparaison des valeurs du localStorage avec les données du fichier JSON
      let redirect = false;
      for (let key of keys) {
        const localStorageValue = localStorage.getItem(key);
        if (localStorageValue) {
          const matchedReport = reportData.find(
            (report) => report.Type === key && report.Valeurs === localStorageValue
          );

          if (matchedReport) {
            console.log(`🛡️[E-CDE] | 🔑 ID_Verif [ La valeur de "${key}" correspond au rapport. ]`);
            redirect = true;

            // Logique pour la redirection vers une page
            window.location.href = "#id_verif:stop_ydhattp_ioma"; // Change cette URL selon ta logique
            break;
          }
        }
      }

      // Si aucune correspondance n'est trouvée, afficher un message
      if (!redirect) {
        console.log("🛡️[E-CDE] | 🔑 ID_Verif [ Aucun rapport correspondant trouvé. ]");
      }
    } else {
      console.log("🛡️[E-CDE] | 🔧 ID_Verif [ Problème lors de la récupérations du rapport. ]");
    }
  } catch (error) {
    console.error("🛡️[E-CDE] | ⁉️ ID_Verif [ Erreur dans le processus de vérification. ]", error);
  }
};
