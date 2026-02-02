// .go
// Fitness App - Table Row Declarations
// by Kyle Furey

package Fitness_App

// TimestampRecord - A single Unix timestamp used to index each row.
type TimestampRecord uint64

// WeightLiftingRecord - Tracks user-entered data for weight lifting.
type WeightLiftingRecord struct {
	Timestamp TimestampRecord `json:"timestamp"  bson:"timestamp"`
	Exercise  string          `json:"exercise"   bson:"exercise"`
	WeightLbs uint32          `json:"weight_lbs" bson:"weight_lbs"`
	TotalSets uint32          `json:"total_sets" bson:"total_sets"`
}

// RunningRecord - Tracks user-entered data for running.
type RunningRecord struct {
	Timestamp     TimestampRecord `json:"timestamp"      bson:"timestamp"`
	DistanceMiles float32         `json:"distance_miles" bson:"distance_miles"`
	ElapsedSecs   float32         `json:"elapsed_secs"   bson:"elapsed_secs"`
	SpeedMph      float32         `json:"speed_mph"      bson:"speed_mph"`
	InclineDeg    float32         `json:"incline_deg"    bson:"incline_deg"`
}
