# Testing Checklist

Checklist ini dipakai untuk QA manual backend Marketplace Ikan dan Sistem Manajemen Budidaya.

## Status Audit

Gunakan arti status berikut saat membaca checklist ini:

- `covered otomatis`: sudah punya bukti lewat Go integration test dan/atau Postman/Newman regression.
- `manual`: masih perlu diuji manual karena belum ada automation yang cukup spesifik atau perlu verifikasi visual/runtime nyata.
- `parsial`: sebagian alur sudah teruji otomatis, tetapi belum aman untuk mengklaim seluruh item pada modul tersebut selesai.

Ringkasan status saat ini:

- Authentication + akses dasar: `covered otomatis`
- Product + upload file dasar: `covered otomatis`
- Pond Management: `parsial`
- Fish Batch Management: `parsial`
- Feeding Logs: `parsial`
- Harvest Management: `parsial`
- Inventory Management: `parsial`
- Tracking Batch: `parsial`
- Dashboard Analytics: `covered otomatis` untuk endpoint utama, `manual` untuk validasi angka detail
- Reports: `parsial`
- Activity Log: `parsial`
- Notification Center: `parsial`
- Cart: `parsial`
- Checkout: `parsial`
- Order Management: `parsial`
- Swagger and Response Consistency: `manual`
- Docker and Static Files: `manual`, kecuali item yang sudah kamu verifikasi langsung

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
- `internal/tests/integration_validation_rbac_test.go`

Jalankan dengan:

```bash
go test ./internal/tests -run "TestIntegration(AuthProductFlow|PondBatchHarvestInventoryFlow|CartCheckoutOrderFlow|FeedingNotificationActivityTrackingFlow|ReportsAndDashboardFlow|ManagementCRUDFlow|ValidationRBACAndCartEdgeFlow)" -v
```

Regression gabungan Go + Newman:

```bash
npm install
npm run test:regression
```

File Newman:

- `postman/FishMarket.postman_collection.json`
- `postman/FishMarket.local.postman_environment.json`

Catatan penting:

- Daftar endpoint di bagian ini berarti endpoint/alur utamanya sudah pernah disentuh automation.
- Ini bukan berarti seluruh skenario validasi negatif, RBAC, filter, pagination, dan edge case di modul tersebut sudah 100% selesai.
- Untuk menyatakan sebuah modul "selesai diuji", tetap perlu melihat status `covered otomatis`, `parsial`, atau `manual` pada ringkasan audit di atas.
- Item checklist yang ditandai `[x]` di bawah berarti sudah punya coverage langsung dari Postman + Newman pada endpoint/alur tersebut.

## Manual-First Checks

Bagian ini memang lebih tepat diuji manual atau semi-manual:

- Swagger UI di browser, termasuk tombol authorize dan tampilan dokumentasi.
- Akses file statis via browser seperti `/uploads/...`.
- Ketahanan file upload setelah restart container.
- Pemeriksaan log container `backend`, `nginx`, dan `mysql`.
- Validasi perilaku deployment/runtime nyata yang bergantung pada Docker, Nginx, volume, dan environment lokal.

## Persiapan

Status modul: `manual`

- [ ] Siapkan token `admin`
- [ ] Siapkan token `staff`
- [ ] Siapkan token `customer`
- [x] Pastikan database sudah terisi data seeder
- [x] Pastikan `docker compose ps` semua container sehat
- [x] Pastikan `http://localhost/swagger/index.html` bisa dibuka

## Pond Management

Status modul: `parsial`

Sudah ada bukti automation untuk create, list, detail, update, dan delete.
Masih perlu QA manual untuk seluruh validasi negatif dan seluruh skenario RBAC per role.

