let data = [];
let filteredData = [];
let activeFilters = {
    nama: []
};

// FORMAT
function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID").format(angka || 0);
}

// LOAD DATA
async function loadData() {
    const res = await fetch("data/rekap.json");
    data = await res.json();
    filteredData = [...data];

    renderTable();
    createDropdownFilter();
}

// RENDER TABLE
function renderTable() {
    const tbody = document.getElementById("tableBody");

    tbody.innerHTML = filteredData.map(row => `
        <tr class="border-b table-row-hover">
            <td class="p-2">${row["Satuan Kerja"]}</td>
            <td class="p-2 text-right">${formatRupiah(row["Pagu Program"])}</td>
            <td class="p-2 text-right">${formatRupiah(row["RUP Penyedia"])}</td>
            <td class="p-2 text-right">${formatRupiah(row["RUP Swakelola"])}</td>
            <td class="p-2 text-right font-bold">${formatRupiah(row["Total RUP Terumumkan"])}</td>
            <td class="p-2 text-right">${row["Persentase"].toFixed(2)}%</td>
        </tr>
    `).join("");
}

// CREATE DROPDOWN (EXCEL STYLE)
function createDropdownFilter() {
    const uniqueNama = [...new Set(data.map(d => d["Satuan Kerja"]))].sort();

    const container = document.getElementById("dropdown-nama");

    container.innerHTML = `
        <label class="block border-b pb-1 mb-1">
            <input type="checkbox" id="selectAllNama" checked> <b>Select All</b>
        </label>
        ${uniqueNama.map(nama => `
            <label class="block">
                <input type="checkbox" class="namaCheckbox" value="${nama}" checked>
                ${nama}
            </label>
        `).join("")}
    `;

    // select all
    document.getElementById("selectAllNama").addEventListener("change", function() {
        document.querySelectorAll(".namaCheckbox").forEach(cb => {
            cb.checked = this.checked;
        });
        applyFilter();
    });

    // checkbox change
    document.querySelectorAll(".namaCheckbox").forEach(cb => {
        cb.addEventListener("change", applyFilter);
    });
}

// APPLY FILTER
function applyFilter() {
    const selected = [...document.querySelectorAll(".namaCheckbox:checked")]
        .map(cb => cb.value);

    filteredData = data.filter(row =>
        selected.includes(row["Satuan Kerja"])
    );

    renderTable();
}

// TOGGLE DROPDOWN
function toggleDropdown(name) {
    const el = document.getElementById("dropdown-" + name);
    el.classList.toggle("show");
}

// INIT
loadData();