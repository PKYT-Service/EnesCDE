  //                //
 // F12 Switcher   //
//                //
        // Fonction pour définir un cookie
        function setCookie(name, value, days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // expiration en jours
            let expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        }

        // Fonction pour récupérer un cookie
        function getCookie(name) {
            let nameEQ = name + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        // Changer le statut entre "ADMIN" et "none"
        const button = document.getElementById('adminSwitch');
        let isAdmin = getCookie('EnesCDE');

        // Vérifie l'état initial du cookie pour adapter le texte du bouton
        if (isAdmin === "ADMIN") {
            button.innerText = "Passer à NONE";
        } else {
            button.innerText = "Passer à ADMIN";
        }

        // Écoute l'événement de clic sur le bouton
        button.addEventListener('click', () => {
            if (isAdmin === "ADMIN") {
                setCookie('EnesCDE', 'none', 7); // Expire dans 7 jours
                button.innerText = "Passer à ADMIN";
            } else {
                setCookie('EnesCDE', 'ADMIN', 7); // Expire dans 7 jours
                button.innerText = "Passer à NONE";
            }
            isAdmin = getCookie('EnesCDE');
        });
  //                //
 // F12 Switcher   //
//                //