- [x] `POST /api/ponds` dengan `admin` berhasil create pond
- [ ] `POST /api/ponds` dengan `staff` berhasil create pond
- [ ] `POST /api/ponds` dengan `customer` ditolak `403`
- [ ] `POST /api/ponds` dengan `name` kosong gagal validasi
- [ ] `POST /api/ponds` dengan `capacity < 0` gagal validasi
- [ ] `POST /api/ponds` dengan `area < 0` gagal validasi
- [ ] `GET /api/ponds` dengan `admin` berhasil
- [x] `GET /api/ponds` dengan `staff` berhasil
- [x] `GET /api/ponds?search=Kolam` mengembalikan hasil sesuai
- [x] `GET /api/ponds?page=1&limit=10` pagination normal
- [x] `GET /api/ponds/:id` dengan ID valid berhasil
- [ ] `GET /api/ponds/:id` dengan ID tidak ada menghasilkan not found
- [ ] `PUT /api/ponds/:id` dengan `admin` berhasil update
- [x] `PUT /api/ponds/:id` dengan `staff` berhasil update
- [x] `DELETE /api/ponds/:id` dengan `admin` berhasil delete
- [ ] `DELETE /api/ponds/:id` dengan `staff` ditolak `403`

## Fish Batch Management

Status modul: `parsial`

Sudah ada bukti automation untuk create, list, detail, update, delete, dan format batch code.
Masih perlu QA manual untuk skenario pond tidak ada, pond nonaktif, serta semua validasi negatif lain.

- [ ] `POST /api/batches` dengan `admin` berhasil create
- [x] `POST /api/batches` dengan `staff` berhasil create
- [ ] `POST /api/batches` dengan `customer` ditolak `403`
- [ ] batch code otomatis terbentuk format `BTCH-2026-0001`
- [ ] `current_count` otomatis sama dengan `seed_count`
- [ ] `status` otomatis `active`
- [ ] create batch dengan `pond_id` yang tidak ada gagal
- [ ] create batch dengan pond nonaktif gagal
- [ ] `GET /api/batches` berhasil
- [ ] `GET /api/batches?fish_type=Nila` filter berhasil
- [ ] `GET /api/batches?pond_id=1` filter berhasil
- [x] `GET /api/batches?status=active` filter berhasil
- [ ] `GET /api/batches?page=1&limit=10` pagination normal
- [x] `GET /api/batches/:id` menampilkan data pond
- [ ] `PUT /api/batches/:id` dengan `admin` berhasil
- [x] `PUT /api/batches/:id` dengan `staff` berhasil
- [x] `DELETE /api/batches/:id` dengan `admin` berhasil
- [ ] `DELETE /api/batches/:id` dengan `staff` ditolak `403`

## Feeding Logs

Status modul: `parsial`

Sudah ada bukti automation untuk create, list, detail, update, dan delete.
Masih perlu QA manual untuk skenario invalid batch, validasi field kosong, dan RBAC detail.

- [ ] `POST /api/feeding-logs` dengan `admin` berhasil
- [x] `POST /api/feeding-logs` dengan `staff` berhasil
- [ ] `POST /api/feeding-logs` dengan `customer` ditolak `403`
- [ ] create feeding log dengan `fish_batch_id` tidak ada gagal
- [ ] create feeding log dengan `feed_type` kosong gagal validasi
- [ ] create feeding log dengan `feed_amount <= 0` gagal validasi
- [x] `GET /api/feeding-logs` berhasil
- [x] `GET /api/feeding-logs?fish_batch_id=1` filter berhasil
- [ ] `GET /api/feeding-logs?start_date=2026-08-01&end_date=2026-08-31` filter tanggal berhasil
- [x] `GET /api/feeding-logs/:id` menampilkan relasi batch
- [ ] `PUT /api/feeding-logs/:id` dengan `admin` berhasil
- [x] `PUT /api/feeding-logs/:id` dengan `staff` berhasil
- [x] `DELETE /api/feeding-logs/:id` dengan `admin` berhasil
- [ ] `DELETE /api/feeding-logs/:id` dengan `staff` ditolak `403`

## Harvest Management

Status modul: `parsial`

