# Xendit Sandbox Testing

Panduan ini dipakai untuk mengetes integrasi `Xendit Payment Link` secara lokal pada flow checkout customer.

## 1. Siapkan environment backend

Isi minimal variabel berikut di `backend/.env`:

```env
APP_PORT=8080
BASE_URL=http://localhost
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173

XENDIT_API_KEY=xnd_development_your_api_key
XENDIT_WEBHOOK_TOKEN=your_xendit_webhook_token
```

Catatan:
- Gunakan API key sandbox yang diawali `xnd_development_`.
- `XENDIT_WEBHOOK_TOKEN` harus sama dengan callback verification token di dashboard Xendit.
- Jika ingin menerima webhook dari URL publik tunnel, ubah `BASE_URL` ke domain publik backend kamu agar konfigurasi environment tetap konsisten.

## 2. Jalankan aplikasi

Backend:

```powershell
cd backend
go run ./cmd/server
```

Frontend:

```powershell
cd frontend
npm run dev
```

Default URL lokal:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`

Jika memakai Docker Compose dari folder `backend`, file `docker-compose.yml` sekarang akan membaca `backend/.env` dan meneruskan `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, `XENDIT_API_KEY`, dan `XENDIT_WEBHOOK_TOKEN` ke container backend. Jadi langkah aman sebelum `docker compose up -d --build` adalah memastikan `.env` sudah terisi.

## 3. Uji checkout payment link

1. Login sebagai customer.
2. Tambahkan produk ke cart.
3. Buka halaman checkout.
4. Pilih metode pembayaran online Xendit.
5. Submit checkout.

Ekspektasi:
- Order berhasil dibuat.
- Backend mengembalikan `payment_url`.
- Frontend redirect ke halaman pembayaran Xendit.

## 4. Uji redirect selesai bayar

Sesudah membuka halaman Xendit:

- Jika pembayaran sukses, user diarahkan ke:
  `http://localhost:5173/orders/success/:id`
- Jika pembayaran gagal atau batal, user diarahkan ke:
  `http://localhost:5173/orders/:id`

Ekspektasi:
- Halaman order menampilkan metode pembayaran Xendit.
- Badge status pembayaran tampil sesuai kondisi terbaru yang tersimpan.

## 5. Uji webhook Xendit

Endpoint webhook backend:

```text
POST /api/payments/xendit/webhook
```

Untuk testing lokal, backend harus bisa diakses publik. Salah satu cara paling mudah adalah memakai tunnel seperti `ngrok` atau `cloudflared`.

Contoh jika memakai `ngrok`:

```powershell
ngrok http 8080
```

Jika backend kamu berjalan di balik Nginx Docker pada `http://localhost`, tunnel juga boleh diarahkan ke port `80`, misalnya:

```powershell
ngrok http 80
```

Lalu pasang URL webhook di dashboard Xendit:

```text
https://subdomain-ngrok-kamu.ngrok-free.app/api/payments/xendit/webhook
```

Pastikan token callback di dashboard sama dengan `XENDIT_WEBHOOK_TOKEN`.
Jika kamu mengganti tunnel/domain publik, perbarui juga `BASE_URL` di `.env` agar environment lokal tetap merepresentasikan URL backend yang aktif diuji.

Ekspektasi setelah webhook sukses:
- `payment_status` order berubah menjadi `paid` saat pembayaran sukses.
- Status order ikut bergerak sesuai mapping backend.
- Halaman Order Success, Order Detail, dan Order History menampilkan badge terbaru.

## 6. Checklist cepat

- `XENDIT_API_KEY` sudah terisi
- `XENDIT_WEBHOOK_TOKEN` sudah terisi
- `FRONTEND_URL` sudah benar
- `BASE_URL` sudah sesuai URL backend yang sedang diuji
- Backend berjalan
- Frontend berjalan
- Checkout menghasilkan redirect ke Xendit
- Webhook Xendit mengarah ke endpoint backend publik
- Status pembayaran order berubah setelah callback masuk

## 7. Troubleshooting

Jika checkout tidak redirect ke Xendit:
- Cek `XENDIT_API_KEY`
- Cek log backend saat create invoice
- Pastikan metode pembayaran bukan `cod`

Jika status order tidak berubah setelah bayar:
- Cek URL webhook di dashboard Xendit
- Cek `XENDIT_WEBHOOK_TOKEN`
- Cek apakah backend bisa diakses publik
- Cek log backend untuk request webhook

Jika backend gagal start di port `8080`:
- Pastikan port tidak sedang dipakai proses lain
- Atau ubah `APP_PORT` ke port lain yang kosong
