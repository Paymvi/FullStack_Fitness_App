// .go
// Fitness App - Serialization Functions
// by Kyle Furey

package Fitness_App

import "encoding/json"

// TimestampToJson () - Converts a TimestampRecord into a Json string.
func TimestampToJson(record TimestampRecord) string {
	bytes, err := json.Marshal(record)
	if err != nil {
		return "{}"
	}
	return string(bytes)
}

// TimestampFromJson () - Converts a Json string into a TimestampRecord.
func TimestampFromJson(text string) TimestampRecord {
	record := TimestampRecord{}
	err := json.Unmarshal([]byte(text), &record)
	if err != nil {
		return TimestampRecord{}
	}
	return record
}

// WeightLiftingToJson () - Converts a WeightLiftingRecord into a Json string.
func WeightLiftingToJson(record WeightLiftingRecord) string {
	bytes, err := json.Marshal(record)
	if err != nil {
		return "{}"
	}
	return string(bytes)
}

// WeightLiftingFromJson () - Converts a Json string into a WeightLiftingRecord.
func WeightLiftingFromJson(text string) WeightLiftingRecord {
	record := WeightLiftingRecord{}
	err := json.Unmarshal([]byte(text), &record)
	if err != nil {
		return WeightLiftingRecord{}
	}
	return record
}

// RunningToJson () - Converts a RunningRecord into a Json string.
func RunningToJson(record RunningRecord) string {
	bytes, err := json.Marshal(record)
	if err != nil {
		return "{}"
	}
	return string(bytes)
}

// RunningFromJson () - Converts a Json string into a RunningRecord.
func RunningFromJson(text string) RunningRecord {
	record := RunningRecord{}
	err := json.Unmarshal([]byte(text), &record)
	if err != nil {
		return RunningRecord{}
	}
	return record
}