Sudah ada bukti automation untuk create, detail, summary, perubahan status batch, dan penambahan inventory.
Masih perlu QA manual untuk validasi negatif, filter tanggal penuh, update/delete, dan seluruh skenario RBAC.

- [x] `POST /api/harvests` dengan `admin` berhasil
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
- [x] `GET /api/harvests/:id` berhasil
- [ ] `PUT /api/harvests/:id` dengan `admin` berhasil
- [ ] `PUT /api/harvests/:id` dengan `staff` berhasil
- [ ] `DELETE /api/harvests/:id` dengan `admin` berhasil
- [ ] `DELETE /api/harvests/:id` dengan `staff` ditolak `403`
- [x] `GET /api/harvests/summary` mengembalikan total harvest, weight, fish

## Inventory Management

Status modul: `parsial`

Sudah ada bukti automation untuk list, detail, transaction `IN`/`OUT`/`ADJUSTMENT`, dan adjustment.
Masih perlu QA manual untuk semua filter spesifik, not found, serta penolakan role `customer`.

- [x] `GET /api/inventory` dengan `admin` berhasil
- [ ] `GET /api/inventory` dengan `staff` berhasil
- [ ] `GET /api/inventory` dengan `customer` ditolak
- [ ] `GET /api/inventory?page=1&limit=10` pagination normal
- [ ] `GET /api/inventory?product_id=1` filter berhasil
- [ ] `GET /api/inventory?batch_id=1` filter berhasil
- [x] `GET /api/inventory/:id` dengan ID valid berhasil
- [ ] `GET /api/inventory/:id` dengan ID tidak ada menghasilkan not found
- [ ] `GET /api/inventory/transactions` dengan `admin` berhasil
- [x] `GET /api/inventory/transactions?type=IN` filter berhasil
- [ ] `GET /api/inventory/transactions?type=OUT` filter berhasil
- [x] `GET /api/inventory/transactions?type=ADJUSTMENT` filter berhasil
- [x] `POST /api/inventory/adjustment` dengan nilai positif berhasil
- [ ] `POST /api/inventory/adjustment` dengan nilai negatif berhasil
- [ ] adjustment membuat inventory transaction baru
- [ ] adjustment pada inventory tidak ada menghasilkan not found

## Tracking Batch

Status modul: `parsial`

Sudah ada bukti automation bahwa endpoint tracking publik berjalan dan menampilkan relasi utama.
Masih perlu QA manual untuk skenario `404 Batch not found` dan pengecekan struktur response lebih detail.

- [x] `GET /api/tracking/:batchCode` tanpa login berhasil
- [ ] response menampilkan pond
- [ ] response menampilkan data batch
- [ ] response menampilkan feeding logs
- [ ] response menampilkan harvests
- [ ] batch code tidak ada menghasilkan `404 Batch not found`

## Dashboard Analytics

Status modul: `covered otomatis`

Endpoint utama dashboard sudah tercakup automation.
Masih disarankan QA manual bila ingin memastikan akurasi angka terhadap data database nyata.

- [ ] `GET /api/dashboard` dengan `admin` berhasil
- [x] `GET /api/dashboard` dengan `staff` berhasil
- [ ] `GET /api/dashboard` dengan `customer` ditolak `403`
- [ ] summary menampilkan total products, ponds, batches, active batches, harvests, weight, feeding logs
- [x] `GET /api/dashboard/production` berhasil
- [x] `GET /api/dashboard/harvest` berhasil
- [x] `GET /api/dashboard/feed` berhasil
- [x] `GET /api/dashboard/batch-status` berhasil
- [x] `GET /api/dashboard/recent-harvest` berhasil

## Reports

Status modul: `parsial`

Sudah ada bukti automation untuk endpoint report utama dan export harvest ke Excel/PDF.
Masih perlu QA manual untuk seluruh variasi filter dan export type lain seperti `production` dan `feeding`.

