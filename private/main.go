// .go
// Fitness App - Server Entry Point
// by Kyle Furey

package main

import (
	"log"
	"os"
)

// main () - The entry point of the Fitness App server.
func main() {
	uri := os.Getenv("MONGO_URI")
	db, err := DBConnect(uri)
	if err != nil {
		log.Fatal("Server failed to connect to MongoDB!\n", err)
	}
	defer func() { _ = db.Disconnect() }()
	RunServer(&db)
}
