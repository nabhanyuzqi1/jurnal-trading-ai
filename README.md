# 🧑‍🧱 Jurnal Trading Cerdas (Advanced)

**Track, analyze, and optimize your forex and market trading performance with the power of AI.**

**Jurnal Trading Cerdas** adalah jurnal trading berbasis web yang canggih untuk membantu trader forex dan pasar lainnya dalam **melacak**, **menganalisis**, dan **mengoptimalkan** kinerja mereka. Dibangun dengan teknologi web modern dan **terintegrasi dengan Gemini AI dari Google**, alat ini lebih dari sekadar pencatatan—ia memberikan **wawasan mendalam, analisis psikologis, dan umpan balik berbasis data**.

> ✅ **Client-side only**\
> 🔐 **Firebase backend**\
> 🤖 **Gemini AI integration**

---

## ✨ Fitur Utama

### 🔐 Otentikasi Aman

Login mudah dan aman menggunakan **Google Account (Firebase Auth)**.

### 🗂️ Manajemen Multi-Akun

Kelola beberapa akun trading (Real, Demo, Prop Firm) dalam satu profil pengguna.

### ✍️ Jurnal Perdagangan Rinci

Catat perdagangan dengan informasi:

- Pasangan mata uang
- Ukuran lot
- Strategi
- Posisi (long/short)
- Keuntungan/Rugi

### 📊 Dasbor Analitik Canggih

- **Kurva Ekuitas**: Visualisasi pertumbuhan saldo akun
- **Metrik Kinerja**: Total P/L, win rate, jumlah perdagangan
- **Grafik Donat & Batang**: Kinerja berdasarkan pasangan & strategi

### 🤖 Integrasi AI Gemini

- **Analisis Kinerja**: Feedback AI untuk pola & kesalahan umum
- **Analisis Psikologis**: Identifikasi bias seperti FOMO, revenge trading, dll
- **Kalkulator Risiko AI**: Ukuran lot optimal berdasarkan manajemen risiko
- **Prospek Pasar AI**: Ringkasan sentimen pasar berdasarkan berita terbaru

### 📈 Data Pasar Langsung

- **Widget TradingView**: Grafik pasar real-time
- **Kalender Ekonomi**: Berita berdampak tinggi dari Forex Factory
- **Feed Berita Pasar**: Agregasi dari sumber keuangan terkemuka

### 🔄 Impor & Ekspor CSV

Mudah impor riwayat trading dari **MetaTrader 4/5** atau ekspor data untuk analisis offline.

### 📱 Desain Responsif

Mobile-first, dibangun dengan **Tailwind CSS** untuk pengalaman mulus di semua perangkat.

---

## 🛠️ Tumpukan Teknologi

| Layer           | Teknologi                                       |
| --------------- | ----------------------------------------------- |
| **Frontend**    | HTML5, Vanilla JavaScript (ES6), Tailwind CSS   |
| **Backend**     | Google Firebase (Firestore + Auth)              |
| **AI Engine**   | Google Gemini API                               |
| **Visualisasi** | Chart.js, TradingView                           |
| **Eksternal**   | RSS2JSON untuk feed berita dan kalender ekonomi |

---

## 🚀 Memulai

### 1. Clone Repositori

```bash
git clone https://github.com/your-username/jurnal-trading-cerdas.git
cd jurnal-trading-cerdas
```

### 2. Konfigurasi Firebase

- Buka [Firebase Console](https://console.firebase.google.com)
- Buat proyek baru
- Aktifkan **Google Authentication**
- Buat **Firestore Database**
- Ambil konfigurasi Firebase dari `Project Settings`

### 3. Dapatkan API Key Gemini

- Buka [Google AI Studio](https://aistudio.google.com/)
- Buat project dan dapatkan API Key

### 4. Perbarui Kode

Edit file `index.html`:

```javascript
// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Kunci Gemini AI
const geminiApiKey = "YOUR_GEMINI_API_KEY";
```

### 5. Jalankan Aplikasi

Cukup buka `index.html` di browser Anda. Tidak perlu server lokal!

---

## 📖 Cara Menggunakan

1. **Login** menggunakan akun Google
2. **Buat akun trading** (Real/Demo/Prop Firm) dengan nama & saldo awal
3. **Pilih akun aktif** untuk mulai mencatat perdagangan
4. **Catat perdagangan** pada tab *Jurnal*
5. **Analisis kinerja** di tab *Analisa*
6. **Gunakan fitur AI**: analisis psikologis, kalkulator risiko, feedback kinerja
7. **Ikuti pasar** melalui tab *Berita* & *Pasar*

---

## 👤 Penulis

**Nabhan Yuzqi Al Mubarok**\
[LinkedIn](#) | [GitHub](#) | [Website](#)

---

## 📄 Lisensi

Proyek ini bersifat **open-source**.\
Silakan fork, modifikasi, dan gunakan untuk keperluan pribadi atau edukasi.

---

> Built with ❤️ by traders, for traders.

