# Fish Market Backend

Backend aplikasi Marketplace Ikan dan Sistem Manajemen Budidaya menggunakan Golang, Gin, GORM, MySQL, JWT, dan Clean Architecture.

## Seeder Accounts

File ini mencatat akun default yang dibuat oleh seeder di [database/seeders/seeder.go](/abs/path/c:/fish-market-mysql/backend/database/seeders/seeder.go:1).

Catatan:
- Akun ini untuk kebutuhan development dan testing lokal.
- Jangan gunakan password default ini untuk production.

### Admin

- Email: `admin@fishmarket.com`
- Password: `password123`
- Role: `admin`

### Staff

- Email: `staff1@fishmarket.com`
- Password: `password123`
- Role: `staff`

- Email: `staff2@fishmarket.com`
- Password: `password123`
- Role: `staff`

- Email: `staff3@fishmarket.com`
- Password: `password123`
- Role: `staff`

### Customer

Seeder membuat 20 akun customer dengan pola berikut:

- Email: `customer1@fishmarket.com`
- Password: `password123`
- Role: `customer`

- Email: `customer2@fishmarket.com`
- Password: `password123`
- Role: `customer`

- Email: `customer3@fishmarket.com`
- Password: `password123`
- Role: `customer`

Pola lengkap akun customer:

- `customer1@fishmarket.com` sampai `customer20@fishmarket.com`
- Semua password: `password123`

## Menjalankan Seeder

```bash
go run cmd/seeder/main.go
```

Seeder hanya akan mengisi data jika tabel terkait masih kosong.

## Menjalankan Docker

```bash
docker compose up -d --build
```

Setelah container berjalan:

- API root: `http://localhost/`
- Swagger: `http://localhost/swagger/index.html`
