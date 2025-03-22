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

        // Récupération de l'élément et du switch
        const switchBall = document.getElementById('switchBall');
        const adminSwitch = document.getElementById('adminSwitch');
        let isAdmin = getCookie('EnesCDE');

        // Initialisation du switch en fonction du cookie
        function updateSwitchState() {
            if (isAdmin === "ADMIN") {
                switchBall.style.transform = "translateX(100%)"; // Position à droite
                switchBall.classList.remove('bg-orange-500', 'bg-red-500');
                switchBall.classList.add('bg-green-500');
            } else if (isAdmin === "none") {
                switchBall.style.transform = "translateX(0%)"; // Position à gauche
                switchBall.classList.remove('bg-orange-500', 'bg-green-500');
                switchBall.classList.add('bg-red-500');
            } else {
                switchBall.style.transform = "translateX(50%)"; // Position au centre
                switchBall.classList.remove('bg-green-500', 'bg-red-500');
                switchBall.classList.add('bg-orange-500');
            }
        }

        // Initialiser l'état du switch au chargement
        updateSwitchState();

        // Écoute l'événement de clic sur le bouton switch
        adminSwitch.addEventListener('click', () => {
            if (isAdmin === "ADMIN") {
                setCookie('EnesCDE', 'none', 7); // Expire dans 7 jours
            } else if (isAdmin === "none") {
                setCookie('EnesCDE', 'ADMIN', 7); // Expire dans 7 jours
            } else {
                setCookie('EnesCDE', 'ADMIN', 7); // Expire dans 7 jours par défaut
            }
            isAdmin = getCookie('EnesCDE'); // Met à jour la variable isAdmin après modification du cookie
            updateSwitchState(); // Met à jour l'apparence du switch
        });
  //                //
 // F12 Switcher   //
//                //
