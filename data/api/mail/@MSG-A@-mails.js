
    // Correctement récupérer l'objet 'compte' du localStorage
    const compte = JSON.parse(localStorage.getItem("compte") || "{}");
    // Vérifier si l'email est bien présent dans l'objet 'compte'
    if (!compte.email) {
      alert("Erreur: Email non trouvé dans le compte localStorage. Assurez-vous que la clé 'email' est définie.");
    }

    const chatBox = document.getElementById("chatBox");
    const loadingElem = document.getElementById("loading");
    const form = document.getElementById("sendForm");
    const destInput = document.getElementById("destInput");
    const msgInput = document.getElementById("msgInput");

    // 🔐 Récupération dynamique du token GitHub
    async function getToken() {
      const res = await fetch("https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js");
      const json = await res.json();
      return json.GITHUB_TOKEN;
    }

    // 📥 Charger les messages reçus
    async function chargerMessages() {
      // S'assurer que l'email de l'utilisateur est bien disponible pour le filtre
      if (!compte.email) {
        console.error("Impossible de charger les messages : l'email de l'utilisateur n'est pas défini.");
        loadingElem.style.display = "none";
        chatBox.innerHTML = "<p class='text-center text-red-500'>Impossible de charger les messages sans un email d'utilisateur valide.</p>";
        return;
      }

      try {
        const token = await getToken();
        const res = await fetch("https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/ecde/mails", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Erreur API GitHub lors de la liste des fichiers.");
        const fichiers = await res.json();

        const messagesRecus = []; 

        for (const fichier of fichiers) {
          if (!fichier.name.endsWith(".json")) continue;

          try {
            const contentRes = await fetch(fichier.download_url);
            if (!contentRes.ok) continue;
            const data = await contentRes.json(); 

            if (Array.isArray(data)) {
              data.forEach(message => {
                // *** LA CORRECTION EST ICI ***
                // Assurez-vous que l'email de destination correspond bien à l'email de l'utilisateur connecté
                if (message.à && message.à.toLowerCase() === compte.email.toLowerCase()) {
                  messagesRecus.push(message);
                }
              });
            }
          } catch (e) {
            console.warn(`Fichier illisible ou format incorrect (${fichier.name}): `, e);
          }
        }

        afficherMessages(messagesRecus);
      } catch (e) {
        console.error("Erreur chargement messages:", e);
        loadingElem.style.display = "none";
        chatBox.innerHTML = "<p class='text-center text-red-500'>Erreur lors du chargement des messages.</p>";
      }
    }

    // 💬 Affichage dans le chat
    function afficherMessages(msgs) {
      loadingElem.style.display = "none";
      chatBox.innerHTML = "";

      if (msgs.length === 0) {
        chatBox.innerHTML = "<p class='text-center text-gray-400 bg-white dark:bg-dark dark:text-white text-dark  '>Aucun message reçu.</p>";
        return;
      }

      msgs.sort((a, b) => new Date(a.date) - new Date(b.date));

      msgs.forEach(m => {
        const div = document.createElement("div");
        div.className = "self-start bg-gray-200 p-2 rounded-lg max-w-xs";

        div.innerHTML = `
          <strong class="dark:text-white text-dark">De: ${m.de}</strong><br>
          <a class="dark:text-white text-dark">${m.contenu}</a><br>
          <small class="text-gray-500">${new Date(m.date).toLocaleString()}</small>
        `;
        chatBox.appendChild(div);
      });

      chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ✉️ Envoi message
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const dest = destInput.value.trim().toLowerCase();
      const msg = msgInput.value.trim();
      if (!dest || !msg) {
        alert("Veuillez remplir tous les champs.");
        return;
      }

      // Vérifier que l'email de l'expéditeur est bien disponible
      if (!compte.email) {
        alert("Impossible d'envoyer le message : l'email de l'expéditeur n'est pas défini.");
        return;
      }

      try {
        const token = await getToken();
        const senderEmailFileName = `${compte.email}.json`;
        const filePath = `ecde/mails/${senderEmailFileName}`;

        const newMessage = {
          de: compte.email,
          à: dest,
          date: new Date().toISOString(),
          contenu: msg
        };

        let currentFileContent = [];
        let currentFileSha = null;

        try {
          const fileRes = await fetch(`https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/${filePath}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (fileRes.ok) {
            const fileData = await fileRes.json();
            currentFileSha = fileData.sha;
            currentFileContent = JSON.parse(atob(fileData.content));
            if (!Array.isArray(currentFileContent)) {
              console.warn("Le fichier existant n'est pas un tableau, réinitialisation.");
              currentFileContent = [];
            }
          } else if (fileRes.status === 404) {
            console.log("Fichier de l'expéditeur non trouvé, en créant un nouveau.");
          } else {
            throw new Error(`Erreur lors de la récupération du fichier de l'expéditeur: ${fileRes.statusText}`);
          }
        } catch (fetchError) {
          console.error("Erreur lors de la tentative de récupération du fichier de l'expéditeur:", fetchError);
          currentFileContent = [];
        }

        currentFileContent.push(newMessage);

        const content = btoa(JSON.stringify(currentFileContent, null, 2));

        const putOptions = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: `📩 Ajout message de ${compte.email} à ${dest}`,
            content: content,
            sha: currentFileSha
          })
        };

        const res = await fetch(`https://api.github.com/repos/PKYT-Service/database_EnesCDE/contents/${filePath}`, putOptions);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`Erreur API GitHub: ${errorData.message || 'Échec de l\'envoi'}`);
        }

        msgInput.value = "";
        alert("Message envoyé ! (Il n'apparaîtra pas ici à moins que vous ne soyez le destinataire)");
      } catch (err) {
        console.error("Erreur envoi message :", err);
        alert("Erreur lors de l'envoi du message : " + err.message);
      }
    });

    setInterval(chargerMessages, 3000);
    chargerMessages(); 
