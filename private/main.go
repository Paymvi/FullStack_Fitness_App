// .go
// Fitness App - Server Entry Point
// by Kyle Furey

package main

import (
	"log"
)

// main () - The entry point of the Fitness App server.
func main() {
	uri := "mongodb://localhost:27017"
	db, err := DBConnect(uri)
	if err != nil {
		log.Fatal("Server failed to connect to MongoDB!\n", err)
	}
	defer func() { _ = db.Disconnect() }()
	RunServer(&db)
}
