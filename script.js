let data = [];
let filteredData = [];

// format angka
function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID").format(angka || 0);
}

// LOAD DATA
async function loadData() {
    try {
        const response = await fetch("data/rekap.json");
        const result = await response.json();

        data = result;
        filteredData = [...data];

        renderTable();
        renderSummary();

    } catch (error) {
        console.error("ERROR:", error);
    }
}

// RENDER TABLE
function renderTable() {
    const tbody = document.getElementById("tableBody");

    tbody.innerHTML = filteredData.map(row => `
        <tr class="border-b table-row-hover">
            <td class="p-3">${row["Satuan Kerja"]}</td>
            <td class="p-3 text-right">${formatRupiah(row["Pagu Program"])}</td>
            <td class="p-3 text-right text-green-600">${formatRupiah(row["RUP Penyedia"])}</td>
            <td class="p-3 text-right text-blue-600">${formatRupiah(row["RUP Swakelola"])}</td>
            <td class="p-3 text-right font-bold">${formatRupiah(row["Total RUP Terumumkan"])}</td>
            <td class="p-3 text-right font-bold ${
                row["Persentase"] >= 90 ? "text-green-600" :
                row["Persentase"] < 50 ? "text-red-600" :
                "text-yellow-600"
            }">${row["Persentase"].toFixed(2)}%</td>
        </tr>
    `).join("");
}

// SUMMARY
function renderSummary() {
    const total = filteredData.length;

    const totalRup = filteredData.reduce((sum, row) =>
        sum + (row["Total RUP Terumumkan"] || 0), 0);

    const avg = filteredData.reduce((sum, row) =>
        sum + (row["Persentase"] || 0), 0) / total;

    document.getElementById("summaryCards").innerHTML = `
        <div class="bg-white p-4 rounded shadow">
            <p>Total Satker</p>
            <h2 class="text-xl font-bold">${total}</h2>
        </div>

        <div class="bg-white p-4 rounded shadow">
            <p>Total RUP</p>
            <h2 class="text-xl font-bold">${formatRupiah(totalRup)}</h2>
        </div>

        <div class="bg-white p-4 rounded shadow">
            <p>Rata-rata %</p>
            <h2 class="text-xl font-bold">${avg.toFixed(2)}%</h2>
        </div>
    `;
}

// FILTER LOGIC (SEPERTI EXCEL)
function applyFilters() {
    const nama = document.getElementById("filterNama").value.toLowerCase();
    const pagu = parseFloat(document.getElementById("filterPagu").value) || 0;
    const penyedia = parseFloat(document.getElementById("filterPenyedia").value) || 0;
    const swakelola = parseFloat(document.getElementById("filterSwakelola").value) || 0;
    const total = parseFloat(document.getElementById("filterTotal").value) || 0;
    const persen = parseFloat(document.getElementById("filterPersen").value) || 0;

    filteredData = data.filter(row => {
        return (
            row["Satuan Kerja"].toLowerCase().includes(nama) &&
            row["Pagu Program"] >= pagu &&
            row["RUP Penyedia"] >= penyedia &&
            row["RUP Swakelola"] >= swakelola &&
            row["Total RUP Terumumkan"] >= total &&
            row["Persentase"] >= persen
        );
    });

    renderTable();
    renderSummary();
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
    loadData();

    document.querySelectorAll("thead input").forEach(input => {
        input.addEventListener("input", applyFilters);
    });
});