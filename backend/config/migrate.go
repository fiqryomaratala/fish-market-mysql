package config

import "github.com/fiqryomaratala/backend/internal/models"

func Migrate() {
	DB.AutoMigrate(
		&models.User{},
		&models.ActivityLog{},
		&models.Notification{},
		&models.Product{},
		&models.Pond{},
		&models.FishBatch{},
		&models.FeedingLog{},
		&models.Harvest{},
		&models.Inventory{},
		&models.InventoryTransaction{},
		&models.Cart{},
		&models.Order{},
		&models.OrderItem{},
	)

	normalizeLegacyProductStatuses()
	normalizeLegacyProductCategories()
}

func normalizeLegacyProductStatuses() {
	DB.Exec(`
		UPDATE products
		SET status = 'hidden'
		WHERE LOWER(TRIM(COALESCE(status, ''))) = 'hidden'
	`)

	DB.Exec(`
		UPDATE products
		SET status = 'out_of_stock'
		WHERE stock <= 0
			OR LOWER(TRIM(COALESCE(status, ''))) = 'out_of_stock'
	`)

	DB.Exec(`
		UPDATE products
		SET status = 'available'
		WHERE stock > 0
			AND LOWER(TRIM(COALESCE(status, ''))) NOT IN ('hidden', 'out_of_stock', 'available')
	`)

	DB.Exec(`
		UPDATE products
		SET status = 'available'
		WHERE stock > 0
			AND LOWER(TRIM(COALESCE(status, ''))) = 'available'
	`)
}

func normalizeLegacyProductCategories() {
	DB.Exec(`
		UPDATE products
		SET category = CASE
			WHEN LOWER(TRIM(COALESCE(category, ''))) = 'nila' THEN 'Nila'
			WHEN LOWER(TRIM(COALESCE(category, ''))) = 'lele' THEN 'Lele'
			WHEN LOWER(TRIM(COALESCE(category, ''))) = 'patin' THEN 'Patin'
			WHEN LOWER(TRIM(COALESCE(category, ''))) = 'gurame' THEN 'Gurame'
			WHEN LOWER(TRIM(COALESCE(category, ''))) = 'bawal' THEN 'Bawal'
			WHEN LOWER(TRIM(COALESCE(category, ''))) = 'bandeng' THEN 'Bandeng'
			ELSE category
		END
	`)

	DB.Exec(`
		UPDATE products
		SET category = CASE
			WHEN LOWER(name) LIKE '%nila%' THEN 'Nila'
			WHEN LOWER(name) LIKE '%lele%' THEN 'Lele'
			WHEN LOWER(name) LIKE '%patin%' THEN 'Patin'
			WHEN LOWER(name) LIKE '%gurame%' THEN 'Gurame'
			WHEN LOWER(name) LIKE '%bawal%' THEN 'Bawal'
			WHEN LOWER(name) LIKE '%bandeng%' THEN 'Bandeng'
			ELSE category
		END
		WHERE LOWER(name) LIKE '%nila%'
			OR LOWER(name) LIKE '%lele%'
			OR LOWER(name) LIKE '%patin%'
			OR LOWER(name) LIKE '%gurame%'
			OR LOWER(name) LIKE '%bawal%'
			OR LOWER(name) LIKE '%bandeng%'
	`)

	DB.Exec(`
		UPDATE products p
		JOIN fish_batches fb ON fb.id = p.fish_batch_id
		SET p.category = CASE
			WHEN LOWER(TRIM(COALESCE(fb.fish_type, ''))) = 'nila' THEN 'Nila'
			WHEN LOWER(TRIM(COALESCE(fb.fish_type, ''))) = 'lele' THEN 'Lele'
			WHEN LOWER(TRIM(COALESCE(fb.fish_type, ''))) = 'patin' THEN 'Patin'
			WHEN LOWER(TRIM(COALESCE(fb.fish_type, ''))) = 'gurame' THEN 'Gurame'
			WHEN LOWER(TRIM(COALESCE(fb.fish_type, ''))) = 'bawal' THEN 'Bawal'
			WHEN LOWER(TRIM(COALESCE(fb.fish_type, ''))) = 'bandeng' THEN 'Bandeng'
			ELSE p.category
		END
		WHERE LOWER(p.category) NOT IN ('nila', 'lele', 'patin', 'gurame', 'bawal', 'bandeng')
			AND LOWER(p.name) NOT LIKE '%nila%'
			AND LOWER(p.name) NOT LIKE '%lele%'
			AND LOWER(p.name) NOT LIKE '%patin%'
			AND LOWER(p.name) NOT LIKE '%gurame%'
			AND LOWER(p.name) NOT LIKE '%bawal%'
			AND LOWER(p.name) NOT LIKE '%bandeng%'
			AND LOWER(TRIM(COALESCE(fb.fish_type, ''))) IN ('nila', 'lele', 'patin', 'gurame', 'bawal', 'bandeng')
	`)
}