- [x] `GET /api/reports/harvest` dengan `admin` berhasil
- [ ] `GET /api/reports/harvest` dengan `staff` berhasil
- [ ] `GET /api/reports/harvest?start_date=...&end_date=...` filter berhasil
- [ ] `GET /api/reports/harvest?pond_id=1` filter berhasil
- [ ] `GET /api/reports/harvest?fish_type=Nila` filter berhasil
- [x] `GET /api/reports/production` berhasil
- [x] `GET /api/reports/feeding` berhasil
- [x] `GET /api/reports/export/excel?type=harvest` berhasil download file
- [ ] `GET /api/reports/export/excel?type=production` berhasil download file
- [ ] `GET /api/reports/export/excel?type=feeding` berhasil download file
- [x] `GET /api/reports/export/pdf?type=harvest` berhasil download file
- [ ] `GET /api/reports/export/pdf?type=production` berhasil download file
- [ ] `GET /api/reports/export/pdf?type=feeding` berhasil download file
- [ ] export dengan `type` tidak valid menghasilkan error validasi

## Activity Log

Status modul: `parsial`

Sudah ada bukti automation untuk login activity, create activity di beberapa modul, list, dan detail.
Masih perlu QA manual untuk seluruh filter query, RBAC negatif, dan verifikasi semua action lintas modul.

- [x] login berhasil menghasilkan activity log `LOGIN`
- [x] create product menghasilkan activity log `CREATE PRODUCT`
- [x] update product menghasilkan activity log `UPDATE PRODUCT`
- [x] delete product menghasilkan activity log `DELETE PRODUCT`
- [x] create pond menghasilkan activity log
- [x] create fish batch menghasilkan activity log
- [x] create feeding log menghasilkan activity log
- [x] create harvest menghasilkan activity log
- [x] `GET /api/activity-logs` dengan `admin` berhasil
- [ ] `GET /api/activity-logs` dengan role selain admin ditolak `403`
- [ ] `GET /api/activity-logs?page=1&limit=10` pagination normal
- [ ] `GET /api/activity-logs?module=PRODUCT` filter berhasil
- [ ] `GET /api/activity-logs?action=CREATE` filter berhasil
- [ ] `GET /api/activity-logs?user_id=1` filter berhasil
- [x] `GET /api/activity-logs/:id` dengan admin berhasil

## Notification Center

Status modul: `parsial`

Sudah ada bukti automation untuk list, unread, mark read, mark all, delete, dan notifikasi dari harvest/order pada sebagian flow.
Masih perlu QA manual untuk filter type, pagination, isolasi notifikasi per user, dan low stock pada data nyata.

- [x] `GET /api/notifications` dengan user login berhasil
- [ ] hanya notifikasi milik user login yang tampil
- [ ] `GET /api/notifications?type=ORDER` filter berhasil
- [ ] `GET /api/notifications?page=1&limit=10` pagination normal
- [x] `GET /api/notifications/unread` berhasil
- [x] `PUT /api/notifications/:id/read` berhasil mengubah `is_read=true`
- [x] `PUT /api/notifications/read-all` berhasil menandai semua notif terbaca
- [x] `DELETE /api/notifications/:id` berhasil
- [ ] create order menghasilkan notifikasi `ORDER`
- [ ] create harvest menghasilkan notifikasi `HARVEST`
- [ ] low stock menghasilkan notifikasi `INVENTORY`

## Cart

Status modul: `parsial`

Sudah ada automation untuk add, get, update, delete, dan clear cart, tetapi flow ini sempat membutuhkan penyesuaian dataset regression.
Masih perlu QA manual untuk semua skenario validasi negatif, quantity merge, dan penolakan role non-customer.

