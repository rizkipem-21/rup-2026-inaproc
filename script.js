async function loadData() {
    try {
        console.log("Mulai fetch...");

        const response = await fetch("data/rekap.json");

        if (!response.ok) {
            throw new Error("Gagal load data");
        }

        const data = await response.json();

        console.log("Data:", data);

        const output = document.getElementById("output");

        // DEBUG KUNCI
        console.log("Element output:", output);

        if (!output) {
            alert("ERROR: element #output tidak ditemukan di HTML!");
            return;
        }

        if (!data || data.length === 0) {
            output.innerText = "Data kosong";
            return;
        }

        let html = "<table border='1' cellpadding='5' cellspacing='0'>";
        html += "<tr>";

        Object.keys(data[0]).forEach(key => {
            html += `<th>${key}</th>`;
        });

        html += "</tr>";

        data.forEach(item => {
            html += "<tr>";
            Object.values(item).forEach(val => {
                html += `<td>${val}</td>`;
            });
            html += "</tr>";
        });

        html += "</table>";

        output.innerHTML = html;

    } catch (error) {
        console.error("ERROR:", error);

        const output = document.getElementById("output");
        if (output) {
            output.innerText = "ERROR LOAD DATA\n" + error;
        }
    }
}

// PASTIKAN HTML SUDAH LOAD
window.onload = loadData;