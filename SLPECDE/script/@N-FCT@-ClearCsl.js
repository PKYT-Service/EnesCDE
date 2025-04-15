export function CO_Cleaner_ecde() {
    const originalWarn = console.warn; // Sauvegarde la fonction originale

    console.warn = () => {}; // Désactive temporairement les warnings

    setTimeout(() => {
        console.warn = originalWarn; // Restaure la fonction après un court délai
    }, 100);
}
