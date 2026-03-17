const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const TOKEN = 'inprc7642391c38774272bf57ca25ac1d4544';
    const KLPD = 'D228';
    const TAHUN = '2026';

    // Ambil 4 API paralel
    const [masterRes, penyediaRes, swakelolaRes, programRes] = await Promise.all([
      fetch(`https://data.inaproc.id/api/v1/rup/master-satker?kode_klpd=${KLPD}&tahun=${TAHUN}&limit=1000`, {
        headers: { 'Authorization': `Bearer ${TOKEN}` }
      }),
      fetch(`https://data.inaproc.id/api/v1/rup/paket-penyedia-terumumkan?kode_klpd=${KLPD}&tahun=${TAHUN}&limit=1000`, {
        headers: { 'Authorization': `Bearer ${TOKEN}` }
      }),
      fetch(`https://data.inaproc.id/api/v1/rup/paket-swakelola-terumumkan?kode_klpd=${KLPD}&tahun=${TAHUN}&limit=1000`, {
        headers: { 'Authorization': `Bearer ${TOKEN}` }
      }),
      fetch(`https://data.inaproc.id/api/v1/rup/program-master?kode_klpd=${KLPD}&tahun=${TAHUN}&limit=1000`, {
        headers: { 'Authorization': `Bearer ${TOKEN}` }
      })
    ]);

    const [master, penyedia, swakelola, program] = await Promise.all([
      masterRes.json(), penyediaRes.json(), swakelolaRes.json(), programRes.json()
    ]);

    // Proses data seperti Python
    const masterSatker = master.data.map(s => ({ kd_satker: s.kd_satker, 'Satuan Kerja': s.nama_satker }));
    
    const rupPenyedia = penyedia.data.reduce((acc, item) => {
      acc[item.kd_satker] = (acc[item.kd_satker] || 0) + parseFloat(item.pagu || 0);
      return acc;
    }, {});

    const rupSwakelola = swakelola.data.reduce((acc, item) => {
      acc[item.kd_satker] = (acc[item.kd_satker] || 0) + parseFloat(item.pagu || 0);
      return acc;
    }, {});

    const paguProgram = program.data.reduce((acc, item) => {
      acc[item.kd_satker] = (acc[item.kd_satker] || 0) + parseFloat(item.pagu_program || 0);
      return acc;
    }, {});

    // Merge semua
    const result = masterSatker.map(satker => ({
      'Satuan Kerja': satker['Satuan Kerja'],
      'Pagu Program': paguProgram[satker.kd_satker] || 0,
      'RUP Penyedia': rupPenyedia[satker.kd_satker] || 0,
      'RUP Swakelola': rupSwakelola[satker.kd_satker] || 0,
      'Total RUP Terumumkan': (rupPenyedia[satker.kd_satker] || 0) + (rupSwakelola[satker.kd_satker] || 0),
      'Persentase': paguProgram[satker.kd_satker] ? 
        (((rupPenyedia[satker.kd_satker] || 0) + (rupSwakelola[satker.kd_satker] || 0)) / paguProgram[satker.kd_satker] * 100).toFixed(1) + '%' : '0%'
    })).sort((a, b) => a['Satuan Kerja'].localeCompare(b['Satuan Kerja']));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};