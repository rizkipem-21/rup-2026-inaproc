// ==========================
// LOAD DATA RUP
// ==========================

async function loadData() {
    try {
        console.log("Fetch mulai...");

        const response = await fetch("data/rekap.json");

        if (!response.ok) {
            throw new Error("Gagal fetch data");
        }

        const data = await response.json();

        console.log("Data berhasil:", data);

        // ==========================
        // TAMPILKAN DATA
        // ==========================
        if (!data || data.length === 0) {
            document.getElementById("output").innerText = "Data kosong";
            return;
        }

        // tampilkan sebagai JSON rapi
        document.getElementById("output").innerText =
            JSON.stringify(data, null, 2);

    } catch (error) {
        console.error("ERROR:", error);

        document.getElementById("output").innerText =
            "ERROR LOAD DATA\n\n" + error;
    }
}

// ==========================
// JALANKAN
// ==========================
loadData();
