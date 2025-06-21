document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ecde_footere").innerHTML = `
     <br><br>
<footer class="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
    <div class="border-t border-slate-900/5 dark:border-gray-700 py-10">
        <div class="flex items-center justify-center">
            <div class="flex items-center space-x-2">
                <img src="https://enes-cde.vercel.app/data/img/web/favicon.png" alt="ECDE" class="w-10 h-10 rounded-full">
                <span class="text-gray-800 dark:text-gray-200 font-medium">
                    <b>Enes - <span class="text-blue-600 dark:text-blue-400">CDE</span></b>
                </span>
            </div>
        </div>
        <p class="mt-5 text-center text-sm leading-6 text-slate-500 dark:text-gray-400">
            
        </p>
        <div class="mt-8 flex items-center justify-center space-x-4 text-sm font-semibold leading-6 text-slate-700 dark:text-gray-300">
            <a href="https://enes-cde.vercel.app/redirect.html?LB=pdc">Politique de confidentialité</a>
            <div class="h-4 w-px bg-slate-500/20 dark:bg-gray-600"></div>
            <a href="https://enes-cde.vercel.app/redirect.html?LB=discord">Discord</a>
        </div>
    `;
  });

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ecde_footer").innerHTML = `
<footer class="footer dark:bg-gray-900 bg-white  flex flex-col items-center gap-4 p-6" style="border-top-left-radius:15px; border-top-right-radius:15px;>
  <div class="flex items-center gap-2 text-xl font-bold text-base-content">
      <img src="https://enes-cde.vercel.app/data/img/web/favicon.png" style="border-radius: 10px; width: 24px; height: 24px;"
      <span>E-CDE</span>
  </div>
  <aside>
    <p>© <a id="ecde_annee_set">0000</a> <b>Enes - <a class="text-blue-800"> CDE</a></b>. Tous droits réservés.</p>
  </aside>
  <nav class="grid-flow-col gap-4">
    <a class="link link-hover text-base-content" href=""https://enes-cde.vercel.app/equipe.html>équipe</a>
    <a class="link link-hover text-base-content" href="#dev">Help</a>
    <a class="link link-hover text-base-content" href="https://enes-cde.vercel.app/redirect.html?LB=pdc">Politique de confidentialité</a>
    <a class="link link-hover text-base-content" href="https://enes-cde.vercel.app/redirect.html?LB=discord">Discord</a>
  </nav>
  <div class="flex h-5 gap-4">
    <a href="https://github.com/PKYT-Service/" class="link text-base-content" aria-label="Github Link">
      <span class="icon-[tabler--brand-github-filled] size-5"></span>
    </a>
    <a href="https://enes-cde.vercel.app/" class="link text-base-content" aria-label="Google Link">
      <span class="icon-[tabler--brand-google-filled] size-5"></span>
    </a>
  </div>
</footer>
    `;
  });


