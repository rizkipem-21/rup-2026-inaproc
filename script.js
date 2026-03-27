async function loadData() {
    try {
        const response = await fetch("data/rekap.json");

        if (!response.ok) {
            throw new Error("Gagal load data");
        }

        const data = await response.json();

        console.log("Data:", data);

        if (!data || data.length === 0) {
            document.getElementById("output").innerText = "Data kosong";
            return;
        }

        // tampilkan tabel sederhana
        let html = "<table border='1' cellpadding='5'>";
        html += "<tr>";

        // header
        Object.keys(data[0]).forEach(key => {
            html += `<th>${key}</th>`;
        });

        html += "</tr>";

        // isi data
        data.forEach(item => {
            html += "<tr>";
            Object.values(item).forEach(val => {
                html += `<td>${val}</td>`;
            });
            html += "</tr>";
        });

        html += "</table>";

        document.getElementById("output").innerHTML = html;

    } catch (error) {
        console.error(error);
        document.getElementById("output").innerText = "ERROR: " + error;
    }
}

loadData();