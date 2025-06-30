    // Utilisateur connecté (extrait de localStorage)
    const compte = JSON.parse(localStorage.getItem("compte") || "{}");
    if (!compte.email) {
      alert("Pas connecté ou email manquant dans localStorage ECDE_CONNEXION");
    }

    const chatBox = document.getElementById("chatBox");
    const loadingElem = document.getElementById("loading");
    const form = document.getElementById("sendForm");
    const destInput = document.getElementById("destInput");
    const msgInput = document.getElementById("msgInput");

    // Récupération dynamique du token GitHub
    async function getToken() {
      const res = await fetch("https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js");
      const json = await res.json();
      return json.GITHUB_TOKEN;
    }

    // Charger les messages reçus
    async function chargerMessages() {
      if (!compte.email) return;
      try {
        const token = await getToken();
        const res = await fetch("https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/ecde/mails", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Erreur API GitHub");
        const fichiers = await res.json();

        const messages = [];

        for (const fichier of fichiers) {
          try {
            const contentRes = await fetch(fichier.download_url);
            if (!contentRes.ok) continue;
            const data = await contentRes.json();
            if (data.à === compte.email) {
              messages.push(data);
            }
          } catch (e) {
            // skip fichier illisible
          }
        }

        afficherMessages(messages);
      } catch (e) {
        console.error("Erreur chargement messages:", e);
      }
    }

    // Affiche les messages dans la div chatBox
    function afficherMessages(msgs) {
      loadingElem.style.display = "none";
      chatBox.innerHTML = "";
      if (msgs.length === 0) {
        chatBox.innerHTML = "<p class='text-center text-gray-400'>Aucun message reçu.</p>";
        return;
      }
      msgs.sort((a,b) => new Date(a.date) - new Date(b.date));
      msgs.forEach(m => {
        const div = document.createElement("div");
        div.className = m.de === compte.email ? "self-end bg-blue-100 p-2 rounded-lg max-w-xs" : "self-start bg-gray-200 p-2 rounded-lg max-w-xs";
        div.innerHTML = `<strong>${m.de}</strong><br>${m.contenu}<br><small class="text-gray-500">${new Date(m.date).toLocaleString()}</small>`;
        chatBox.appendChild(div);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Envoi message
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const dest = destInput.value.trim().toLowerCase();
      const msg = msgInput.value.trim();
      if (!dest || !msg) return;

      try {
        const token = await getToken();
        const date = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `ecde/mails/${date}-${compte.email}-vers-${dest}.json`;

        const message = {
          de: compte.email,
          à: dest,
          date: new Date().toISOString(),
          contenu: msg
        };

        const res = await fetch(`https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/${fileName}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: `📩 Nouveau message de ${compte.email} à ${dest}`,
            content: btoa(JSON.stringify(message, null, 2))
          })
        });

        if (!res.ok) throw new Error("Erreur envoi message");

        msgInput.value = "";
        chargerMessages();
      } catch (err) {
        alert("Erreur envoi message : " + err.message);
      }
    });

    // Rafraîchissement toutes les 2.5 secondes
    setInterval(chargerMessages, 2500);
    chargerMessages();
