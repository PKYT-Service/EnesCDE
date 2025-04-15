export function CheckTabsOpenLimit() {
    const MAX_TABS = 5;
    const channel = new BroadcastChannel("tab_channel");
    let openTabs = 0;

    function notify(message) {
        channel.postMessage(message);
    }

    function showSecurityWarning() {
        document.body.style.backgroundColor = "#320900";
        document.body.style.color = "white";
        document.body.style.display = "flex";
        document.body.style.justifyContent = "center";
        document.body.style.alignItems = "center";
        document.body.style.height = "100vh";
        document.body.style.margin = "0";
        document.body.innerHTML = `
            <h1 style="font-family: Arial, sans-serif; text-align: center;">
                <b>PKYT - <i><font color="blue">Secure</font></i></b>
            </h1>`;
    }

    function openTab() {
        localStorage.setItem("open_tabs", (parseInt(localStorage.getItem("open_tabs")) || 0) + 1);
        openTabs = parseInt(localStorage.getItem("open_tabs"));
        if (openTabs > MAX_TABS) {
            notify("Limite atteinte : un nouvel onglet a été ouvert !");
            alert("Vous avez atteint la limite d'onglets ouverts.");
            showSecurityWarning();
            closeTab();
            window.close();
        }
    }

    function closeTab() {
        const currentTabs = parseInt(localStorage.getItem("open_tabs")) || 0;
        localStorage.setItem("open_tabs", Math.max(0, currentTabs - 1));
        notify("Un onglet a été fermé.");
    }

    window.onload = function () {
        openTab();
    };

    window.onbeforeunload = function () {
        closeTab();
    };

    channel.onmessage = function (event) {
        console.log("Notification reçue :", event.data);
    };
}
