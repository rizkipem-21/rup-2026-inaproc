let data = [];

// ==============================
// LOAD DATA (WITH DEBUG)
// ==============================
async function loadData() {
    try {
        console.log("🔄 Mulai fetch data...");

        const url = "./data/rekap.json";
        console.log("📂 URL:", url);

        const res = await fetch(url);

        console.log("📡 Response status:", res.status);
        console.log("📡 Response ok:", res.ok);

        if (!res.ok) {
            throw new Error("Gagal fetch JSON. Status: " + res.status);
        }

        const text = await res.text();
        console.log("📄 Raw response:", text.substring(0, 200)); // tampilkan 200 karakter awal

        const json = JSON.parse(text);
        console.log("✅ JSON berhasil di-parse:", json);

        data = json;

        if (!data || data.length === 0) {
            document.getElementById("tableBody").innerHTML =
                `<tr><td colspan="6" class="text-center text-red-500 p-4">Data kosong</td></tr>`;
            return;
        }

        renderTable();
        renderSummary();
        renderChart();

    } catch (err) {
        console.error("❌ ERROR LOAD DATA:", err);

        document.getElementById("tableBody").innerHTML =
            `<tr><td colspan="6" class="text-center text-red-600 p-4">
                ERROR LOAD DATA<br><br>${err}
            </td></tr>`;
    }
}

// ==============================
// RENDER TABLE
// ==============================
function renderTable() {
    const tbody = document.getElementById("tableBody");

    tbody.innerHTML = data.map(r => `
        <tr class="border-b">
            <td class="px-4 py-2">${r["Satuan Kerja"] || "-"}</td>
            <td class="px-4 py-2 text-right">${formatRupiah(r["Pagu Program"])}</td>
            <td class="px-4 py-2 text-right">${formatRupiah(r["RUP Penyedia"])}</td>
            <td class="px-4 py-2 text-right">${formatRupiah(r["RUP Swakelola"])}</td>
            <td class="px-4 py-2 text-right">${formatRupiah(r["Total RUP Terumumkan"])}</td>
            <td class="px-4 py-2 text-right">${r["Persentase"] || 0}%</td>
        </tr>
    `).join("");
}

// ==============================
// SUMMARY
// ==============================
function renderSummary() {
    const totalSatker = data.length;
    const totalRUP = data.reduce((a,b)=>a+(b["Total RUP Terumumkan"]||0),0);

    document.getElementById("summary").innerHTML = `
        <div class="bg-white p-4 shadow rounded">Total Satker: ${totalSatker}</div>
        <div class="bg-white p-4 shadow rounded">Total RUP: ${formatRupiah(totalRUP)}</div>
    `;
}

// ==============================
// CHART
// ==============================
function renderChart() {
    const ctx = document.getElementById("chartRUP");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map(d => d["Satuan Kerja"]),
            datasets: [{
                label: "Total RUP",
                data: data.map(d => d["Total RUP Terumumkan"]),
            }]
        }
    });
}

// ==============================
// FORMAT RUPIAH
// ==============================
function formatRupiah(val) {
    if (!val) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(val);
}

// ==============================
// REFRESH
// ==============================
function refreshData() {
    loadData();
}

// ==============================
// INIT
// ==============================
loadData();
