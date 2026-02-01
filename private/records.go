// .go
// Fitness App - Table Row Declarations
// by Kyle Furey

package Fitness_App

// TimestampRecord - A single Unix timestamp used to index each row.
type TimestampRecord struct {
	Timestamp uint64
}

// WeightLiftingRecord - Tracks user-entered data for weight lifting.
type WeightLiftingRecord struct {
	Timestamp TimestampRecord
	Exercise  string
	WeightLbs uint32
	TotalSets uint32
}

// RunningRecord - Tracks user-entered data for running.
type RunningRecord struct {
	Timestamp     TimestampRecord
	DistanceMiles float32
	ElapsedSec    float32
	SpeedMph      float32
	InclineDeg    float32
}
