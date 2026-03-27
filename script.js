async function loadData() {
    try {
        const response = await fetch("data/rekap.json");

        if (!response.ok) {
            throw new Error("Gagal load data");
        }

        const data = await response.json();

        console.log("Data:", data);

        const output = document.getElementById("output");

        if (!output) {
            throw new Error("Element #output tidak ditemukan di HTML");
        }

        if (!data || data.length === 0) {
            output.innerText = "Data kosong";
            return;
        }

        // fungsi format rupiah
        function formatRupiah(angka) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0
            }).format(angka);
        }

        // fungsi persen
        function formatPersen(angka) {
            return angka.toFixed(2) + "%";
        }

        let html = `
        <div style="overflow-x:auto;">
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%;">
            <thead style="background:#f2f2f2;">
                <tr>
                    <th>No</th>
                    <th>Satuan Kerja</th>
                    <th>Pagu Program</th>
                    <th>Pagu Pengadaan</th>
                    <th>RUP Penyedia</th>
                    <th>RUP Swakelola</th>
                    <th>Total RUP</th>
                    <th>Selisih</th>
                    <th>%</th>
                </tr>
            </thead>
            <tbody>
        `;

        data.forEach((item, index) => {
            html += `
            <tr>
                <td>${index + 1}</td>
                <td>${item["Satuan Kerja"]}</td>
                <td>${formatRupiah(item["Pagu Program"])}</td>
                <td>${formatRupiah(item["Pagu Pengadaan"])}</td>
                <td>${formatRupiah(item["RUP Penyedia"])}</td>
                <td>${formatRupiah(item["RUP Swakelola"])}</td>
                <td>${formatRupiah(item["Total RUP Terumumkan"])}</td>
                <td>${formatRupiah(item["Selisih RUP Terumumkan"])}</td>
                <td>${formatPersen(item["Persentase"])}</td>
            </tr>
            `;
        });

        html += `
            </tbody>
        </table>
        </div>
        `;

        output.innerHTML = html;

    } catch (error) {
        console.error(error);
        document.getElementById("output").innerText = "ERROR: " + error;
    }
}

loadData();