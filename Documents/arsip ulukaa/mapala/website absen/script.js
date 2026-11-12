// ==========================================
// KONFIGURASI JSONBIN.IO MAPALA MUCI
// ==========================================
const JSONBIN_BIN_ID = '6af60de4ffd5d16053bcf43e';
const JSONBIN_MASTER_KEY = '$2a$10$LgxDEnVIlQGjM6YGYpaOEOiRNlylcdXD143SJqhKX9ZprVARSJpOm'; // <-- Ganti teks ini dengan Master Key asli Anda dari JSONBin!

// Variabel Data Global di dalam Web
let appData = {
    piket: [],
    kegiatan: [],
    rapat: [],
    anggota: [],
    divisi: []
};

// ==========================================
// 1. FUNGSI AMBIL DATA DARI CLOUD (GET)
// ==========================================
async function ambilDataCloud() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_MASTER_KEY
            }
        });
        
        if (!response.ok) throw new Error("Gagal mengambil data dari server cloud.");
        
        const result = await response.json();
        console.log("Data berhasil dimuat dari Cloud:", result.record);
        
        // Masukkan data dari cloud ke variabel global
        appData = result.record || appData;
        return appData;
    } catch (err) {
        console.error("Gagal memuat dari cloud, menggunakan data lokal (localStorage):", err);
        // Fallback ke penyimpanan lokal jika internet/cloud bermasalah
        const localBackup = localStorage.getItem('mapala_data_backup');
        if (localBackup) {
            appData = JSON.parse(localBackup);
        }
        return appData;
    }
}

// ==========================================
// 2. FUNGSI SIMPAN DATA KE CLOUD (PUT)
// ==========================================
async function simpanDataCloud(dataBaru) {
    try {
        // Perbarui data lokal dulu sebagai backup
        appData = dataBaru;
        localStorage.setItem('mapala_data_backup', JSON.stringify(appData));

        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_MASTER_KEY
            },
            body: JSON.stringify(appData)
        });
        
        if (response.ok) {
            console.log("Perubahan berhasil disinkronkan ke Cloud!");
            alert("Berhasil! Data tersinkron ke semua perangkat.");
        } else {
            alert("Gagal menyimpan perubahan ke server cloud.");
        }
    } catch (err) {
        console.error("Kesalahan jaringan:", err);
        alert("Terjadi kesalahan koneksi saat menyimpan ke cloud.");
    }
}

// ==========================================
// 3. FUNGSI UTAMA YANG DIPANGGIL TOMBOL SIMPAN
// ==========================================
// Hubungkan fungsi ini ke tombol "Simpan Semua Perubahan" di HTML Anda
async function forceSaveAll() {
    // Di sini Anda bisa mengumpulkan data terbaru dari form/tabel web Anda
    // Contoh: membungkus data global yang sedang aktif
    await simpanDataCloud(appData);
}

// ==========================================
// 4. NAVIGASI LOGIN & INISIALISASI AWAL
// ==========================================
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

// Otomatis jalankan pengambilan data saat halaman pertama kali dibuka
window.addEventListener('DOMContentLoaded', async () => {
    await ambilDataCloud();
});