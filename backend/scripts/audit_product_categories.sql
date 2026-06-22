-- Audit kategori produk sebelum normalisasi.
-- Tujuan:
-- 1. Melihat kategori mentah yang tersimpan di tabel products
-- 2. Mengidentifikasi produk dengan kategori ambigu
-- 3. Memberi kandidat kategori standar berdasarkan fish batch atau nama produk
-- 4. Memisahkan data yang aman diubah otomatis vs perlu review manual

-- Standar kategori target:
-- Nila, Lele, Patin, Gurame, Bawal, Bandeng

-- =========================================================
-- Ringkasan kategori saat ini
-- =========================================================
SELECT
  category,
  COUNT(*) AS total_produk
FROM products
GROUP BY category
ORDER BY total_produk DESC, category ASC;

-- =========================================================
-- Audit detail produk dengan kategori ambigu
-- Ambigu = kategori di luar daftar standar target
-- =========================================================
SELECT
  p.id,
  p.name,
  p.category AS kategori_saat_ini,
  p.status,
  p.stock,
  p.fish_batch_id,
  fb.batch_code,
  fb.fish_type,
  CASE
    WHEN fb.fish_type IN ('Nila', 'Lele', 'Patin', 'Gurame', 'Bawal', 'Bandeng') THEN fb.fish_type
    WHEN LOWER(p.name) LIKE '%nila%' THEN 'Nila'
    WHEN LOWER(p.name) LIKE '%lele%' THEN 'Lele'
    WHEN LOWER(p.name) LIKE '%patin%' THEN 'Patin'
    WHEN LOWER(p.name) LIKE '%gurame%' THEN 'Gurame'
    WHEN LOWER(p.name) LIKE '%bawal%' THEN 'Bawal'
    WHEN LOWER(p.name) LIKE '%bandeng%' THEN 'Bandeng'
    WHEN LOWER(p.description) LIKE '%nila%' THEN 'Nila'
    WHEN LOWER(p.description) LIKE '%lele%' THEN 'Lele'
    WHEN LOWER(p.description) LIKE '%patin%' THEN 'Patin'
    WHEN LOWER(p.description) LIKE '%gurame%' THEN 'Gurame'
    WHEN LOWER(p.description) LIKE '%bawal%' THEN 'Bawal'
    WHEN LOWER(p.description) LIKE '%bandeng%' THEN 'Bandeng'
    ELSE NULL
  END AS kandidat_kategori,
  CASE
    WHEN fb.fish_type IN ('Nila', 'Lele', 'Patin', 'Gurame', 'Bawal', 'Bandeng') THEN 'pasti_dari_batch'
    WHEN LOWER(p.name) LIKE '%nila%'
      OR LOWER(p.name) LIKE '%lele%'
      OR LOWER(p.name) LIKE '%patin%'
      OR LOWER(p.name) LIKE '%gurame%'
      OR LOWER(p.name) LIKE '%bawal%'
      OR LOWER(p.name) LIKE '%bandeng%' THEN 'indikasi_dari_nama'
    WHEN LOWER(p.description) LIKE '%nila%'
      OR LOWER(p.description) LIKE '%lele%'
      OR LOWER(p.description) LIKE '%patin%'
      OR LOWER(p.description) LIKE '%gurame%'
      OR LOWER(p.description) LIKE '%bawal%'
      OR LOWER(p.description) LIKE '%bandeng%' THEN 'indikasi_dari_deskripsi'
    ELSE 'perlu_review_manual'
  END AS tingkat_keyakinan
