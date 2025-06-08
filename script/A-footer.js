document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ecde_footer").innerHTML = `
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
            © <a id="ecde_annee_set">0000</a> Enes - CDE. Tous droits réservés.
        </p>
        <div class="mt-8 flex items-center justify-center space-x-4 text-sm font-semibold leading-6 text-slate-700 dark:text-gray-300">
            <a href="https://enes-cde.vercel.app/redirect.html?LB=pdc">Politique de confidentialité</a>
            <div class="h-4 w-px bg-slate-500/20 dark:bg-gray-600"></div>
            <a href="https://enes-cde.vercel.app/redirect.html?LB=discord">Discord</a>
        </div>
    `;
  });


