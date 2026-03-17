async function loadData() {
    try {
        const penyedia = await fetch("data/Legacy_paket-penyedia-terumumkan_2026.json").then(r => r.json());
        const swakelola = await fetch("data/Legacy_paket-swakelola-terumumkan_2026.json").then(r => r.json());

        console.log("Penyedia:", penyedia);
        console.log("Swakelola:", swakelola);

        document.getElementById("output").innerText =
            "Penyedia: " + penyedia.length + " data\n" +
            "Swakelola: " + swakelola.length + " data";

    } catch (error) {
        console.error("Error:", error);
    }
}

loadData();
