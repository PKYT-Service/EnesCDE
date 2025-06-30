document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ecde:mails").innerHTML = ` 
    <script src="https://enes-cde.vercel.app/data/api/@MSG-A@-mails.js"></script>
  <div class="max-w-3xl mx-auto p-4 flex flex-col flex-grow">
    <h1 class="text-2xl font-bold mb-4 text-center">Messagerie ECDE</h1>

    <div id="chatBox" class="flex flex-col flex-grow bg-white rounded-md shadow p-4 overflow-y-auto space-y-3 mb-4 max-h-[60vh]">
      <!-- Messages s'affichent ici -->
      <p id="loading" class="text-center text-gray-400">Chargement des messages...</p>
    </div>

    <form id="sendForm" class="flex gap-2">
      <input
        id="destInput"
        type="email"
        placeholder="Destinataire (email)"
        class="flex-shrink-0 w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        id="msgInput"
        type="text"
        placeholder="Votre message"
        class="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Envoyer
      </button>
    </form>
  </div>
  `
