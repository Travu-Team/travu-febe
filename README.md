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

## HOW TO CLONE REPOSITORY

```bash
1. Buat Folder baru di direktori manapun yang kalian mau.
2. Buka GIT Bash di folder yang telah kalian buat.
3. Ketik teks berikut ini di GIT Bash:
git clone https://github.com/Travu-Team/travu-febe.git
4. Done.
```