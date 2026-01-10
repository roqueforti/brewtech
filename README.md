<div align="center">

  <img src="public/logo.png" alt="BrewTech Logo" width="100" height="auto" />
  
  # ☕ BrewTech LMS
  
  **Platform Belajar Barista Interaktif dengan Gamifikasi**
  
  [![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Inertia.js](https://img.shields.io/badge/Inertia-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

  <p align="center">
    <a href="#about">About</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#screenshots">Screenshots</a>
  </p>
</div>

---

## 📖 About The Project

**BrewTech** adalah sistem manajemen pembelajaran (LMS) modern yang dirancang khusus untuk pelatihan barista. Berbeda dengan LMS kaku pada umumnya, BrewTech menggunakan pendekatan **Gamifikasi** dan **Interaktif** untuk membuat proses belajar menyeduh kopi menjadi menyenangkan.

Dibangun dengan arsitektur **Modern Monolith**, aplikasi ini menggabungkan kekuatan backend Laravel yang robust dengan pengalaman pengguna (UX) frontend React yang seamless layaknya Single Page Application (SPA), dijembatani oleh Inertia.js.

### 💡 Key Highlights
* **Gamified Experience:** Sistem Level, XP, Streak harian, dan Badges (Lencana) untuk memotivasi siswa.
* **Interactive Workshop:** Panduan langkah-demi-langkah (Step-by-step) visual untuk materi praktek (seperti V60 Manual Brew).
* **Smart Assessment:** Pre-test & Post-test logis, serta fitur upload foto hasil praktek.
* **SPK / Decision Support:** Analisis otomatis memberikan rekomendasi ("Rapor") berdasarkan performa siswa.

---

## ✨ Features

### 👨‍🎓 Student Area
- [x] **Dashboard Interaktif:** Melihat progress misi, statistik belajar, dan koleksi badge.
- [x] **Workshop Player:** - Materi slide interaktif.
    - Kuis Pre-test & Post-test.
    - Upload bukti praktek (Foto).
- [x] **Gamifikasi:**
    - Perhitungan XP otomatis.
    - Unlock Badges (Pemula, Barista, Master, dll).
    - Leaderboard & Streak.
- [x] **Rapor SPK:** Visualisasi data kemampuan (Radar Chart/Statistik) dan feedback otomatis.

### 👨‍🏫 Instructor Area (Admin)
- [x] **Monitoring Siswa:** Memantau progress belajar per kelas.
- [x] **Validasi Tugas:** Review foto hasil praktek siswa.
- [x] **Manajemen Kelas:** Mengatur materi dan peserta.

---

## 🛠 Tech Stack

Aplikasi ini menggunakan stack **TALL** (Tailwind, Alpine/React, Laravel, Livewire/Inertia) variant modern:

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Laravel 10/11 | RESTful architecture, Eloquent ORM, Authentication. |
| **Frontend** | React.js | Component-based UI, Hooks for state management. |
| **Bridge** | Inertia.js | Menghubungkan Laravel & React tanpa membuat API ribet. |
| **Language** | TypeScript | Type-safety untuk frontend yang lebih stabil. |
| **Styling** | Tailwind CSS | Utility-first CSS framework. |
| **Icons** | Lucide React | Modern & lightweight icons. |
| **Database** | MySQL | Relational database management. |

---

## 📸 Screenshots

| **Dashboard Peserta** | **Workshop Flow** |
|:---:|:---:|
| <img src="docs/dashboard.png" alt="Dashboard" width="400"/> | <img src="docs/workshop.png" alt="Workshop" width="400"/> |

| **Profil & Gamifikasi** | **Rapor SPK** |
|:---:|:---:|
| <img src="docs/profile.png" alt="Profile" width="400"/> | <img src="docs/spk.png" alt="Rapor" width="400"/> |

---

## 🚀 Installation & Setup

Ikuti langkah ini untuk menjalankan project di lokal komputer Anda:

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/username-anda/brewtech.git](https://github.com/username-anda/brewtech.git)
    cd brewtech
    ```

2.  **Install Dependencies (Backend & Frontend)**
    ```bash
    composer install
    npm install
    ```

3.  **Setup Environment**
    Salin file `.env.example` menjadi `.env` dan atur database kamu.
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4.  **Database Setup**
    Pastikan database MySQL sudah dibuat, lalu jalankan migrasi dan seeder (Penting! Untuk data dummy & materi V60).
    ```bash
    php artisan migrate:fresh --seed
    ```

5.  **Run Application**
    Jalankan dua terminal terpisah:
    ```bash
    # Terminal 1 (Laravel Server)
    php artisan serve

    # Terminal 2 (Vite/React Bundler)
    npm run dev
    ```

6.  **Akses Aplikasi**
    Buka `http://127.0.0.1:8000`.
    * **Akun Siswa:** `alex.morningbatch@student.com` / `password`
    * **Akun Admin:** `admin@brewtech.com` / `admin123`

---

## 📂 Project Structure (Modern Monolith)

Struktur folder utama yang digunakan dalam project ini: