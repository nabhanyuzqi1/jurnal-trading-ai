Jurnal Trading Cerdas (Advanced)
Track, analyze, and optimize your forex and market trading performance with the power of AI.

Jurnal Trading Cerdas adalah jurnal trading berbasis web yang canggih, dirancang untuk membantu trader forex dan pasar lainnya dalam melacak, menganalisis, dan mengoptimalkan kinerja mereka. Dibangun dengan teknologi web modern dan terintegrasi dengan Gemini AI dari Google, alat ini lebih dari sekadar pencatatan sederhana dengan menyediakan wawasan mendalam, analisis psikologis, dan umpan balik berbasis data.

Aplikasi ini sepenuhnya berjalan di sisi klien (client-side) dan menggunakan Firebase untuk layanan backend, memastikan data pengguna aman dan tersinkronisasi di seluruh perangkat.

✨ Fitur Utama
🔐 Otentikasi Aman: Login mudah dan aman menggunakan Akun Google (Firebase Auth).

🗂️ Manajemen Multi-Akun: Buat dan kelola beberapa akun trading (misalnya, Real, Demo, Prop Firm) dalam satu profil pengguna.

✍️ Jurnal Perdagangan Rinci: Catat perdagangan dengan detail penting seperti pasangan mata uang, ukuran lot, strategi, posisi, dan untung/rugi.

📊 Dasbor Analitik Canggih:

Kurva Ekuitas: Visualisasikan pertumbuhan saldo akun Anda dari waktu ke waktu.
Metrik Kinerja: Lacak statistik kunci seperti total P/L, win rate, dan jumlah total perdagangan.
Grafik Donat & Batang: Analisis kinerja berdasarkan pasangan mata uang dan strategi perdagangan.
🤖 Integrasi AI Gemini:

Analisis Kinerja Keseluruhan: Dapatkan umpan balik yang dihasilkan AI tentang pola trading Anda, kesalahan umum, dan saran untuk perbaikan.
Analisis Psikologis: Analisis catatan trading Anda untuk setiap perdagangan guna mengidentifikasi bias psikologis seperti FOMO atau keserakahan.
Kalkulator Risiko AI: Hitung ukuran lot yang optimal berdasarkan saldo akun, persentase risiko, dan stop loss, dengan "pemeriksaan kewarasan" bertenaga AI.
Prospek Pasar AI: Dapatkan ringkasan sentimen pasar yang dihasilkan AI berdasarkan berita utama terkini.
📈 Data Pasar Langsung:

Widget TradingView: Widget grafik terintegrasi untuk analisis pasar secara real-time.
Kalender Ekonomi: Tetap update dengan berita berdampak tinggi dari Forex Factory.
Feed Berita Pasar: Agregasi berita dari sumber keuangan terkemuka.
🔄 Impor & Ekspor CSV: Impor riwayat trading Anda dengan mudah dari MetaTrader (MT4/MT5) atau ekspor data jurnal Anda untuk analisis offline.

📱 Desain Sepenuhnya Responsif: Antarmuka yang bersih dan mobile-first dibangun dengan Tailwind CSS memastikan pengalaman yang mulus di perangkat apa pun.

🛠️ Tumpukan Teknologi
Frontend: HTML5, Vanilla JavaScript (ES6 Modules), Tailwind CSS
Backend-as-a-Service (BaaS): Google Firebase
Authentication: Untuk login dan manajemen pengguna.
Firestore: Sebagai database NoSQL untuk menyimpan semua data pengguna, akun, dan perdagangan.
API & Perpustakaan:
Google Gemini API: Untuk semua fitur analitik bertenaga AI.
Chart.js: Untuk membuat grafik dan diagram interaktif.
TradingView: Untuk grafik pasar yang dapat disematkan.
RSS2JSON: Untuk mengurai feed RSS untuk berita dan kalender ekonomi.
🚀 Memulai
Untuk menjalankan proyek ini secara lokal, Anda akan memerlukan kunci API Anda sendiri untuk Firebase dan Google Gemini.

Clone Repositori:

Bash
git clone https://github.com/your-username/jurnal-trading-cerdas.git
cd jurnal-trading-cerdas
 Konfigurasi Firebase:
a. Buka Konsol Firebase dan buat proyek baru.
b. Aktifkan Google Authentication di tab Authentication -> Sign-in method.
c. Buat Cloud Firestore Database dan atur aturan keamanan (security rules) untuk mengizinkan baca/tulis bagi pengguna yang terotentikasi.
d. Di pengaturan proyek Anda (Project Settings), temukan objek konfigurasi Firebase Anda.

Dapatkan Kunci API Google Gemini:
a. Buka Google AI Studio dan buat kunci API.

Perbarui Kode:
a. Buka file index.html.
b. Temukan bagian <script type="module"> di bagian bawah.
c. Ganti placeholder objek firebaseConfig dengan konfigurasi Firebase Anda sendiri.
d. Ganti placeholder string geminiApiKey dengan kunci API Google Gemini Anda.

JavaScript
// Konfigurasi Firebase aplikasi web Anda
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const geminiApiKey = "YOUR_GEMINI_API_KEY";
 Jalankan Aplikasi:
Cukup buka file index.html di browser web Anda. Tidak diperlukan server web.

📖 Cara Menggunakan
Login: Buka aplikasi dan masuk dengan akun Google Anda.
Buat Akun: Navigasikan ke tab Akun dan buat akun trading pertama Anda dengan memberinya nama dan mengatur saldo awal.
Pilih Akun Aktif: Klik pada akun yang baru dibuat untuk mengaturnya sebagai aktif. Aplikasi sekarang akan mencatat semua perdagangan ke akun ini.
Catat Perdagangan: Buka tab Jurnal untuk mencatat perdagangan baru. Isi formulir dan simpan.
Analisis Kinerja: Pindah ke tab Analisa untuk melihat kurva ekuitas dan grafik kinerja Anda diperbarui secara real-time.
Dapatkan Wawasan AI: Gunakan fitur AI di tab Analisa, Akun (Kalkulator Risiko), dan Jurnal (Analisis Mindset) untuk mendapatkan wawasan yang lebih dalam.
Tetap Terinformasi: Periksa tab Berita dan Pasar untuk berita pasar dan grafik terbaru.
👤 Penulis
Nabhan Yuzqi Al Mubarok

📄 Lisensi
Proyek ini bersifat open-source. Jangan ragu untuk melakukan fork, memodifikasi, dan menggunakannya untuk kebutuhan pribadi Anda.
