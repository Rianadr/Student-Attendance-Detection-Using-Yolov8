# 📚 Student Attendance Detection in Classrooms Using YOLOv8

Proyek ini bertujuan untuk mendeteksi kehadiran siswa di dalam kelas dengan menggunakan algoritma YOLOv8 untuk *people counting*. Karena ukuran file model yang cukup besar, file model tidak disertakan langsung dalam repository ini. Anda perlu mengunduhnya secara manual sebelum menjalankan proyek.

---

## 📥 Cara Mendapatkan File Model

Silakan unduh file model YOLOv8 dari link berikut:

🔗 [Download YOLOv8 Model](https://drive.google.com/file/d/1gx_KYEcBUdXRI7J-cKGtjh3rPWxok8ig/view?usp=sharing)

---

## 📂 Langkah-Langkah Setelah Mengunduh Model

1. Unduh file `best_model2.pt` dari link di atas.
2. Pindahkan file tersebut ke dalam folder utama (root directory) dari proyek ini.

---

## 🚀 Cara Menjalankan Proyek

Pastikan Anda sudah menginstal semua dependency yang diperlukan, baik untuk Python maupun Node.js.

### 1. Menjalankan Backend Python (YOLOv8)

```bash
python main.py
```

### 2. Menjalankan Server Node.js

```bash
node server.js
```

### 3. Menjalankan Frontend

```bash
npm run dev
```

### 4. Akses Aplikasi

Buka browser dan masuk ke alamat localhost yang muncul di terminal (contoh: `http://localhost:3000`).

---

## 🛠️ Tools & Teknologi

- Python + YOLOv8 (Ultralytics)
- Node.js (Express.js)
- Frontend (misalnya Vite/React/Vue, sesuaikan)
- OpenCV
- Socket.IO

---

## 📌 Catatan

- Pastikan kamera atau video input sudah tersedia saat menjalankan `main.py`.
- Periksa konfigurasi port jika terjadi konflik saat menjalankan server.

---

## 👨‍💻 Kontributor

- Rian Adriansyah
