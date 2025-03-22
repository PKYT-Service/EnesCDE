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

        // Récupérer le switch et l'élément de la "boule"
        const switchBallF12 = document.getElementById('switchBallF12');
        const toggleF12 = document.getElementById('toggleF12');
        let isAdmin = getCookie('EnesCDE_ADM:F12');

        // Initialisation du switch en fonction du cookie
        function UpSwitchF12() {
            if (isAdmin === "ADMIN") {
                toggleF12.checked = true;
                switchBallF12.style.transform = "translateX(100%)"; // Position à droite
                switchBallF12.classList.remove('bg-orange-500', 'bg-red-500');
                switchBallF12.classList.add('bg-green-500');
            } else if (isAdmin === "none") {
                toggleF12.checked = false;
                switchBallF12.style.transform = "translateX(0%)"; // Position à gauche
                switchBallF12.classList.remove('bg-orange-500', 'bg-green-500');
                switchBallF12.classList.add('bg-red-500');
            } else {
                toggleF12.checked = false;
                switchBallF12.style.transform = "translateX(50%)"; // Position au centre
                switchBallF12.classList.remove('bg-green-500', 'bg-red-500');
                switchBallF12.classList.add('bg-orange-500');
            }
        }

        // Mettre à jour l'état du switch au chargement
        UpSwitchF12();

        // Fonction de gestion du changement d'état
        function handleF12Switch(checkbox) {
            if (checkbox.checked) {
                setCookie('EnesCDE_ADM:F12', 'ADMIN', 7); // Expire dans 7 jours
            } else {
                setCookie('EnesCDE_ADM:F12', 'none', 7); // Expire dans 7 jours
            }
            isAdmin = getCookie('EnesCDE_ADM:F12'); // Met à jour la variable isAdmin après modification du cookie
            UpSwitchF12(); // Met à jour l'apparence du switch
        }
  //                //
 // F12 Switcher   //
//                //

  // - - - - - - - - - - //

  //                //
 // Logs Send DT   //
//                //
    // Fonction pour gérer le switch "Admin Log"
    function handleAdminLogSwitch(checkbox) {
        if (checkbox.checked) {
            localStorage.setItem('EnesCDE_ADM:Log', 'true'); // Activer la gestion des logs pour admin
        } else {
            localStorage.setItem('EnesCDE_ADM:Log', 'false'); // Désactiver la gestion des logs pour admin
        }
        updateLogSwitchState();
    }

    // Initialisation du switch basé sur le localStorage
    function updateLogSwitchState() {
        const switchBallLog = document.getElementById('switchBallLog');
        const toggleAdminLog = document.getElementById('toggleAdminLog');
        const isAdminLoggingEnabled = localStorage.getItem('EnesCDE_ADM:Log') === 'true';

        if (isAdminLoggingEnabled) {
            toggleAdminLog.checked = true;
            switchBallLog.style.transform = "translateX(100%)"; // Position à droite
            switchBallLog.classList.remove('bg-orange-500', 'bg-red-500');
            switchBallLog.classList.add('bg-green-500');
        } else {
            toggleAdminLog.checked = false;
            switchBallLog.style.transform = "translateX(0%)"; // Position à gauche
            switchBallLog.classList.remove('bg-green-500', 'bg-red-500');
            switchBallLog.classList.add('bg-orange-500');
        }
    }

    // Initialisation de l'état du switch au chargement
    updateLogSwitchState();
  //                //
 // Logs Send DT   //
//                //
