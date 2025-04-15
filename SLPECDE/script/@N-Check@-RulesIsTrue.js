// Fonction pour vérifier les conditions d'accès
function Check_ConditionDaccesService() {
    const rulesAccepted = localStorage.getItem('rules') === 'true';
    const EnesCDE_ADM_RPE = localStorage.getItem('EnesCDE_ADM:RPE');
    
    if (EnesCDE_ADM_RPE === 'false') {
        localStorage.removeItem('EnesCDE_ADM:RPE');
    }
    
    if (!EnesCDE_ADM_RPE && !rulesAccepted) {
        createPopup();
    } else if (EnesCDE_ADM_RPE === 'true' && !rulesAccepted) {
        showFloatingReminder("[RAPPEL 01] Vous n'avez pas accepté les CDT .");
    } else if (EnesCDE_ADM_RPE === 'true' && rulesAccepted) {
        showFloatingReminder("[RAPPEL] Vous êtes en mode Admin .");
    }
}

// Fonction pour afficher un message flottant
function showFloatingReminder(message) {
    let reminder = document.createElement('span');
    reminder.className = "inline-flex items-center justify-center rounded-full border border-red-500 px-2.5 py-0.5 text-red-700 dark:text-red-100 fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 shadow-lg";
    reminder.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-ms-1 me-1.5 size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p class="text-sm whitespace-nowrap"> <mark>${message}</mark></p>
    `;
    document.body.appendChild(reminder);
    setTimeout(() => {
        reminder.remove();
    }, 10000);
}

// Fonction pour bloquer la navigation hors du popup
function disableInteraction() {
    let overlay = document.createElement('div');
    overlay.id = "popup-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "9998";

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
}

function enableInteraction() {
    let overlay = document.getElementById("popup-overlay");
    if (overlay) {
        document.body.removeChild(overlay);
    }
    document.body.style.overflow = "auto";
}

// Fonction pour créer le popup
function createPopup() {
    let popup = document.createElement('div');
    popup.setAttribute('role', 'alert');
    popup.className = 'rounded-xl border bg-white dark:bg-gray-900 p-4 shadow-lg';
    popup.style.position = 'fixed';
    popup.style.bottom = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, 50%)';
    popup.style.zIndex = '9999';
    popup.style.width = '300px';

    popup.innerHTML = `
        <div class="flex items-start gap-4 dark:bg-gray-900 p-4 rounded-lg">
            <span class="text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </span>
            <div class="flex-1">
                <strong class="block font-medium text-gray-900 dark:text-gray-100">
                    PKYT - Service by <u>Enes-CDE</u>
                </strong>
                <p class="mt-1 text-sm text-gray-700 dark:text-gray-400">
                    Les nouvelles conditions PKYT-Service s'appliquent désormais sur les sites officiels / affiliés.
                </p>
                <p>
                    <a href="https://doc-pkyt-use.vercel.app/forum_pkyt/#conditions" class="text-indigo-600 dark:text-indigo-400 hover:underline">
                        Cliquer ici pour voir les conditions [ Catégorie : Conditions > Lien ; PKYT / affilié ]
                    </a>
                </p>
                <label class="flex items-center mt-3 text-sm text-gray-700 dark:text-gray-400">
                    <input type="checkbox" id="terms-checkbox" class="mr-2" disabled>
                    J'ai lu et compris les conditions d'utilisation.
                </label>
                <div class="mt-4 flex gap-2">
                    <a id="accept-terms-btn" class="inline-flex items-center gap-2 rounded-lg bg-gray-400 px-4 py-2 text-white cursor-not-allowed" style="pointer-events: none;">
                        <span class="text-sm">Accepter</span>
                    </a>
                    <button id="refuse-terms-btn" class="block rounded-lg px-4 py-2 text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                        <span class="text-sm">Refuser</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);
    disableInteraction();

    let acceptBtn = document.getElementById("accept-terms-btn");
    let checkbox = document.getElementById("terms-checkbox");

    setTimeout(() => {
        checkbox.disabled = false;
    }, 5000);

    checkbox.addEventListener("change", function () {
        acceptBtn.style.pointerEvents = checkbox.checked ? "auto" : "none";
        acceptBtn.classList.toggle("bg-gray-400", !checkbox.checked);
        acceptBtn.classList.toggle("cursor-not-allowed", !checkbox.checked);
        acceptBtn.classList.toggle("bg-indigo-600", checkbox.checked);
        acceptBtn.classList.toggle("hover:bg-indigo-700", checkbox.checked);
    });

    acceptBtn.addEventListener("click", function () {
        if (checkbox.checked) {
            localStorage.setItem('rules', 'true');
            document.body.removeChild(popup);
            enableInteraction();
        }
    });

    document.getElementById('refuse-terms-btn').addEventListener('click', () => {
        alert("Sans accepter, vous ne pourrez pas accéder et utiliser les sites officiels ou affiliés.");
        window.location.href = "https://www.google.com";
    });
}

// Fonction principale appelée par mains.js
export function CheckRulesToAcces() {
    ConditionDaccesService();
}
