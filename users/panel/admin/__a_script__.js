  //                //
 // F12 Switcher   //
//                //
// Fonction pour définir une valeur dans localStorage
function setLocalStorage(name, value) {
    localStorage.setItem(name, value);
}

// Fonction pour récupérer une valeur depuis localStorage
function getLocalStorage(name) {
    return localStorage.getItem(name);
}

// Récupérer le switch et l'élément de la "boule"
const switchBallF12 = document.getElementById('switchBallF12');
const toggleF12 = document.getElementById('toggleF12');
let isAdmin = getLocalStorage('EnesCDE_ADM:F12');

// Initialisation du switch en fonction de la valeur stockée
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
        setLocalStorage('EnesCDE_ADM:F12', 'ADMIN');
    } else {
        setLocalStorage('EnesCDE_ADM:F12', 'none');
    }
    isAdmin = getLocalStorage('EnesCDE_ADM:F12'); // Met à jour la variable isAdmin après modification
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
            switchBallLog.classList.remove('bg-red-500', 'bg-red-500');
            switchBallLog.classList.add('bg-green-500');
        } else {
            toggleAdminLog.checked = false;
            switchBallLog.style.transform = "translateX(0%)"; // Position à gauche
            switchBallLog.classList.remove('bg-green-500', 'bg-red-500');
            switchBallLog.classList.add('bg-red-500');
        }
    }

    // Initialisation de l'état du switch au chargement
    updateLogSwitchState();
  //                //
 // Logs Send DT   //
//                //

  //                //
 // Refresh 1      //
//                //
// Fonction pour définir une valeur dans localStorage
function setLocalStorage(name, value) {
    localStorage.setItem(name, value);
}

// Fonction pour récupérer une valeur depuis localStorage
function getLocalStorage(name) {
    return localStorage.getItem(name);
}

// Récupérer le switch et l'élément de la "boule"
const switchBallRef = document.getElementById('switchBallRef');
const toggleRefresh = document.getElementById('toggleAdminRefresh');

// Initialisation du switch en fonction de la valeur stockée
function UpSwitchRefresh() {
    let isRefresh = getLocalStorage('EnesCDE_ADM:Refresh'); // Récupère la dernière valeur stockée

    if (isRefresh === "true") {
        toggleAdminRef.checked = true;
        switchBallRef.style.transform = "translateX(100%)"; // Position à droite
        switchBallRef.classList.remove('bg-orange-500', 'bg-red-500');
        switchBallRef.classList.add('bg-green-500');

        // Active le rafraîchissement automatique si true
        setTimeout(() => {
            location.reload();
        }, 60000);
        
    } else if (isRefresh === "false") {
        toggleAdminRef.checked = false;
        switchBallRef.style.transform = "translateX(0%)"; // Position à gauche
        switchBallRef.classList.remove('bg-orange-500', 'bg-green-500');
        switchBallRef.classList.add('bg-red-500');
    } else {
        toggleAdminRef.checked = false;
        switchBallRef.style.transform = "translateX(50%)"; // Position au centre
        switchBallRef.classList.remove('bg-green-500', 'bg-red-500');
        switchBallRef.classList.add('bg-orange-500');
    }
}

// Fonction de gestion du changement d'état
function handleAdminRefSwitch(checkbox) {
    if (checkbox.checked) {
        setLocalStorage('EnesCDE_ADM:Refresh', 'true');
    } else {
        setLocalStorage('EnesCDE_ADM:Refresh', 'false');
    }
    UpSwitchRefresh(); // Met à jour l'apparence du switch après modification
}

// Exécuter UpSwitchRefresh après le chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    UpSwitchRefresh(); 
});
  //                //
 // Refresh 1      //
//                //

  //                //
 // Rules Secure   //
//                //
// Fonction pour définir une valeur dans localStorage
function setLocalStorage(name, value) {
    localStorage.setItem(name, value);
}

// Fonction pour récupérer une valeur depuis localStorage
function getLocalStorage(name) {
    return localStorage.getItem(name);
}

// Fonction pour supprimer une clé du localStorage
function removeLocalStorage(name) {
    localStorage.removeItem(name);
}

// Récupérer le switch et l'élément de la "boule"
const switchBallRPE = document.getElementById('switchBallRPE');
const toggleRPE = document.getElementById('toggleAdminRPE');

// Initialisation du switch en fonction des valeurs stockées
function UpSwitchRPE() {
    let isRules = getLocalStorage('rules');
    let isEnesRPE = getLocalStorage('EnesCDE_ADM:RPE');

    if (isRules === "true") {
        toggleRPE.checked = true;
        switchBallRPE.style.transform = "translateX(100%)"; // Position à droite
        switchBallRPE.classList.remove('bg-orange-500', 'bg-red-500');
        switchBallRPE.classList.add('bg-green-500');

    } else if (isEnesRPE === "true") {
        toggleRPE.checked = false;
        switchBallRPE.style.transform = "translateX(0%)"; // Position à gauche
        switchBallRPE.classList.remove('bg-orange-500', 'bg-green-500');
        switchBallRPE.classList.add('bg-red-500');

    } else {
        toggleRPE.checked = false;
        switchBallRPE.style.transform = "translateX(50%)"; // Position au centre
        switchBallRPE.classList.remove('bg-green-500', 'bg-red-500');
        switchBallRPE.classList.add('bg-orange-500');
    }
}

// Fonction de gestion du changement d'état
function handleAdminRPESwitch(checkbox) {
    if (checkbox.checked) {
        setLocalStorage('rules', 'true'); // Active "rules"
        removeLocalStorage('EnesCDE_ADM:RPE'); // Supprime "EnesCDE_ADM:RPE"
    } else {
        setLocalStorage('EnesCDE_ADM:RPE', 'true'); // Active "EnesCDE_ADM:RPE"
        removeLocalStorage('rules'); // Supprime "rules"
    }
    UpSwitchRPE(); // Met à jour l'affichage
}

// Exécuter UpSwitchRPE après le chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    UpSwitchRPE();
});

  //                //
 // Rules Secure   //
//                //
