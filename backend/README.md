# Fish Market Backend

[![Backend CI](https://github.com/fiqryomaratala/fish-market-mysql/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/fiqryomaratala/fish-market-mysql/actions/workflows/backend-ci.yml)

Backend aplikasi Marketplace Ikan dan Sistem Manajemen Budidaya menggunakan Golang, Gin, GORM, MySQL, JWT, dan Clean Architecture.

## Menjalankan Backend

Menjalankan backend secara lokal:

```bash
go run cmd/server/main.go
```

Perintah di atas juga akan menjalankan migration database otomatis saat server start.

## Menjalankan Migration

Untuk menjalankan migration database:

```bash
go run cmd/server/main.go
```

Jika ingin menjalankan migration sekaligus seeder:

```bash
go run cmd/seeder/main.go
```

Menjalankan backend dengan Docker:

```bash
docker compose up -d --build
```

Perintah di atas sekarang default untuk development lokal, jadi hanya menyalakan MySQL agar backend Go lokal bisa tetap memakai `http://localhost:8080` tanpa bentrok port.

Jika ingin menjalankan full stack Docker sekaligus:

```bash
docker compose --profile fullstack up -d --build
```

Solusi cepat jika port `8080` bentrok saat menjalankan backend lokal:

```bash
docker compose down --remove-orphans
docker compose up -d --build
go run cmd/server/main.go
```

Penjelasan singkat:
- `docker compose down --remove-orphans` membersihkan container lama yang masih bisa menahan port `8080`
- `docker compose up -d --build` menyalakan ulang service default untuk development lokal, yaitu MySQL
- `go run cmd/server/main.go` menjalankan backend Go lokal di `http://localhost:8080`

Setelah backend berjalan:

- Backend container direct: `http://localhost:8081`
- API root via Nginx: `http://localhost/`
- Swagger via Nginx: `http://localhost/swagger/index.html`

Catatan port development:

- Backend Go lokal default berjalan di `http://localhost:8080`
- `docker compose up -d --build` default hanya menyalakan MySQL untuk kebutuhan backend lokal
- Backend Docker full stack dipublish ke `http://localhost:8081`
- Nginx Docker tetap tersedia di `http://localhost`

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
