export function ECDE_Console() {
  const isConsoleEnabled = localStorage.getItem("EnesCDE_ADM:CSL") === "true";
  if (!isConsoleEnabled) return;

  // Inject Tailwind
  const tailwind = document.createElement("script");
  tailwind.src = "https://cdn.tailwindcss.com";
  document.head.appendChild(tailwind);

  // Fallback au cas où onload ne se déclenche pas
  setTimeout(() => {
    if (!document.getElementById("openConsole")) {
      console.warn("Fallback : initialisation manuelle de la console.");
      initConsole();
    }
  }, 1000);

  // Si le script est bien chargé
  tailwind.onload = () => {
    console.log("Tailwind chargé !");
    initConsole();
  };

  function initConsole() {
    // Styles personnalisés
    const style = document.createElement("style");
    style.textContent = `
      .slide-in {
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
      }
      .slide-in.open {
        transform: translateX(0%);
      }
    `;
    document.head.appendChild(style);

    // Bouton pour ouvrir la console
    const btn = document.createElement("div");
    btn.id = "openConsole";
    btn.className =
      "fixed top-1/2 right-0 transform -translate-y-1/2 rotate-90 origin-bottom-right z-50 cursor-pointer";
    btn.innerHTML = `
      <span class="bg-black text-white px-4 py-2 rounded-t-lg shadow-lg text-lg font-semibold tracking-wide">
        Console
      </span>
    `;
    document.body.appendChild(btn);

    // Panneau console
    const panel = document.createElement("div");
    panel.id = "consolePanel";
    panel.className =
      "fixed top-0 right-0 w-1/2 h-full bg-gray-900 slide-in flex flex-col z-40 shadow-lg";
    panel.innerHTML = `
      <div class="flex justify-between items-center px-4 py-2 border-b border-gray-700">
        <h2 class="text-xl font-bold text-white">Console Output</h2>
        <button id="closeConsole" class="text-gray-400 hover:text-white text-lg font-bold">×</button>
      </div>
      <div id="logOutput" class="flex-1 overflow-y-auto p-4 space-y-1 text-sm text-white"></div>
      <div class="border-t border-gray-700 p-2">
        <input id="commandInput" type="text" placeholder="Tape ta commande ici..." class="w-full p-2 rounded bg-gray-800 text-white outline-none" />
      </div>
    `;
    document.body.appendChild(panel);

    const logOutput = panel.querySelector("#logOutput");
    const input = panel.querySelector("#commandInput");

    const appendLog = (type, message) => {
      const div = document.createElement("div");
      div.textContent = `[${type.toUpperCase()}] ${message}`;
      div.className =
        type === "error"
          ? "text-red-400"
          : type === "warn"
          ? "text-yellow-400"
          : "text-green-400";
      logOutput.appendChild(div);
      logOutput.scrollTop = logOutput.scrollHeight;
    };

    ["log", "warn", "error"].forEach((type) => {
      const original = console[type];
      console[type] = function (...args) {
        appendLog(type, args.join(" "));
        original.apply(console, args);
      };
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = input.value;
        try {
          const result = eval(cmd);
          console.log(result);
        } catch (err) {
          console.error(err);
        }
        input.value = "";
      }
    });

    document.getElementById("openConsole").onclick = () =>
      panel.classList.add("open");
    document.getElementById("closeConsole").onclick = () =>
      panel.classList.remove("open");
  }
}
