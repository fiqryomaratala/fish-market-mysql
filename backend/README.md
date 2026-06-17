# Fish Market Backend

[![Backend CI](https://github.com/fiqryomaratala/fish-market-mysql/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/fiqryomaratala/fish-market-mysql/actions/workflows/backend-ci.yml)

Backend aplikasi Marketplace Ikan dan Sistem Manajemen Budidaya menggunakan Golang, Gin, GORM, MySQL, JWT, dan Clean Architecture.

## Menjalankan Backend

Menjalankan backend default project ini:

```bash
docker compose up -d --build
```

Perintah di atas menyalakan full stack Docker sekaligus: `mysql`, `backend`, dan `nginx`.

## Menjalankan Migration

Untuk menjalankan migration melalui backend lokal:

```bash
go run cmd/server/main.go
```

Jika ingin menjalankan migration sekaligus seeder:

```bash
go run cmd/seeder/main.go
```

Solusi cepat jika sebelumnya sempat memakai konfigurasi profile lama atau muncul error network/container lama:

```bash
docker compose down --remove-orphans
docker compose up -d --build
```

Penjelasan singkat:
- `docker compose down --remove-orphans` membersihkan container dan network lama yang bisa membuat `nginx` gagal start
- `docker compose up -d --build` menyalakan ulang seluruh stack Docker

Setelah backend berjalan:

- API root via Nginx: `http://localhost/`
- Swagger via Nginx: `http://localhost/swagger/index.html`
- API base URL untuk frontend: `http://localhost/api`

Catatan port development:

- Backend Docker tidak dipublish langsung ke host, jadi tidak bentrok dengan `http://localhost:8080`
- Akses API dari browser/frontend diarahkan lewat `nginx` di `http://localhost`
- Jika ingin menjalankan backend Go lokal di `http://localhost:8080`, matikan stack Docker dulu agar upload dan akses file tidak tercampur

## Continuous Integration

Project ini menggunakan GitHub Actions workflow `backend-ci.yml` untuk menjalankan:

- `go mod download`
- `go fmt ./...`
- `go vet ./...`
- `go test ./...`
- `go build ./...`

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

## Regression Test

Project ini sekarang punya dua jalur regression test:

- Go integration test untuk alur domain inti di `internal/tests`
- Postman collection + Newman untuk smoke test HTTP end-to-end

Menjalankan Go integration test:

```bash
go test ./internal/tests -run "TestIntegration(AuthProductFlow|PondBatchHarvestInventoryFlow|CartCheckoutOrderFlow|FeedingNotificationActivityTrackingFlow|ReportsAndDashboardFlow|ManagementCRUDFlow)" -v
```

Menjalankan regression gabungan:

```bash
npm install
npm run test:regression
```

File yang dipakai:

- `postman/FishMarket.postman_collection.json`
- `postman/FishMarket.local.postman_environment.json`
- `postman/fixtures/test-product.svg`
