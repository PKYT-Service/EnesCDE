export function pu_ucd_ecde() {
    // Vérifie si "compris" est déjà validé
    const isAccepted = localStorage.getItem("UCD_EnesCDE") === "true";

    // Création du popup
    const popup = document.createElement("div");
    popup.className =
        "fixed bottom-12 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white dark:bg-slate-950 p-2 drop-shadow-2xl max-sm:w-11/12 transition-transform duration-500";
    popup.id = "gdpr";
    popup.innerHTML = `
        <div class="flex items-center justify-between gap-6 text-sm">
            <div class="content-left pl-4 dark:text-white">
                Ce site utilise le système Enes<mark>CDE</mark>.
                Pour en savoir plus, consultez
                <a href="https://enes-cde.vercel.app/redirect.html?LB=ECDE_UCDPS" class="text-blue-500" underline">cette page</a>.
            </div>
            <div class="content-right text-end">
                <button id="accept-btn" class="cursor-pointer rounded-full bg-black dark:bg-indigo-700 px-4 py-2 text-white">
                    Compris
                </button>
            </div>
        </div>
    `;

    // Création du bouton flottant (œil) pour rouvrir
    const toggleBtn = document.createElement("button");
    toggleBtn.className =
        "fixed bottom-6 left-6 z-50 hidden bg-black dark:bg-gray-600 text-white p-3 rounded-full transition-opacity duration-500";
    toggleBtn.innerHTML = `<svg width="10px" height="10px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 0C20.4477 0 20 0.447715 20 1V2H19C18.4477 2 18 2.44772 18 3C18 3.55228 18.4477 4 19 4H20V5C20 5.55228 20.4477 6 21 6C21.5523 6 22 5.55228 22 5V4H23C23.5523 4 24 3.55228 24 3C24 2.44772 23.5523 2 23 2H22V1C22 0.447715 21.5523 0 21 0Z" fill="#0F0F0F"></path> <path d="M22.4668 8.6169C22.297 8.09138 21.7016 7.85776 21.1936 8.07463C20.6857 8.29149 20.4525 8.87941 20.6116 9.40826C21.113 11.074 21.1224 12.8572 20.6271 14.5397C20.0373 16.5433 18.7684 18.2792 17.0383 19.4493C15.3082 20.6195 13.2247 21.1509 11.1455 20.9525C9.06631 20.754 7.121 19.8381 5.64348 18.3618C4.16596 16.8855 3.24838 14.9409 3.04821 12.8619C2.84804 10.7828 3.37778 8.69891 4.5465 6.96784C5.71522 5.23677 7.45003 3.96647 9.4532 3.37498C11.1353 2.8783 12.9184 2.88626 14.5846 3.38623C15.1136 3.54496 15.7013 3.31122 15.9178 2.80311C16.1342 2.29501 15.9001 1.69979 15.3744 1.53036C13.2759 0.853957 11.0142 0.821568 8.88488 1.4503C6.43471 2.17379 4.31277 3.72755 2.88325 5.84491C1.45373 7.96227 0.805783 10.5112 1.05062 13.0542C1.29545 15.5972 2.4178 17.9757 4.22503 19.7814C6.03225 21.5871 8.41165 22.7075 10.9548 22.9502C13.498 23.193 16.0464 22.5429 18.1626 21.1117C20.2788 19.6804 21.8308 17.5572 22.5523 15.1064C23.1792 12.9766 23.145 10.7148 22.4668 8.6169Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M13 7C14.1046 7 15 7.89543 15 9V15C15 16.1046 14.1046 17 13 17H11C9.89542 17 8.99999 16.1046 8.99999 15V9C8.99999 7.89543 9.89542 7 11 7H13ZM12 9C12.5523 9 13 9.44772 13 10V14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14V10C11 9.44772 11.4477 9 12 9Z" fill="#0F0F0F"></path> </g></svg>`;

    // Fonction pour fermer le popup
    function closePopup() {
        popup.style.transform = "translateX(-150%)"; // Glissement à gauche
        setTimeout(() => {
            popup.style.display = "none";
            toggleBtn.classList.remove("hidden");
            toggleBtn.style.opacity = "1";
            localStorage.setItem("UCD_EnesCDE", "true");
        }, 500);
    }

    // Fonction pour ouvrir le popup
    function openPopup() {
        popup.style.display = "block";
        setTimeout(() => {
            popup.style.transform = "translateX(0)"; // Réaffichage
        }, 50);
        toggleBtn.style.opacity = "0";
        setTimeout(() => toggleBtn.classList.add("hidden"), 500);
    }

    // Ajout des événements
    popup.querySelector("#accept-btn").addEventListener("click", closePopup);
    toggleBtn.addEventListener("click", openPopup);

    // Ajout au DOM
    document.body.appendChild(popup);
    document.body.appendChild(toggleBtn);

    // Si déjà accepté, masquer le popup et afficher le bouton flottant
    if (isAccepted) {
        popup.style.display = "none";
        toggleBtn.classList.remove("hidden");
    }
}
