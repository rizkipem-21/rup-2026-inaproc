async function loadData() {
    try {
        console.log("Fetch mulai...");

        const response = await fetch("data/rekap.json");

        if (!response.ok) {
            throw new Error("Gagal load data");
        }

        const data = await response.json();

        console.log("Data:", data);

        if (!data || data.length === 0) {
            document.getElementById("info").innerText = "Data kosong";
            return;
        }

        // ==========================
        // HEADER TABLE
        // ==========================
        const tableHead = document.getElementById("tableHead");
        tableHead.innerHTML = "";

        Object.keys(data[0]).forEach(key => {
            tableHead.innerHTML += `
                <th class="px-4 py-3 font-semibold">${key}</th>
            `;
        });

        // ==========================
        // BODY TABLE
        // ==========================
        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        data.forEach(row => {
            let tr = "<tr class='hover:bg-gray-50'>";

            Object.values(row).forEach(val => {
                tr += `<td class="px-4 py-2">${formatValue(val)}</td>`;
            });

            tr += "</tr>";

            tableBody.innerHTML += tr;
        });

        // ==========================
        // INFO
        // ==========================
        document.getElementById("info").innerText =
            `Total Data: ${data.length}`;

    } catch (error) {
        console.error("ERROR:", error);

        document.getElementById("info").innerText =
            "ERROR LOAD DATA: " + error;
    }
}

// ==========================
// FORMAT ANGKA (RUPIAH)
// ==========================
function formatValue(val) {
    if (typeof val === "number") {
        return new Intl.NumberFormat("id-ID").format(val);
    }
    return val;
}

// ==========================
// JALANKAN
// ==========================
loadData();