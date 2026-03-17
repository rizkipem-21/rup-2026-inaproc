import pandas as pd
import json
import os

def load_json(path):
    if not os.path.exists(path):
        return []
    with open(path, 'r', encoding='utf-8-sig') as f:
        try:
            return json.load(f)
        except:
            return []

base = "data"

df_master   = pd.DataFrame(load_json(f"{base}/Legacy_rup_master-satker_2026.json"))
df_penyedia = pd.DataFrame(load_json(f"{base}/Legacy_rup_paket-penyedia-terumumkan_2026.json"))
df_swakelola= pd.DataFrame(load_json(f"{base}/Legacy_rup_paket-swakelola-terumumkan_2026.json"))
df_program  = pd.DataFrame(load_json(f"{base}/Legacy_rup_program-master_2026.json"))
df_struktur = pd.DataFrame(load_json(f"{base}/Legacy_rup_struktur-anggaran-pd_2026.json"))

# FILTER MASTER
df_master = df_master[df_master['tahun_aktif'].astype(str).str.contains('2026', na=False)]

master = df_master[['kd_satker','nama_satker']].drop_duplicates()
master.rename(columns={'nama_satker':'Satuan Kerja'}, inplace=True)

# PENYEDIA
penyedia = df_penyedia.groupby('kd_satker', as_index=False)['pagu'].sum()
penyedia.rename(columns={'pagu':'RUP Penyedia'}, inplace=True)

# SWAKELOLA
swakelola = df_swakelola.groupby('kd_satker', as_index=False)['pagu'].sum()
swakelola.rename(columns={'pagu':'RUP Swakelola'}, inplace=True)

# PROGRAM
program = df_program.drop_duplicates(
    subset=['kd_satker','nama_program','kd_program_str','kd_program']
)

program = program[
    ~program['nama_program'].astype(str).str.strip().str.contains(r'( M$|\(M\)$)', regex=True)
]

pagu = program.groupby('kd_satker', as_index=False)['pagu_program'].sum()
pagu.rename(columns={'pagu_program':'Pagu Program'}, inplace=True)

# MERGE
df = master.merge(pagu, on='kd_satker', how='left')
df = df.merge(penyedia, on='kd_satker', how='left')
df = df.merge(swakelola, on='kd_satker', how='left')

# ISI NULL
for col in ['Pagu Program','RUP Penyedia','RUP Swakelola']:
    df[col] = df[col].fillna(0)

# HITUNG
df['Total RUP Terumumkan'] = df['RUP Penyedia'] + df['RUP Swakelola']

df['Persentase'] = df.apply(
    lambda x: round((x['Total RUP Terumumkan']/x['Pagu Program']*100),2)
    if x['Pagu Program'] > 0 else 0,
    axis=1
)

# PILIH KOLOM
df = df[['Satuan Kerja','Pagu Program','RUP Penyedia','RUP Swakelola','Total RUP Terumumkan','Persentase']]

# SORT
df['_sort'] = df['Satuan Kerja'].str.lower()
df = df.sort_values('_sort').drop(columns='_sort')

# SIMPAN
os.makedirs(base, exist_ok=True)
df.to_json(f"{base}/rekap.json", orient="records", indent=2)

print("rekap.json OK")
