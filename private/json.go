// .go
// Fitness App - Serialization Functions
// by Kyle Furey

package Fitness_App

import "encoding/json"

// ToJson () - Converts a WeightLiftingRecord into a Json string or returns an error.
func (record *WeightLiftingRecord) ToJson() (string, error) {
	bytes, err := json.Marshal(record)
	if err != nil {
		return "{}", err
	}
	return string(bytes), nil
}

// ToJson () - Converts a RunningRecord into a Json string or returns an error.
func (record *RunningRecord) ToJson() (string, error) {
	bytes, err := json.Marshal(record)
	if err != nil {
		return "{}", err
	}
	return string(bytes), nil
}

// WeightLiftingFromJson () - Converts a Json string into a WeightLiftingRecord or returns an error.
func WeightLiftingFromJson(text string) (WeightLiftingRecord, error) {
	record := WeightLiftingRecord{}
	err := json.Unmarshal([]byte(text), &record)
	if err != nil {
		return WeightLiftingRecord{}, err
	}
	return record, nil
}

// RunningFromJson () - Converts a Json string into a RunningRecord or returns an error.
func RunningFromJson(text string) (RunningRecord, error) {
	record := RunningRecord{}
	err := json.Unmarshal([]byte(text), &record)
	if err != nil {
		return RunningRecord{}, err
	}
	return record, nil
}
