// .go
// Fitness App - MongoDB Database Functions
// by Kyle Furey

package Fitness_App

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DBConnection - Stores all related information to a MongoDB connection.
type DBConnection struct {
	Client        *mongo.Client
	Database      *mongo.Database
	Timestamps    *mongo.Collection
	WeightLifting *mongo.Collection
	WeightRunning *mongo.Collection
}

// DBConnect () - Establishes a connection with MongoDB or returns an error.
func DBConnect(uri string) (DBConnection, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return DBConnection{}, err
	}
	if err := client.Ping(ctx, nil); err != nil {
		return DBConnection{}, err
	}
	db := client.Database("fitness_app")
	timestamps := db.Collection("timestamps")
	weightLifting := db.Collection("weight_lifting")
	running := db.Collection("running")
	return DBConnection{
		client,
		db,
		timestamps,
		weightLifting,
		running,
	}, nil
}

// Disconnect () - Disconnects a MongoDB connection or returns an error.
func (connection *DBConnection) Disconnect() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return connection.Client.Disconnect(ctx)
}

// Fetch () - Fetches an array of all timestamps from MongoDB or returns an error.
func (connection *DBConnection) Fetch() ([]TimestampRecord, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := connection.Timestamps.Find(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	defer cursor.Close(ctx)

	var timestamps []TimestampRecord
	if err := cursor.All(ctx, &timestamps); err != nil {
		log.Fatal(err)
	}
}

// Insert () - Inserts new data into MongoDB with a timestamp or returns an error.
func (connection *DBConnection) Insert(
	timestamp TimestampRecord,
	submitWeightLifting bool,
	weightLifting WeightLiftingRecord,
	submitRunning bool,
	running RunningRecord,
) error {
}

// Find () - Finds the data in MongoDB with the given timestamp or returns an error.
func (connection *DBConnection) Find(
	timestamp TimestampRecord,
) (bool, WeightLiftingRecord, bool, RunningRecord, error) {
}

// Delete () - Deletes a timestamp from MongoDB or returns an error.
func (connection *DBConnection) Delete(
	timestamp TimestampRecord,
) error {
}