FROM products p
LEFT JOIN fish_batches fb ON fb.id = p.fish_batch_id
WHERE p.category NOT IN ('Nila', 'Lele', 'Patin', 'Gurame', 'Bawal', 'Bandeng')
ORDER BY
  CASE
    WHEN fb.fish_type IN ('Nila', 'Lele', 'Patin', 'Gurame', 'Bawal', 'Bandeng') THEN 1
    WHEN LOWER(p.name) LIKE '%nila%'
      OR LOWER(p.name) LIKE '%lele%'
      OR LOWER(p.name) LIKE '%patin%'
      OR LOWER(p.name) LIKE '%gurame%'
      OR LOWER(p.name) LIKE '%bawal%'
      OR LOWER(p.name) LIKE '%bandeng%' THEN 2
    WHEN LOWER(p.description) LIKE '%nila%'
      OR LOWER(p.description) LIKE '%lele%'
      OR LOWER(p.description) LIKE '%patin%'
      OR LOWER(p.description) LIKE '%gurame%'
      OR LOWER(p.description) LIKE '%bawal%'
      OR LOWER(p.description) LIKE '%bandeng%' THEN 3
    ELSE 4
  END,
  p.category,
  p.name;

-- =========================================================
-- Ringkasan kandidat normalisasi
-- Dipakai untuk melihat berapa produk yang aman diubah otomatis
-- =========================================================
SELECT
  hasil.tingkat_keyakinan,
  COALESCE(hasil.kandidat_kategori, 'tidak_terdeteksi') AS kandidat_kategori,
  COUNT(*) AS total_produk
FROM (
  SELECT
    CASE
      WHEN fb.fish_type IN ('Nila', 'Lele', 'Patin', 'Gurame', 'Bawal', 'Bandeng') THEN fb.fish_type
      WHEN LOWER(p.name) LIKE '%nila%' THEN 'Nila'
      WHEN LOWER(p.name) LIKE '%lele%' THEN 'Lele'
      WHEN LOWER(p.name) LIKE '%patin%' THEN 'Patin'
      WHEN LOWER(p.name) LIKE '%gurame%' THEN 'Gurame'
      WHEN LOWER(p.name) LIKE '%bawal%' THEN 'Bawal'
      WHEN LOWER(p.name) LIKE '%bandeng%' THEN 'Bandeng'
      WHEN LOWER(p.description) LIKE '%nila%' THEN 'Nila'
      WHEN LOWER(p.description) LIKE '%lele%' THEN 'Lele'
      WHEN LOWER(p.description) LIKE '%patin%' THEN 'Patin'
      WHEN LOWER(p.description) LIKE '%gurame%' THEN 'Gurame'
      WHEN LOWER(p.description) LIKE '%bawal%' THEN 'Bawal'
      WHEN LOWER(p.description) LIKE '%bandeng%' THEN 'Bandeng'
      ELSE NULL
    END AS kandidat_kategori,
    CASE
      WHEN fb.fish_type IN ('Nila', 'Lele', 'Patin', 'Gurame', 'Bawal', 'Bandeng') THEN 'pasti_dari_batch'
      WHEN LOWER(p.name) LIKE '%nila%'
        OR LOWER(p.name) LIKE '%lele%'
        OR LOWER(p.name) LIKE '%patin%'
        OR LOWER(p.name) LIKE '%gurame%'
        OR LOWER(p.name) LIKE '%bawal%'
        OR LOWER(p.name) LIKE '%bandeng%' THEN 'indikasi_dari_nama'
      WHEN LOWER(p.description) LIKE '%nila%'
        OR LOWER(p.description) LIKE '%lele%'
        OR LOWER(p.description) LIKE '%patin%'
        OR LOWER(p.description) LIKE '%gurame%'
        OR LOWER(p.description) LIKE '%bawal%'
        OR LOWER(p.description) LIKE '%bandeng%' THEN 'indikasi_dari_deskripsi'
      ELSE 'perlu_review_manual'
    END AS tingkat_keyakinan
  FROM products p
  LEFT JOIN fish_batches fb ON fb.id = p.fish_batch_id
  WHERE p.category NOT IN ('Nila', 'Lele', 'Patin', 'Gurame', 'Bawal', 'Bandeng')
) AS hasil
GROUP BY hasil.tingkat_keyakinan, COALESCE(hasil.kandidat_kategori, 'tidak_terdeteksi')
ORDER BY hasil.tingkat_keyakinan, kandidat_kategori;
