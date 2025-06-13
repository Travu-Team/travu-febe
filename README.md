# travu-febe 😎🦾
# ✈️ Travu – Web-based Travel Planner

Travu adalah aplikasi perencana perjalanan berbasis web yang membantu pengguna menyusun itinerary dengan mudah, personal, dan fleksibel. Proyek ini terdiri dari **frontend dan backend terpisah**, dikembangkan oleh tim beranggotakan Yunas, Luthfi, dan Tyo.

---

## 📁 Repositori

- **Frontend**: [`/frontend`](https://github.com/Travu-Team/travu-febe/tree/main/frontend)  
- **Backend**: [`/backend`](https://github.com/Travu-Team/travu-febe/tree/main/backend)

---

## 🌟 Fitur Utama

### Untuk Pengguna
- ✅ Autentikasi: Login & Register
- 🗺️ Pembuatan rencana perjalanan (destination plan)
- 📝 Kelola profil & preferensi pengguna
- 🔍 Cari destinasi atau aktivitas perjalanan

### Untuk Developer
- 🔧 Backend RESTful API dengan autentikasi & validasi
- ⚙️ CRUD untuk travel details, Rekomendasi dan Profile User
- 🔐 Siap untuk deployment Di App engine 
- 🧪 API dapat diintegrasikan dengan Swagger / Postman

---

## 🧱 Arsitektur & Stack Teknologi

| Layer      | Teknologi                  |
|------------|----------------------------|
| Frontend   | React, Vite, Tailwind CSS  |
| Backend    | Node.js, Hapi              |
| Deployment | Netlify, Google App Engine |
| Dokumentasi API | Swagger UI, Postman   |
| Versioning | Git, GitHub                |

---

## 🗂️ Struktur Proyek

### `frontend/`
- React components modular (`pages/`, `components/`, `services/`)
- SPA-ready untuk deployment di Netlify
- Proxy / redirect konfigurasi untuk komunikasi dengan backend

### `backend/`
- Modular Express API untuk autentikasi dan data perjalanan
- Struktur folder bersih: `routes/`, `controllers/`, `models/`
- Siap untuk build & deploy ke app engine

---

## 🚀 Deployment

### Frontend
- Hosting: **Netlify**
- HTTPS aktif via Netlify default
- Bisa ditambahkan custom domain & Netlify Functions (opsional)

### Backend
- Hosting: **App Engine (Google Cloud)**
- Secrets & environment variables dikelola via Google Secret Manager

---

## 📘 Dokumentasi API

- Endpoint terdokumentasi menggunakan:
  - ✅ **Swagger UI**
  - ✅ **Postman Collection**
  - 🔄 Siap dikonversi ke Redoc / ClickUp API docs

---
## IMPORTANT ANNOUNCEMENT

NOTE: HARAP DIPERHATIKAN UNTUK SELALU PULL REPOSITORY TERLEBIH DAHULU SEBELUM MELAKUKAN EDIT PADA FILE TERTENTU!

## FRONT-END

- [x] Homepage (Tyo)
- [x] Travel Details/Detail Wisata (Yunas)
- [x] Profile Users (Luthfi)
- [x] Search Page (Tyo)
- [x] Travel Plan (Yunas)
- [x] Login & Register (Yunas)
- [x] About (Luthfi)
- [x] Components: Navbar & Footer (Tyo), Button & Cards (Luthfi)

## BACK-END

- [x] Autentikasi login & register (Yunas & Luthfi)
- [x] CRUD laman profile user (Luthfi)
- [x] Integrasi backend ke laman travel details (Yunas)
- [x] CRUD laman travel plan (Luthfi)
- [x] Integrasi ML ke Backend (Yunas)

## HOW TO CLONE REPOSITORY

```bash
1. Buat Folder baru di direktori manapun yang kalian mau.
2. Buka GIT Bash di folder yang telah kalian buat.
3. Ketik teks berikut ini di GIT Bash:
git clone https://github.com/Travu-Team/travu-febe.git
4. Done.
```

## HOW TO UPLOAD AN UPDATE

```bash
1. Buka GIT Bash di Folder dimana kalian melakukan clone repository misalnya bila di D://travu-febe.
2. Ketik teks berikut ini di GIT Bash:
git add (nama file), cth: git add index.html
(Jika yang diupload lebih dari satu file, gunakan: git add garuda.php terbang.css de_el_el.html) Atau bisa pakai git add .
git commit -m "tulis apa yang kalian edit/update/delete dan sebagainya (NAMA KALIAN)" cth: git commit -m "edit file footer (Joko)"
git push -u origin (nama branch lokasi filenya), cth: git push -u origin main atau git push -u origin homepage
```

## MORE INFORMATION ABOUT GITHUB COLLABORATION

https://medium.com/@bayupaoh/kolaburasi-code-dengan-git-dan-github-1-79e19e553f85

Tentu! Berikut versi README yang lebih lengkap dan terstruktur sesuai permintaanmu, dengan penjelasan detail tentang:

- Push langsung ke branch main
- Push ke branch baru selain main
- Cara revert/rollback/reset, terutama saat sudah di main branch

---
