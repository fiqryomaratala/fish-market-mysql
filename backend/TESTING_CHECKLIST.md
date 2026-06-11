# Testing Checklist

Checklist ini dipakai untuk QA manual backend Marketplace Ikan dan Sistem Manajemen Budidaya.

## Automated Integration Tests

Checklist ini sekarang punya dua lapisan automation:

- Go integration test untuk regression logic dan alur multi-endpoint tanpa bergantung ke database sungguhan.
- Postman collection + Newman untuk smoke/regression HTTP terhadap aplikasi yang sedang running di `http://localhost`.

Sebagian checklist berikut sudah diotomatisasi dalam integration test Go:

- [x] `POST /api/auth/register`
- [x] `POST /api/auth/login`
- [x] `GET /api/auth/profile`
- [x] `GET /api/admin/dashboard`
- [x] `GET /api/customer/profile`
- [x] `POST /api/admin/products` + upload image
- [x] `GET /api/products`
- [x] `GET /api/products/:id`
- [x] akses file `/uploads/...`
- [x] `POST /api/ponds`
- [x] `POST /api/batches`
- [x] `POST /api/harvests`
- [x] `GET /api/inventory`
- [x] `GET /api/inventory/transactions?type=IN`
- [x] `GET /api/harvests/summary`
- [x] `POST /api/cart`
- [x] `GET /api/cart`
- [x] `POST /api/checkout`
- [x] `GET /api/orders`
- [x] `GET /api/orders/:id`
- [x] `PUT /api/orders/:id/payment`
- [x] `PUT /api/orders/:id/status`
- [x] `GET /api/orders/:id/invoice`
- [x] `GET /api/inventory/transactions?type=OUT`
- [x] `POST /api/feeding-logs`
- [x] `GET /api/feeding-logs`
- [x] `GET /api/notifications`
- [x] `GET /api/notifications/unread`
- [x] `PUT /api/notifications/:id/read`
- [x] `PUT /api/notifications/read-all`
- [x] `DELETE /api/notifications/:id`
- [x] `GET /api/activity-logs`
- [x] `GET /api/activity-logs/:id`
- [x] `GET /api/tracking/:batchCode`
- [x] `GET /api/dashboard`
- [x] `GET /api/dashboard/production`
- [x] `GET /api/dashboard/harvest`
- [x] `GET /api/dashboard/feed`
- [x] `GET /api/dashboard/batch-status`
- [x] `GET /api/dashboard/recent-harvest`
- [x] `GET /api/reports/harvest`
- [x] `GET /api/reports/production`
- [x] `GET /api/reports/feeding`
- [x] `GET /api/reports/export/excel?type=harvest`
- [x] `GET /api/reports/export/pdf?type=harvest`

File test:

- `internal/tests/integration_auth_product_test.go`
- `internal/tests/integration_operations_test.go`
- `internal/tests/integration_observability_test.go`
- `internal/tests/integration_management_crud_test.go`

Jalankan dengan:

```bash
go test ./internal/tests -run "TestIntegration(AuthProductFlow|PondBatchHarvestInventoryFlow|CartCheckoutOrderFlow|FeedingNotificationActivityTrackingFlow|ReportsAndDashboardFlow|ManagementCRUDFlow)" -v
```

Regression gabungan Go + Newman:

```bash
npm install
npm run test:regression
```

File Newman:

- `postman/FishMarket.postman_collection.json`
- `postman/FishMarket.local.postman_environment.json`

## Persiapan

- [ ] Siapkan token `admin`
- [ ] Siapkan token `staff`
- [ ] Siapkan token `customer`
- [ ] Pastikan database sudah terisi data seeder
- [ ] Pastikan `docker compose ps` semua container sehat
- [ ] Pastikan `http://localhost/swagger/index.html` bisa dibuka

## Pond Management

- [ ] `POST /api/ponds` dengan `admin` berhasil create pond
- [ ] `POST /api/ponds` dengan `staff` berhasil create pond
- [ ] `POST /api/ponds` dengan `customer` ditolak `403`
- [ ] `POST /api/ponds` dengan `name` kosong gagal validasi
- [ ] `POST /api/ponds` dengan `capacity < 0` gagal validasi
- [ ] `POST /api/ponds` dengan `area < 0` gagal validasi
- [ ] `GET /api/ponds` dengan `admin` berhasil
- [ ] `GET /api/ponds` dengan `staff` berhasil
- [ ] `GET /api/ponds?search=Kolam` mengembalikan hasil sesuai
- [ ] `GET /api/ponds?page=1&limit=10` pagination normal
- [ ] `GET /api/ponds/:id` dengan ID valid berhasil
- [ ] `GET /api/ponds/:id` dengan ID tidak ada menghasilkan not found
- [ ] `PUT /api/ponds/:id` dengan `admin` berhasil update
- [ ] `PUT /api/ponds/:id` dengan `staff` berhasil update
- [ ] `DELETE /api/ponds/:id` dengan `admin` berhasil delete
- [ ] `DELETE /api/ponds/:id` dengan `staff` ditolak `403`

