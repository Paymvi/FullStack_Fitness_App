// .go
// Fitness App - JSON Serialization Functions
// by Kyle Furey

package main

import (
	"encoding/json"
	"errors"
)

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
		Timestamp     TimestampRecord      `json:"timestamp"`
		WeightLifting *WeightLiftingRecord `json:"weight_lifting,omitempty"`
		Running       *RunningRecord       `json:"running,omitempty"`
	}
	var wl WeightLiftingRecord
	wlEntered := false
	var r RunningRecord
	rEntered := false
	var timestamp TimestampRecord
	if err := json.Unmarshal([]byte(text), &fmt); err == nil {
		if fmt.WeightLifting != nil {
			wl = *fmt.WeightLifting
			if wl.Timestamp != 0 || wl.Exercise != "" || wl.WeightLbs != 0 || wl.TotalSets != 0 {
				if wl.Timestamp == 0 {
					wl.Timestamp = fmt.Timestamp
				}
				wlEntered = true
			}
		}
		if fmt.Running != nil {
			r = *fmt.Running
			if r.Timestamp != 0 || r.DistanceMiles != 0 || r.ElapsedSecs != 0 || r.SpeedMph != 0 || r.InclineDeg != 0 {
				if r.Timestamp == 0 {
					r.Timestamp = fmt.Timestamp
				}
				rEntered = true
			}
		}
		timestamp = fmt.Timestamp
		if timestamp == 0 {
			if wlEntered {
				timestamp = wl.Timestamp
			} else if rEntered {
				timestamp = r.Timestamp
			}
		}
		if wlEntered || rEntered {
			return timestamp, wlEntered, wl, rEntered, r, nil
		}
	}
	if err := json.Unmarshal([]byte(text), &wl); err == nil && wl.Timestamp != 0 &&
		(wl.Exercise != "" || wl.WeightLbs != 0 || wl.TotalSets != 0) {
		wlEntered = true
		timestamp = wl.Timestamp
		return timestamp, wlEntered, wl, false, RunningRecord{}, nil
	}
	if err := json.Unmarshal([]byte(text), &r); err == nil && r.Timestamp != 0 &&
		(r.DistanceMiles != 0 || r.ElapsedSecs != 0 || r.SpeedMph != 0 || r.InclineDeg != 0) {
		rEntered = true
		timestamp = r.Timestamp
		return timestamp, false, WeightLiftingRecord{}, rEntered, r, nil
	}
	return 0, false, WeightLiftingRecord{}, false, RunningRecord{}, errors.New("invalid JSON structure")
}
