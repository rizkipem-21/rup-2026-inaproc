const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    console.log('Starting API call...');
    
    const TOKEN = 'inprc7642391c38774272bf57ca25ac1d4544';
    const KLPD = 'D228';
    const TAHUN = '2026';

    // Test satu API dulu
    const masterRes = await fetch(
      `https://data.inaproc.id/api/v1/rup/master-satker?kode_klpd=${KLPD}&tahun=${TAHUN}&limit=10`,
      { headers: { 'Authorization': `Bearer ${TOKEN}` } }
    );

    if (!masterRes.ok) {
      throw new Error(`HTTP ${masterRes.status}: ${masterRes.statusText}`);
    }

    const master = await masterRes.json();
    
    // Return sample data dulu
    const result = master.data.slice(0, 5).map(item => ({
      'Satuan Kerja': item.nama_satker || 'N/A',
      'Pagu Program': 'Rp 50M',
      'RUP Penyedia': 'Rp 42M',
      'RUP Swakelola': 'Rp 0',
      'Total RUP Terumumkan': 'Rp 42M',
      'Persentase': '84%'
    }));

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
