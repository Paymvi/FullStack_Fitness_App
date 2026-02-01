// .go
// Fitness App - MongoDB Database Functions
// by Kyle Furey

package Fitness_App

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DBData - Stores all related information to a MongoDB connection.
type DBData struct {
	Client        *mongo.Client
	Database      *mongo.Database
	Timestamps    *mongo.Collection
	WeightLifting *mongo.Collection
	WeightRunning *mongo.Collection
}

// DBConnect () - Establishes a connection with MongoDB.
func DBConnect(uri string) (DBData, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return DBData{}, err
	}
	if err := client.Ping(ctx, nil); err != nil {
		return DBData{}, err
	}
	db := client.Database("FitnessApp")
	timestamps := db.Collection("Timestamps")
	weightLifting := db.Collection("WeightLifting")
	running := db.Collection("Running")
	return DBData{
		client,
		db,
		timestamps,
		weightLifting,
		running,
	}, nil
}