- [x] `POST /api/cart` dengan `customer` berhasil tambah item
- [ ] `POST /api/cart` dengan role selain customer ditolak
- [ ] tambah produk yang sama lagi membuat quantity bertambah, bukan item baru
- [ ] tambah cart dengan `quantity <= 0` gagal validasi
- [ ] tambah cart dengan `product_id` tidak ada gagal
- [ ] tambah cart dengan inventory tidak cukup gagal
- [x] `GET /api/cart` menampilkan daftar item
- [ ] `GET /api/cart` menampilkan `subtotal`
- [ ] `GET /api/cart` menampilkan `total_price`
- [x] `PUT /api/cart/:id` berhasil update quantity
- [ ] update quantity melebihi inventory gagal
- [ ] `DELETE /api/cart/:id` berhasil hapus satu item
- [x] `DELETE /api/cart` berhasil kosongkan cart

## Checkout

Status modul: `parsial`

Sudah ada bukti automation untuk checkout sukses, invoice, cart clear, order terbentuk, inventory berkurang, dan transaction `OUT`.
Masih perlu QA manual untuk skenario cart kosong, inventory tidak cukup, serta verifikasi nilai total pada database nyata.

- [x] `POST /api/checkout` dengan `customer` berhasil
- [x] response mengembalikan `invoice`
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

Status modul: `parsial`

Sudah ada bukti automation untuk list order, detail, update payment, update status, dan download invoice.
Masih perlu QA manual untuk seluruh variasi status, validasi invalid status/payment, owner mismatch, dan pagination yang lebih menyeluruh.

- [x] `GET /api/orders` dengan `admin` menampilkan semua order
- [x] `GET /api/orders` dengan `customer` hanya menampilkan order miliknya
- [ ] `GET /api/orders?page=1&limit=10` pagination normal
- [x] `GET /api/orders/:id` dengan owner berhasil
- [ ] `GET /api/orders/:id` dengan customer lain ditolak
- [ ] `PUT /api/orders/:id/status` dengan `admin` berhasil ubah ke `pending`
- [ ] `PUT /api/orders/:id/status` dengan `admin` berhasil ubah ke `processing`
- [ ] `PUT /api/orders/:id/status` dengan `admin` berhasil ubah ke `shipping`
- [x] `PUT /api/orders/:id/status` dengan `admin` berhasil ubah ke `completed`
- [ ] `PUT /api/orders/:id/status` dengan `admin` berhasil ubah ke `cancelled`
- [ ] update status invalid gagal validasi
- [ ] saat status jadi `completed`, activity log tercatat
- [x] `PUT /api/orders/:id/payment` dengan `admin` berhasil ubah ke `paid`
- [ ] `PUT /api/orders/:id/payment` dengan `admin` berhasil ubah ke `unpaid`
- [ ] payment status invalid gagal validasi
- [x] `GET /api/orders/:id/invoice` berhasil download PDF invoice

## Swagger and Response Consistency

Status modul: `manual`

Sebagian sudah pernah dicek, tetapi belum ada automation yang cukup kuat untuk menyatakan seluruh dokumentasi Swagger dan konsistensi response selesai diverifikasi.

- [ ] semua endpoint penting muncul di Swagger
- [ ] endpoint protected menampilkan kebutuhan bearer token di Swagger
- [ ] success response memakai format helper global
- [ ] validation error memakai format helper global
- [ ] unauthorized response konsisten
- [ ] forbidden response konsisten
- [ ] not found response konsisten
- [ ] internal server error response konsisten

## Docker and Static Files

Status modul: `manual`

Item di bawah ini bergantung pada runtime lokal/container nyata, jadi tetap lebih tepat diverifikasi manual.

- [x] `http://localhost/` berhasil
- [x] `http://localhost/swagger/index.html` berhasil
- [x] `http://localhost/uploads/products/<filename>` berhasil untuk file valid
- [x] file upload tetap ada setelah container restart
- [x] `docker compose logs --tail=100 backend` tidak menunjukkan error besar
- [x] `docker compose logs --tail=100 nginx` tidak menunjukkan `502`
- [x] `docker compose logs --tail=100 mysql` tidak menunjukkan error koneksi/auth
