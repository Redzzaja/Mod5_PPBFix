<p align="center">
  <img src="public/LOGORN.png" alt="Resep Nusantara Logo" width="150"/>
</p>

<h1 align="center">
  Resep Nusantara (PWA) - Modul 5
</h1>

<p align="center">
  Sebuah proyek Progressive Web App (PWA) untuk Praktikum Pemrograman Perangkat Bergerak (PPB).
  <br />
  <strong>Kelompok 20 ppb</strong>
</p>

---

## 👥 Anggota Kelompok

- **Muhammad Arif Maulana**
- **Althaf**
- **Justin Advani**
- **Dimas Agus**

---

## 📖 Deskripsi Proyek

**Resep Nusantara** adalah sebuah _Progressive Web App_ (PWA) yang berfungsi sebagai katalog resep masakan dan minuman khas Indonesia. Aplikasi ini dibangun menggunakan React (dengan Vite) dan dirancang untuk terhubung ke RESTful API eksternal, memungkinkan manajemen data resep secara penuh.

Proyek ini mengimplementasikan fungsionalitas **CRUD** (Create, Read, Update, Delete), _state management_ modern menggunakan React Hooks, dan memanfaatkan `localStorage` untuk _data persistence_ pada fitur-fitur seperti _draft_ resep dan kustomisasi profil pengguna.

## ✨ Fitur Utama

- **Koneksi API (CRUD):** Terhubung ke API eksternal (`modlima.fuadfakhruz.id`) untuk mengambil (_Read_), membuat (_Create_), mengedit (_Update_), dan menghapus (_Delete_) data resep.
- **PWA (Progressive Web App):** Dapat diinstal pada perangkat _mobile_ atau _desktop_ dan memiliki _service worker_ untuk fungsionalitas dasar _offline_.
- **Filtering & Pagination:** Memfilter resep berdasarkan nama, kesulitan, dan waktu, serta menggunakan _pagination_ sisi _server_.
- **Upload Gambar:** Fungsionalitas untuk mengunggah gambar resep ke _server_ saat membuat resep baru.
- **State Management (Hooks):** Menggunakan _custom hooks_ (cth: `useRecipes`, `useReviews`, `useFavorites`) untuk mengelola _state_ API (loading, error, data).
- **Penyimpanan Lokal:** Menggunakan `localStorage` untuk fitur _draft_ dan kustomisasi profil kelompok.
- **Desain Responsif:** Tampilan yang adaptif untuk _mobile_ dan _desktop_ menggunakan Tailwind CSS.

## 🛠️ Teknologi yang Digunakan

- **React 19** (Menggunakan Vite)
- **Vite** sebagai _build tool_
- **Tailwind CSS** untuk _styling_
- **Axios** untuk _fetching_ RESTful API
- **Vite PWA Plugin** untuk generasi _service worker_ & manifest
- **Lucide React** untuk ikon
- **Vercel** untuk _deployment_

## 📦 Instalasi & Menjalankan Lokal

1.  _Clone_ repository ini:
    ```git
    https://github.com/Redzzaja/Mod5_PPBFix.git
    ```
3.  Install semua _dependencies_:
    ```bash
    npm install
    ```
4.  Buat file `.env` di _root_ proyek dan isi dengan URL API:
    ```
    VITE_API_BASE_URL=[https://modlima.fuadfakhruz.id](https://modlima.fuadfakhruz.id)
    ```
5.  Jalankan _development server_:
    ```bash
    npm run dev
    ```
6.  Buka [http://localhost:5173](http://localhost:5173) di browser.
