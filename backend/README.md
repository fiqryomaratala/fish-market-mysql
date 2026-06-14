# Fish Market Backend

[![Backend CI](https://github.com/fiqryomaratala/fish-market-mysql/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/fiqryomaratala/fish-market-mysql/actions/workflows/backend-ci.yml)

Backend aplikasi Marketplace Ikan dan Sistem Manajemen Budidaya menggunakan Golang, Gin, GORM, MySQL, JWT, dan Clean Architecture.

## Menjalankan Backend

Menjalankan backend secara lokal:

```bash
go run cmd/server/main.go
```

Menjalankan backend dengan Docker:

```bash
docker compose up -d --build
```

Setelah backend berjalan:

- API root: `http://localhost/`
- Swagger: `http://localhost/swagger/index.html`

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
