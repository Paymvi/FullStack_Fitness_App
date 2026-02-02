// .go
// Fitness App - MongoDB Database Functions
// by Kyle Furey

package Fitness_App

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DBConnection - Stores all related information to a MongoDB db.
type DBConnection struct {
	Client        *mongo.Client
	Database      *mongo.Database
	Timestamps    *mongo.Collection
	WeightLifting *mongo.Collection
	Running       *mongo.Collection
}

// DBConnect () - Establishes a db with MongoDB or returns an error.
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
	options.Index().SetUnique(true)
	timestamps := db.Collection("timestamps")
	if _, err := timestamps.Indexes().CreateOne(ctx, mongo.IndexModel{Keys: bson.D{{Key: "timestamp", Value: 1}}}); err != nil {
		return DBConnection{}, err
	}
	weightLifting := db.Collection("weight_lifting")
	if _, err := weightLifting.Indexes().CreateOne(ctx, mongo.IndexModel{Keys: bson.D{{Key: "timestamp", Value: 1}}}); err != nil {
		return DBConnection{}, err
	}
	running := db.Collection("running")
	if _, err := running.Indexes().CreateOne(ctx, mongo.IndexModel{Keys: bson.D{{Key: "timestamp", Value: 1}}}); err != nil {
		return DBConnection{}, err
	}
	return DBConnection{
		client,
		db,
		timestamps,
		weightLifting,
		running,
	}, nil
}

// Disconnect () - Disconnects a MongoDB db or returns an error.
func (db *DBConnection) Disconnect() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return db.Client.Disconnect(ctx)
}

// Fetch () - Fetches an array of all timestamps from MongoDB or returns an error.
func (db *DBConnection) Fetch() ([]TimestampRecord, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	filter := bson.M{}
	opts := options.Find().SetProjection(bson.M{"timestamp": 1, "_id": 0})
	cursor, err := db.Timestamps.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	var timestamps []TimestampRecord
	if err := cursor.All(ctx, &timestamps); err != nil {
		return nil, err
	}
	return timestamps, nil
}

// Insert () - Inserts new data into MongoDB with a timestamp or returns an error.
func (db *DBConnection) Insert(
	timestamp TimestampRecord,
	submitWeightLifting bool,
	weightLifting WeightLiftingRecord,
	submitRunning bool,
	running RunningRecord,
) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	weightLifting.Timestamp = timestamp
	running.Timestamp = timestamp
	if _, err := db.Timestamps.InsertOne(ctx, timestamp); err != nil {
		return err
	}
	if submitWeightLifting {
		if _, err := db.WeightLifting.InsertOne(ctx, weightLifting); err != nil {
			return err
		}
	}
	if submitRunning {
		if _, err := db.Running.InsertOne(ctx, running); err != nil {
			return err
		}
	}
	return nil
}

// Find () - Finds the data in MongoDB with the given timestamp or returns an error.
func (db *DBConnection) Find(
	timestamp TimestampRecord,
) (bool, WeightLiftingRecord, bool, RunningRecord, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	var wl WeightLiftingRecord
	var r RunningRecord
	wlFilter := bson.M{"timestamp": timestamp}
	wlFound := true
	if err := db.WeightLifting.FindOne(ctx, wlFilter).Decode(&wl); err != nil {
		if err == mongo.ErrNoDocuments {
			wlFound = false
		} else {
			return false, wl, false, r, err
		}
	}
	runFilter := bson.M{"timestamp": timestamp}
	rFound := true
	if err := db.Running.FindOne(ctx, runFilter).Decode(&r); err != nil {
		if err == mongo.ErrNoDocuments {
			rFound = false
		} else {
			return wlFound, wl, false, r, err
		}
	}
	return wlFound, wl, rFound, r, nil
}

// Delete () - Deletes a timestamp from MongoDB or returns an error.
func (db *DBConnection) Delete(
	timestamp TimestampRecord,
) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if _, err := db.WeightLifting.DeleteMany(ctx, bson.M{"timestamp": timestamp}); err != nil {
		return err
	}
	if _, err := db.Running.DeleteMany(ctx, bson.M{"timestamp": timestamp}); err != nil {
		return err
	}
	if _, err := db.Timestamps.DeleteMany(ctx, bson.M{"timestamp": timestamp}); err != nil {
		return err
	}
	return nil
}
