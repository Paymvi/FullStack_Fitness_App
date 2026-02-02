// .go
// Fitness App - JSON Serialization Functions
// by Kyle Furey

package main

import "encoding/json"

type TimestampRecordArray []TimestampRecord

// ToJson () - Converts a TimestampRecord array into a JSON string or returns an error.
func (records TimestampRecordArray) ToJson() string {
	bytes, err := json.Marshal(records)
	if err != nil {
		return "[]"
	}
	return string(bytes)
}

// ToJson () - Converts a WeightLiftingRecord into a JSON string or returns an error.
func (record *WeightLiftingRecord) ToJson() string {
	bytes, err := json.Marshal(*record)
	if err != nil {
		return "{}"
	}
	return string(bytes)
}

// ToJson () - Converts a RunningRecord into a JSON string or returns an error.
func (record *RunningRecord) ToJson() string {
	bytes, err := json.Marshal(*record)
	if err != nil {
		return "{}"
	}
	return string(bytes)
}

// WorkoutFromJson () - Converts a JSON string into workout data or returns an error.
func WorkoutFromJson(text string) (TimestampRecord, bool, WeightLiftingRecord, bool, RunningRecord, error) {
	var fmt struct {
		Timestamp     TimestampRecord      `json:"date"`
		WeightLifting *WeightLiftingRecord `json:"weight_lifting,omitempty"`
		Running       *RunningRecord       `json:"running,omitempty"`
	}
	err := json.Unmarshal([]byte(text), &fmt)
	if err != nil {
		return 0, false, WeightLiftingRecord{}, false, RunningRecord{}, err
	}
	if fmt.Timestamp == 0 {
		return 0, false, WeightLiftingRecord{}, false, RunningRecord{}, err
	}
	wlExists := fmt.WeightLifting != nil
	var wl WeightLiftingRecord
	if wlExists {
		wl = *fmt.WeightLifting
	}
	rExists := fmt.Running != nil
	var r RunningRecord
	if rExists {
		r = *fmt.Running
	}
	return fmt.Timestamp, wlExists, wl, rExists, r, nil
}
