// Konfigurasi JSONBin.io Mapala MUCI (Sudah dikunci ke Bin ID Anda)
const JSONBIN_BIN_ID = '6af60de4ffd5d16053bcf43e';
const JSONBIN_MASTER_KEY = '$2a$10$LgxDEnVIlQGjM6YGYpaOEOiRNlylcdXD143SJqhKX9ZprVARSJpOm'; // <-- Ganti teks ini dengan Master Key asli dari profil JSONBin Anda!

// 1. Fungsi Ambil Data Cloud (Otomatis sinkron saat halaman dibuka)
async function ambilDataCloud() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_MASTER_KEY
            }
        });
        const result = await response.json();
        console.log("Data berhasil dimuat dari Cloud!");
        return result.record; // Berisi data (piket, kegiatan, rapat, anggota, divisi)
    } catch (err) {
        console.error("Gagal memuat dari cloud, menggunakan data lokal:", err);
        return JSON.parse(localStorage.getItem('mapala_data_backup')) || { piket: [], kegiatan: [], rapat: [], anggota: [], divisi: [] };
    }
}

// 2. Fungsi Simpan Data Cloud (Otomatis saat tombol simpan ditekan)
async function simpanDataCloud(dataBaru) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_MASTER_KEY
            },
            body: JSON.stringify(dataBaru)
        });
        
        if (response.ok) {
            console.log("Perubahan berhasil disinkronkan ke Cloud!");
            alert("Berhasil! Data tersinkron ke semua perangkat.");
        } else {
            alert("Gagal menyimpan perubahan ke server cloud.");
        }
    } catch (err) {
        console.error("Kesalahan jaringan:", err);
        alert("Terjadi kesalahan koneksi saat menyimpan.");
    }
}

// Contoh Tombol Simpan Utama (Hubungkan ke tombol Simpan Semua Perubahan di panel admin)
async function forceSaveAll() {
    const dataOrganisasiLengkap = {
        piket: window.dataPiket || [],
        kegiatan: window.dataKegiatan || [],
        rapat: window.dataRapat || [],
        anggota: window.dataAnggota || [],
        divisi: window.dataDivisi || []
    };
    await simpanDataCloud(dataOrganisasiLengkap);
}

// Fungsi Navigasi Login Sederhana
function switchLoginRole(role) {
    const btnAnggota = document.getElementById('tab-btn-anggota');
    const btnAdmin = document.getElementById('tab-btn-admin');
    const formAnggota = document.getElementById('form-login-anggota');
    const formAdmin = document.getElementById('form-login-admin');

    if (role === 'anggota') {
        btnAnggota.className = "py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 bg-navy-700 text-white shadow";
        btnAdmin.className = "py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 text-slate-400 hover:text-white";
        formAnggota.classList.remove('hidden');
        formAdmin.classList.add('hidden');
    } else {
        btnAdmin.className = "py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 bg-navy-700 text-white shadow";
        btnAnggota.className = "py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 text-slate-400 hover:text-white";
        formAdmin.classList.remove('hidden');
        formAnggota.classList.add('hidden');
    }
}

function handleMemberLogin(e) {
    e.preventDefault();
    alert("Login anggota berhasil!");
}

function handleAdminLogin(e) {
    e.preventDefault();
    alert("Login admin berhasil!");
}

// Load data otomatis saat pertama kali dibuka
window.addEventListener('DOMContentLoaded', async () => {
    const dataServer = await ambilDataCloud();
    window.dataPiket = dataServer.piket || [];
    window.dataKegiatan = dataServer.kegiatan || [];
    window.dataRapat = dataServer.rapat || [];
    window.dataAnggota = dataServer.anggota || [];
    window.dataDivisi = dataServer.divisi || [];
});