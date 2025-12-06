// Vérifie les conditions d'accès
function Check_ConditionDaccesService() {
    const rulesAccepted = localStorage.getItem('rules') === 'true';

    // Affiche le popup seulement si rules n'existe pas
    if (!rulesAccepted) {
        createPopup();
    }
}

// Message flottant en bas
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
    setTimeout(() => reminder.remove(), 10000);
}

// Bloque l’arrière-plan
function disableInteraction() {
    let overlay = document.createElement('div');
    overlay.id = "popup-overlay";
    overlay.className = "fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm";
    overlay.style.zIndex = "9998";
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
}

function enableInteraction() {
    let overlay = document.getElementById("popup-overlay");
    if (overlay) overlay.remove();
    document.body.style.overflow = "auto";
}

// Crée le popup principal
function createPopup() {
    let popup = document.createElement('div');
    popup.setAttribute('role', 'alert');
    popup.className = 'rounded-xl border p-4 shadow-2xl backdrop-blur-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.zIndex = '9999';
    popup.style.width = '360px';
    popup.style.maxHeight = '80vh';
    popup.style.overflowY = 'auto';

    popup.innerHTML = `
        <div class="flex flex-col gap-4 p-5 text-center">
            <div class="mx-auto w-14 h-14 bg-blue-600/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M12 9v3.75m-9.3 3.38c-.87 1.5.22 3.38 1.95 3.38h14.7c1.73 0 2.82-1.88 1.95-3.38L13.95 3.38c-.87-1.5-3.03-1.5-3.9 0L2.7 16.13zM12 15.75h.01v.01H12v-.01z"/>
                </svg>
            </div>

            <div>
                <h2 class="font-bold text-lg text-gray-900 dark:text-gray-100">Accès Protégé SLPECDE</h2>
                <p class="text-xs text-gray-500 dark:text-gray-400 -mt-1">Conditions d’utilisation</p>
            </div>

            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Pour utiliser les services officiels ou affiliés, vous devez accepter
                les conditions d’accès liées à la technologie <strong>SLPECDE</strong>.
            </p>

            <a href="#" id="open-conditions" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Voir les conditions complètes
            </a>

            <div id="conditions-container" class="hidden text-left text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1 max-h-64 overflow-y-auto border-t border-gray-200 dark:border-gray-700 pt-2">
                <p>1. SLPECDE protège l’accès aux sites officiels et affiliés.</p>
                <p>2. Les utilisateurs doivent accepter les conditions pour naviguer.</p>
                <p>3. Les données sont synchronisées pour un usage sécurisé.</p>
                <p>4. Le système applique des vérifications et un contrôle de sécurité.</p>
                <p>5. Les comptes ou identifiants non conformes sont restreints.</p>
                <p>6. Le refus des conditions empêche l’accès aux services.</p>
            </div>

            <label class="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-300 mt-2">
                <input type="checkbox" id="terms-checkbox" class="h-4 w-4 accent-blue-600 dark:accent-blue-400" disabled>
                J’ai lu et compris.
            </label>

            <div class="flex justify-center gap-3 mt-3">
                <button id="refuse-terms-btn"
                        class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-400 dark:border-gray-600
                               text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    Refuser
                </button>

                <button id="accept-terms-btn"
                    class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-400 text-white cursor-not-allowed
                           transition-colors"
                    style="pointer-events: none;">
                    Accepter
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);
    disableInteraction();

    let acceptBtn = document.getElementById("accept-terms-btn");
    let checkbox = document.getElementById("terms-checkbox");
    let conditionsContainer = document.getElementById("conditions-container");
    let openConditionsLink = document.getElementById("open-conditions");

    // Activation du checkbox après 5 secondes
    setTimeout(() => {
        checkbox.disabled = false;
    }, 5000);

    // Checkbox
    checkbox.addEventListener("change", () => {
        const active = checkbox.checked;
        acceptBtn.style.pointerEvents = active ? "auto" : "none";
        acceptBtn.classList.toggle("bg-gray-400", !active);
        acceptBtn.classList.toggle("cursor-not-allowed", !active);
        acceptBtn.classList.toggle("bg-indigo-600", active);
        acceptBtn.classList.toggle("hover:bg-indigo-700", active);
    });

    // Acceptation
    acceptBtn.addEventListener("click", () => {
        if (!checkbox.checked) return;
        localStorage.setItem('rules', 'true');
        popup.remove();
        enableInteraction();
    });

    // Refus
    document.getElementById('refuse-terms-btn').addEventListener('click', () => {
        alert("Sans accepter, vous ne pourrez pas accéder et utiliser les services.");
        window.location.href = "https://www.google.com";
    });

    // Affiche ou masque les conditions dans le même popup
    openConditionsLink.addEventListener("click", (e) => {
        e.preventDefault();
        conditionsContainer.classList.toggle("hidden");
        conditionsContainer.scrollIntoView({ behavior: "smooth" });
    });
}

// Fonction principale exportable
export function CheckRulesToAcces() {
    Check_ConditionDaccesService();
}
