function createPopup() {
    let popup = document.createElement('div');
    popup.className = 'card green';
    popup.style.position = 'fixed';
    popup.style.bottom = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, 50%)';
    popup.style.zIndex = '9999';

    popup.innerHTML = `
        <div class="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="close" id="refuse-terms-btn">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </div>
        <div class="card-body">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
            </svg>
            <div>
                <h3>Conditions d'utilisation requises</h3>
                <p>Les nouvelles conditions PKYT-Service s'appliquent sur les sites officiels et affiliés.</p>
                <p><a href="https://doc-pkyt-use.vercel.app/forum_pkyt/#conditions" target="_blank" style="color:#2eea9d;text-decoration:underline;">Voir les conditions officielles</a></p>
                <label class="flex items-center mt-2 text-sm" style="color:#ccc;">
                    <input type="checkbox" id="terms-checkbox" class="mr-2" disabled>
                    J'ai lu et j'accepte les conditions d'utilisation.
                </label>
            </div>
        </div>
        <div class="progress">
            <a id="accept-terms-btn" class="btn-first" style="pointer-events: none; opacity: 0.5;">Accepter</a>
            <a href="#" class="btn-second" id="refuse-terms-btn-2">Refuser</a>
        </div>
    `;

    document.body.appendChild(popup);
    disableInteraction();

    let acceptBtn = document.getElementById("accept-terms-btn");
    let checkbox = document.getElementById("terms-checkbox");

    // Activer la checkbox après 5 secondes
    setTimeout(() => {
        console.log("Checkbox activée.");
        checkbox.disabled = false;
    }, 5000);

    // Gestion du changement de checkbox
    checkbox.addEventListener("change", function () {
        const checked = checkbox.checked;
        acceptBtn.style.pointerEvents = checked ? "auto" : "none";
        acceptBtn.style.opacity = checked ? "1" : "0.5";
    });

    // Accepter
    acceptBtn.addEventListener("click", function () {
        if (checkbox.checked) {
            localStorage.setItem('rules', 'true');
            popup.remove();
            enableInteraction();
        }
    });

    // Refuser
    document.getElementById("refuse-terms-btn").addEventListener("click", () => {
        alert("Vous devez accepter les conditions pour continuer.");
        window.location.href = "https://www.google.com";
    });

    document.getElementById("refuse-terms-btn-2").addEventListener("click", () => {
        alert("Vous devez accepter les conditions pour continuer.");
        window.location.href = "https://www.google.com";
    });
}