## Fish Batch Management

- [ ] `POST /api/batches` dengan `admin` berhasil create
- [ ] `POST /api/batches` dengan `staff` berhasil create
- [ ] `POST /api/batches` dengan `customer` ditolak `403`
- [ ] batch code otomatis terbentuk format `BTCH-2026-0001`
- [ ] `current_count` otomatis sama dengan `seed_count`
- [ ] `status` otomatis `active`
- [ ] create batch dengan `pond_id` yang tidak ada gagal
- [ ] create batch dengan pond nonaktif gagal
- [ ] `GET /api/batches` berhasil
- [ ] `GET /api/batches?fish_type=Nila` filter berhasil
- [ ] `GET /api/batches?pond_id=1` filter berhasil
- [ ] `GET /api/batches?status=active` filter berhasil
- [ ] `GET /api/batches?page=1&limit=10` pagination normal
- [ ] `GET /api/batches/:id` menampilkan data pond
- [ ] `PUT /api/batches/:id` dengan `admin` berhasil
- [ ] `PUT /api/batches/:id` dengan `staff` berhasil
- [ ] `DELETE /api/batches/:id` dengan `admin` berhasil
- [ ] `DELETE /api/batches/:id` dengan `staff` ditolak `403`

## Feeding Logs

- [ ] `POST /api/feeding-logs` dengan `admin` berhasil
- [ ] `POST /api/feeding-logs` dengan `staff` berhasil
- [ ] `POST /api/feeding-logs` dengan `customer` ditolak `403`
- [ ] create feeding log dengan `fish_batch_id` tidak ada gagal
- [ ] create feeding log dengan `feed_type` kosong gagal validasi
- [ ] create feeding log dengan `feed_amount <= 0` gagal validasi
- [ ] `GET /api/feeding-logs` berhasil
- [ ] `GET /api/feeding-logs?fish_batch_id=1` filter berhasil
- [ ] `GET /api/feeding-logs?start_date=2026-08-01&end_date=2026-08-31` filter tanggal berhasil
- [ ] `GET /api/feeding-logs/:id` menampilkan relasi batch
- [ ] `PUT /api/feeding-logs/:id` dengan `admin` berhasil
- [ ] `PUT /api/feeding-logs/:id` dengan `staff` berhasil
- [ ] `DELETE /api/feeding-logs/:id` dengan `admin` berhasil
- [ ] `DELETE /api/feeding-logs/:id` dengan `staff` ditolak `403`

## Harvest Management

- [ ] `POST /api/harvests` dengan `admin` berhasil
- [ ] `POST /api/harvests` dengan `staff` berhasil
- [ ] create harvest dengan `fish_batch_id` tidak ada gagal
- [ ] create harvest dengan `total_weight <= 0` gagal validasi
- [ ] create harvest dengan `fish_count <= 0` gagal validasi
- [ ] setelah harvest dibuat, status batch berubah ke `harvested`
- [ ] setelah harvest dibuat, `current_count` batch ter-update
- [ ] setelah harvest dibuat, inventory bertambah
- [ ] setelah harvest dibuat, inventory transaction `IN` tercatat
- [ ] `GET /api/harvests` berhasil
- [ ] `GET /api/harvests?fish_batch_id=1` filter berhasil
- [ ] `GET /api/harvests?start_date=2026-12-01&end_date=2026-12-31` filter berhasil
- [ ] `GET /api/harvests/:id` berhasil
- [ ] `PUT /api/harvests/:id` dengan `admin` berhasil
- [ ] `PUT /api/harvests/:id` dengan `staff` berhasil
- [ ] `DELETE /api/harvests/:id` dengan `admin` berhasil
- [ ] `DELETE /api/harvests/:id` dengan `staff` ditolak `403`
- [ ] `GET /api/harvests/summary` mengembalikan total harvest, weight, fish

## Inventory Management

