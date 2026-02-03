// .go
// Fitness App - Client Functions
// by Kyle Furey

package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
)

// Client - Stores all information related to a remote client.
type Client struct {
	Database *DBConnection
	Writer   http.ResponseWriter
	Request  *http.Request
}

// RunServer () - Binds functions and runs the server until termination.
func RunServer(db *DBConnection) {
	http.HandleFunc("/api/getDates", func(writer http.ResponseWriter, request *http.Request) {
		client := Client{db, writer, request}
		if !client.Init() {
			return
		}
		log.Println("POST - getDates()")
		client.GetDates()
	})
	http.HandleFunc("/api/delDate", func(writer http.ResponseWriter, request *http.Request) {
		client := Client{db, writer, request}
		if !client.Init() {
			return
		}
		log.Println("POST - delDate()")
		client.DelDate()
	})
	http.HandleFunc("/api/getWeight", func(writer http.ResponseWriter, request *http.Request) {
		client := Client{db, writer, request}
		if !client.Init() {
			return
		}
		log.Println("POST - getWeight()")
		client.GetWeight()
	})
	http.HandleFunc("/api/getRun", func(writer http.ResponseWriter, request *http.Request) {
		client := Client{db, writer, request}
		if !client.Init() {
			return
		}
		log.Println("POST - getRun()")
		client.GetRun()
	})
	http.HandleFunc("/api/enterWorkout", func(writer http.ResponseWriter, request *http.Request) {
		client := Client{db, writer, request}
		if !client.Init() {
			return
		}
		log.Println("POST - enterWorkout()")
		client.EnterWorkout()
	})
	fmt.Println("Server running on port :8080.")
	log.Fatal("Server crashed!\n", http.ListenAndServe(":8080", nil))
}

// Init () - Configures an HTTP client and returns whether it was successful.
func (client *Client) Init() bool {
	client.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	client.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	client.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if client.Request.Method == http.MethodOptions {
		client.Writer.WriteHeader(http.StatusOK)
		return false
	}
	if client.Request.Method != http.MethodPost {
		http.Error(client.Writer, "Invalid request!", http.StatusMethodNotAllowed)
		return false
	}
	return true
}

// ReceiveJson () - Return's a client's request as a JSON string or an error.
func (client *Client) ReceiveJson() (string, error) {
	text, err := io.ReadAll(client.Request.Body)
	if err != nil {
		client.SendError(err, http.StatusBadRequest)
		return "{}", err
	}
	return string(text), nil
}

// ReceiveTimestamp () - Returns a client's expected timestamp argument or an error.
func (client *Client) ReceiveTimestamp() (TimestampRecord, error) {
	text, err := client.ReceiveJson()
	if err != nil {
		return 0, err
	}
	timestamp, err := strconv.ParseUint(strings.TrimSpace(text), 10, 64)
	if err != nil {
		client.SendError(err, http.StatusBadRequest)
		return 0, err
	}
	return TimestampRecord(timestamp), nil
}

// ReceiveWorkout () - Returns a client's expected workout set argument or an error.
func (client *Client) ReceiveWorkout() (TimestampRecord, bool, WeightLiftingRecord, bool, RunningRecord, error) {
	text, err := client.ReceiveJson()
	if err != nil {
		return 0, false, WeightLiftingRecord{}, false, RunningRecord{}, err
	}
	return WorkoutFromJson(text)
}

// SendJson () - Sends a client a JSON string.
func (client *Client) SendJson(text string, status int) {
	client.Writer.Header().Set("Content-Type", "application/json")
	client.Writer.WriteHeader(status)
	_, _ = client.Writer.Write([]byte(text))
}

// SendError () - Informs the client of an error.
func (client *Client) SendError(err error, status int) {
	if err != nil {
		http.Error(client.Writer, err.Error(), status)
		log.Println(err.Error())
		return
	}
	client.Writer.WriteHeader(http.StatusNoContent)
}

// GetDates () - Allows a client to receive a list of their timestamps.
func (client *Client) GetDates() {
	records, err := client.Database.Fetch()
	if err != nil {
		client.SendError(err, http.StatusInternalServerError)
		return
	}
	client.SendJson(TimestampRecordArray(records).ToJson(), http.StatusOK)
}

// DelDate () - Allows a client to delete a timestamps.
func (client *Client) DelDate() {
	timestamp, err := client.ReceiveTimestamp()
	if err != nil {
		client.SendError(err, http.StatusBadRequest)
		return
	}
	client.SendError(client.Database.Delete(timestamp), http.StatusBadRequest)
}

// GetWeight () - Allows a client to get weight lifting data from a timestamp.
func (client *Client) GetWeight() {
	timestamp, err := client.ReceiveTimestamp()
	if err != nil {
		client.SendError(err, http.StatusBadRequest)
		return
	}
	wFound, wl, _, _, err := client.Database.Find(timestamp)
	if err != nil {
		client.SendError(err, http.StatusNotFound)
		return
	}
	if wFound {
		client.SendJson(wl.ToJson(), http.StatusOK)
		return
	}
	client.SendJson("{}", http.StatusOK)
}

// GetRun () - Allows a client to get running data from a timestamp.
func (client *Client) GetRun() {
	timestamp, err := client.ReceiveTimestamp()
	if err != nil {
		client.SendError(err, http.StatusBadRequest)
		return
	}
	_, _, rFound, r, err := client.Database.Find(timestamp)
	if err != nil {
		client.SendError(err, http.StatusNotFound)
		return
	}
	if rFound {
		client.SendJson(r.ToJson(), http.StatusOK)
		return
	}
	client.SendJson("{}", http.StatusOK)
}

// EnterWorkout () - Allows a client to enter a new workout.
func (client *Client) EnterWorkout() {
	timestamp, wEntered, wl, rEntered, r, err := client.ReceiveWorkout()
	if err != nil {
		client.SendError(err, http.StatusBadRequest)
		return
	}
	err = client.Database.Insert(timestamp, wEntered, wl, rEntered, r)
	if err != nil {
		client.SendError(err, http.StatusBadRequest)
		return
	}
	client.Writer.WriteHeader(http.StatusCreated)
}
