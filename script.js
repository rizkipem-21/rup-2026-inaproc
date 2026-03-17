async function loadData() {
    try {
        const data = await fetch("data/rekap.json").then(r => r.json());

        console.log("Rekap:", data);

        const output = document.getElementById("output");

        if (!data || data.length === 0) {
            output.innerText = "Data kosong";
            return;
        }

        let text = "";

        data.forEach(item => {
            text += `
Satuan Kerja : ${item["Satuan Kerja"]}
Pagu Program : ${item["Pagu Program"]}
RUP Penyedia : ${item["RUP Penyedia"]}
RUP Swakelola : ${item["RUP Swakelola"]}
Total RUP : ${item["Total RUP Terumumkan"]}
Persentase : ${item["Persentase"]}%

----------------------------------------
`;
        });

        output.innerText = text;

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("output").innerText =
            "Gagal load data: " + error;
    }
}

loadData();
