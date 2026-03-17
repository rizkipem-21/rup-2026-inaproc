import pandas as pd
import json
import os

# ==============================
# LOAD JSON (ANTI ERROR INAPROC)
# ==============================
def load_json(path):
    if not os.path.exists(path):
        return []

    with open(path, 'r', encoding='utf-8-sig') as f:
        try:
            data = json.load(f)

            # HANDLE FORMAT {"data": [...]}
            if isinstance(data, dict):
                return data.get("data", [])

            return data

        except Exception as e:
            print(f"Error load {path}: {e}")
            return []

# ==============================
# LOAD DATA
# ==============================
base = "data"

df_master   = pd.DataFrame(load_json(f"{base}/Legacy_rup_master-satker_2026.json"))
df_penyedia = pd.DataFrame(load_json(f"{base}/Legacy_rup_paket-penyedia-terumumkan_2026.json"))
df_swakelola= pd.DataFrame(load_json(f"{base}/Legacy_rup_paket-swakelola-terumumkan_2026.json"))
df_program  = pd.DataFrame(load_json(f"{base}/Legacy_rup_program-master_2026.json"))

print("MASTER:", df_master.shape)
print("PENYEDIA:", df_penyedia.shape)
print("SWAKELOLA:", df_swakelola.shape)

# ==============================
# MASTER
# ==============================
if 'tahun_aktif' in df_master.columns:
    df_master = df_master[df_master['tahun_aktif'].astype(str).str.contains('2026', na=False)]

if 'kd_satker' in df_master.columns and 'nama_satker' in df_master.columns:
    master = df_master[['kd_satker','nama_satker']].drop_duplicates()
    master.rename(columns={'nama_satker':'Satuan Kerja'}, inplace=True)
else:
    master = pd.DataFrame(columns=['kd_satker','Satuan Kerja'])

# ==============================
# PENYEDIA
# ==============================
if 'kd_satker' in df_penyedia.columns and 'pagu' in df_penyedia.columns:
    penyedia = df_penyedia.groupby('kd_satker', as_index=False)['pagu'].sum()
else:
    penyedia = pd.DataFrame(columns=['kd_satker','RUP Penyedia'])

penyedia.rename(columns={'pagu':'RUP Penyedia'}, inplace=True)

# ==============================
# SWAKELOLA
# ==============================
if 'kd_satker' in df_swakelola.columns and 'pagu' in df_swakelola.columns:
    swakelola = df_swakelola.groupby('kd_satker', as_index=False)['pagu'].sum()
else:
    swakelola = pd.DataFrame(columns=['kd_satker','RUP Swakelola'])

swakelola.rename(columns={'pagu':'RUP Swakelola'}, inplace=True)

# ==============================
# PROGRAM
# ==============================
if not df_program.empty:
    program = df_program.drop_duplicates(
        subset=['kd_satker','nama_program','kd_program_str','kd_program'],
        errors='ignore'
    )

    if 'nama_program' in program.columns:
        program = program[
            ~program['nama_program'].astype(str).str.contains(r'( M$|\(M\)$)', regex=True)
        ]

    if 'kd_satker' in program.columns and 'pagu_program' in program.columns:
        pagu = program.groupby('kd_satker', as_index=False)['pagu_program'].sum()
    else:
        pagu = pd.DataFrame(columns=['kd_satker','Pagu Program'])

    pagu.rename(columns={'pagu_program':'Pagu Program'}, inplace=True)
else:
    pagu = pd.DataFrame(columns=['kd_satker','Pagu Program'])

# ==============================
# MERGE
# ==============================
df = master.merge(pagu, on='kd_satker', how='left')
df = df.merge(penyedia, on='kd_satker', how='left')
df = df.merge(swakelola, on='kd_satker', how='left')

# ==============================
# ISI NULL
# ==============================
for col in ['Pagu Program','RUP Penyedia','RUP Swakelola']:
    if col in df.columns:
        df[col] = df[col].fillna(0)

# ==============================
# HITUNG
# ==============================
df['Total RUP Terumumkan'] = df.get('RUP Penyedia',0) + df.get('RUP Swakelola',0)

df['Persentase'] = df.apply(
    lambda x: round((x['Total RUP Terumumkan']/x['Pagu Program']*100),2)
    if x.get('Pagu Program',0) > 0 else 0,
    axis=1
)

# ==============================
# FINAL
# ==============================
df = df[['Satuan Kerja','Pagu Program','RUP Penyedia','RUP Swakelola','Total RUP Terumumkan','Persentase']]

df['_sort'] = df['Satuan Kerja'].astype(str).str.lower()
df = df.sort_values('_sort').drop(columns='_sort')

os.makedirs(base, exist_ok=True)
df.to_json(f"{base}/rekap.json", orient="records", indent=2)

print("rekap.json OK")