- [ ] `GET /api/inventory` dengan `admin` berhasil
- [ ] `GET /api/inventory` dengan `staff` berhasil
- [ ] `GET /api/inventory` dengan `customer` ditolak
- [ ] `GET /api/inventory?page=1&limit=10` pagination normal
- [ ] `GET /api/inventory?product_id=1` filter berhasil
- [ ] `GET /api/inventory?batch_id=1` filter berhasil
- [ ] `GET /api/inventory/:id` dengan ID valid berhasil
- [ ] `GET /api/inventory/:id` dengan ID tidak ada menghasilkan not found
- [ ] `GET /api/inventory/transactions` dengan `admin` berhasil
- [ ] `GET /api/inventory/transactions?type=IN` filter berhasil
- [ ] `GET /api/inventory/transactions?type=OUT` filter berhasil
- [ ] `GET /api/inventory/transactions?type=ADJUSTMENT` filter berhasil
- [ ] `POST /api/inventory/adjustment` dengan nilai positif berhasil
- [ ] `POST /api/inventory/adjustment` dengan nilai negatif berhasil
- [ ] adjustment membuat inventory transaction baru
- [ ] adjustment pada inventory tidak ada menghasilkan not found

## Tracking Batch

- [ ] `GET /api/tracking/:batchCode` tanpa login berhasil
- [ ] response menampilkan pond
- [ ] response menampilkan data batch
- [ ] response menampilkan feeding logs
- [ ] response menampilkan harvests
- [ ] batch code tidak ada menghasilkan `404 Batch not found`

## Dashboard Analytics

- [ ] `GET /api/dashboard` dengan `admin` berhasil
- [ ] `GET /api/dashboard` dengan `staff` berhasil
- [ ] `GET /api/dashboard` dengan `customer` ditolak `403`
- [ ] summary menampilkan total products, ponds, batches, active batches, harvests, weight, feeding logs
- [ ] `GET /api/dashboard/production` berhasil
- [ ] `GET /api/dashboard/harvest` berhasil
- [ ] `GET /api/dashboard/feed` berhasil
- [ ] `GET /api/dashboard/batch-status` berhasil
- [ ] `GET /api/dashboard/recent-harvest` berhasil

## Reports

- [ ] `GET /api/reports/harvest` dengan `admin` berhasil
- [ ] `GET /api/reports/harvest` dengan `staff` berhasil
- [ ] `GET /api/reports/harvest?start_date=...&end_date=...` filter berhasil
- [ ] `GET /api/reports/harvest?pond_id=1` filter berhasil
- [ ] `GET /api/reports/harvest?fish_type=Nila` filter berhasil
- [ ] `GET /api/reports/production` berhasil
- [ ] `GET /api/reports/feeding` berhasil
- [ ] `GET /api/reports/export/excel?type=harvest` berhasil download file
- [ ] `GET /api/reports/export/excel?type=production` berhasil download file
- [ ] `GET /api/reports/export/excel?type=feeding` berhasil download file
- [ ] `GET /api/reports/export/pdf?type=harvest` berhasil download file
- [ ] `GET /api/reports/export/pdf?type=production` berhasil download file
- [ ] `GET /api/reports/export/pdf?type=feeding` berhasil download file
- [ ] export dengan `type` tidak valid menghasilkan error validasi

## Activity Log

- [ ] login berhasil menghasilkan activity log `LOGIN`
- [ ] create product menghasilkan activity log `CREATE PRODUCT`
- [ ] update product menghasilkan activity log `UPDATE PRODUCT`
- [ ] delete product menghasilkan activity log `DELETE PRODUCT`
- [ ] create pond menghasilkan activity log
- [ ] create fish batch menghasilkan activity log
- [ ] create feeding log menghasilkan activity log
- [ ] create harvest menghasilkan activity log
- [ ] `GET /api/activity-logs` dengan `admin` berhasil
- [ ] `GET /api/activity-logs` dengan role selain admin ditolak `403`
- [ ] `GET /api/activity-logs?page=1&limit=10` pagination normal
- [ ] `GET /api/activity-logs?module=PRODUCT` filter berhasil
- [ ] `GET /api/activity-logs?action=CREATE` filter berhasil
- [ ] `GET /api/activity-logs?user_id=1` filter berhasil
- [ ] `GET /api/activity-logs/:id` dengan admin berhasil

## Notification Center

