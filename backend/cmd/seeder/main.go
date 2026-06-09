package main

import (
	"log"

	"github.com/fiqryomaratala/backend/config"
	"github.com/fiqryomaratala/backend/database/seeders"
)

func main() {
	config.LoadConfig()
	db := config.ConnectDB()
	config.Migrate()

	if err := seeders.RunSeeder(db); err != nil {
		log.Fatal("failed to run seeder: ", err)
	}

	log.Println("database seeding completed successfully")
}
