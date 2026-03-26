let data = [];

// ==============================
// Load JSON
// ==============================
async function loadData() {
    try {
        const res = await fetch('data/rekap.json');
        if (!res.ok) throw new Error('Gagal load JSON');
        data = await res.json();
        renderTable();
        renderSummary();
        renderChart();
    } catch (e) {
        console.error(e);
        document.getElementById('tableBody').innerHTML = `<tr><td colspan="6" class="text-red-600 p-4">ERROR LOAD DATA</td></tr>`;
    }
}

// ==============================
// Render Table
// ==============================
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = data.map(row => `
        <tr class="border-b">
            <td class="px-4 py-2">${row['Satuan Kerja']}</td>
            <td class="px-4 py-2 text-right">${formatRupiah(row['Pagu Program'])}</td>
            <td class="px-4 py-2 text-right">${formatRupiah(row['RUP Penyedia'])}</td>
            <td class="px-4 py-2 text-right">${formatRupiah(row['RUP Swakelola'])}</td>
            <td class="px-4 py-2 text-right">${formatRupiah(row['Total RUP Terumumkan'])}</td>
            <td class="px-4 py-2 text-right">${row['Persentase']}%</td>
        </tr>
    `).join('');
}

// ==============================
// Render Summary
// ==============================
function renderSummary() {
    const summary = document.getElementById('summary');
    const totalSatker = data.length;
    const totalRUP = data.reduce((a,b) => a + (b['Total RUP Terumumkan']||0),0);
    const avgPercent = (data.reduce((a,b) => a + (b['Persentase']||0),0)/totalSatker).toFixed(1);
    summary.innerHTML = `
        <div class="bg-white p-4 rounded shadow">Total Satker: ${totalSatker}</div>
        <div class="bg-white p-4 rounded shadow">Total RUP: ${formatRupiah(totalRUP)}</div>
        <div class="bg-white p-4 rounded shadow">Rata-rata %: ${avgPercent}%</div>
    `;
}

// ==============================
// Chart.js
// ==============================
function renderChart() {
    const ctx = document.getElementById('chartRUP').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d=>d['Satuan Kerja']),
            datasets: [
                {
                    label: 'Total RUP',
                    data: data.map(d=>d['Total RUP Terumumkan']),
                    backgroundColor: 'rgba(59, 130, 246, 0.7)'
                }
            ]
        },
        options: { responsive: true, plugins:{legend:{display:true}} }
    });
}

// ==============================
// Export Excel
// ==============================
function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RUP 2026");
    XLSX.writeFile(wb, `RUP_2026.xlsx`);
}

// ==============================
// Helper
// ==============================
function formatRupiah(val) {
    if (!val) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', minimumFractionDigits:0}).format(val);
}

// ==============================
// Refresh
// ==============================
function refreshData() { loadData(); }

// ==============================
// Init
// ==============================
loadData();