- [ ] `GET /api/notifications` dengan user login berhasil
- [ ] hanya notifikasi milik user login yang tampil
- [ ] `GET /api/notifications?type=ORDER` filter berhasil
- [ ] `GET /api/notifications?page=1&limit=10` pagination normal
- [ ] `GET /api/notifications/unread` berhasil
- [ ] `PUT /api/notifications/:id/read` berhasil mengubah `is_read=true`
- [ ] `PUT /api/notifications/read-all` berhasil menandai semua notif terbaca
- [ ] `DELETE /api/notifications/:id` berhasil
- [ ] create order menghasilkan notifikasi `ORDER`
- [ ] create harvest menghasilkan notifikasi `HARVEST`
- [ ] low stock menghasilkan notifikasi `INVENTORY`

## Cart

- [ ] `POST /api/cart` dengan `customer` berhasil tambah item
- [ ] `POST /api/cart` dengan role selain customer ditolak
- [ ] tambah produk yang sama lagi membuat quantity bertambah, bukan item baru
- [ ] tambah cart dengan `quantity <= 0` gagal validasi
- [ ] tambah cart dengan `product_id` tidak ada gagal
- [ ] tambah cart dengan inventory tidak cukup gagal
- [ ] `GET /api/cart` menampilkan daftar item
- [ ] `GET /api/cart` menampilkan `subtotal`
- [ ] `GET /api/cart` menampilkan `total_price`
- [ ] `PUT /api/cart/:id` berhasil update quantity
- [ ] update quantity melebihi inventory gagal
- [ ] `DELETE /api/cart/:id` berhasil hapus satu item
- [ ] `DELETE /api/cart` berhasil kosongkan cart

## Checkout

- [ ] `POST /api/checkout` dengan `customer` berhasil
- [ ] response mengembalikan `invoice`
- [ ] cart otomatis kosong setelah checkout
- [ ] order baru tercipta di database
- [ ] order item tercipta
- [ ] total price order benar
- [ ] inventory berkurang setelah checkout
- [ ] inventory transaction `OUT` tercatat
- [ ] activity log checkout tercatat
- [ ] notification order created tercatat
- [ ] checkout saat cart kosong gagal
- [ ] checkout saat inventory tidak cukup gagal

## Order Management

- [ ] `GET /api/orders` dengan `admin` menampilkan semua order
- [ ] `GET /api/orders` dengan `customer` hanya menampilkan order miliknya
- [ ] `GET /api/orders?page=1&limit=10` pagination normal
- [ ] `GET /api/orders/:id` dengan owner berhasil
- [ ] `GET /api/orders/:id` dengan customer lain ditolak
- [ ] `PUT /api/orders/:id/status` dengan `admin` berhasil ubah ke `pending`
- [ ] `PUT /api/orders/:id/status` dengan `admin` berhasil ubah ke `processing`
- [ ] `PUT /api/orders/:id/status` dengan `admin` berhasil ubah ke `shipping`
- [ ] `PUT /api/orders/:id/status` dengan `admin` berhasil ubah ke `completed`
- [ ] `PUT /api/orders/:id/status` dengan `admin` berhasil ubah ke `cancelled`
- [ ] update status invalid gagal validasi
- [ ] saat status jadi `completed`, activity log tercatat
- [ ] `PUT /api/orders/:id/payment` dengan `admin` berhasil ubah ke `paid`
- [ ] `PUT /api/orders/:id/payment` dengan `admin` berhasil ubah ke `unpaid`
- [ ] payment status invalid gagal validasi
- [ ] `GET /api/orders/:id/invoice` berhasil download PDF invoice

## Swagger and Response Consistency

- [ ] semua endpoint penting muncul di Swagger
- [ ] endpoint protected menampilkan kebutuhan bearer token di Swagger
- [ ] success response memakai format helper global
- [ ] validation error memakai format helper global
- [ ] unauthorized response konsisten
- [ ] forbidden response konsisten
- [ ] not found response konsisten
- [ ] internal server error response konsisten

## Docker and Static Files

- [✔] `http://localhost/` berhasil
- [✔] `http://localhost/swagger/index.html` berhasil
- [✔] `http://localhost/uploads/products/<filename>` berhasil untuk file valid
- [✔] file upload tetap ada setelah container restart
- [✔] `docker compose logs --tail=100 backend` tidak menunjukkan error besar
- [✔] `docker compose logs --tail=100 nginx` tidak menunjukkan `502`
- [✔] `docker compose logs --tail=100 mysql` tidak menunjukkan error koneksi/auth
