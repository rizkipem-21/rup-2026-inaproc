let data = [];
let filteredData = [];

// format rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID").format(angka || 0);
}

// load JSON lokal
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

// render tabel
function renderTable() {
    const tbody = document.getElementById("tableBody");

    tbody.innerHTML = filteredData.map(row => `
        <tr class="border-b table-row-hover">
            <td class="p-3">${row["Satuan Kerja"]}</td>
            <td class="p-3 text-right">${formatRupiah(row["Pagu Program"])}</td>
            <td class="p-3 text-right text-green-600">${formatRupiah(row["RUP Penyedia"])}</td>
            <td class="p-3 text-right text-blue-600">${formatRupiah(row["RUP Swakelola"])}</td>
            <td class="p-3 text-right font-bold">${formatRupiah(row["Total RUP Terumumkan"])}</td>
            <td class="p-3 text-right font-bold">${row["Persentase"].toFixed(2)}%</td>
        </tr>
    `).join("");
}

// render summary
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

// search
document.addEventListener("DOMContentLoaded", () => {
    loadData();

    document.getElementById("searchInput").addEventListener("input", function(e) {
        const keyword = e.target.value.toLowerCase();

        filteredData = data.filter(row =>
            row["Satuan Kerja"].toLowerCase().includes(keyword)
        );

        renderTable();
        renderSummary();
    });
});