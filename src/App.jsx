import { useState } from "react";
import "./App.css";

function App() {


  // Change to having 1 array of objects
  const [logs, setLogs] = useState([]);

  // Makes a new log
  const createLog = () => {

    setLogs([
      ...logs,
      {
        id: Date.now(),
        type: null, // This was added to account for the different types of workouts
        data: {},
        jsonOutput: null
      },
    ]);

  };

  const updateInput = (id, value) => {
    setLogs(
      logs.map((log) =>
        log.id === id ?
        { ...log, exerciseInput: value} // update the right log
        : log // leave the rest the same
    )
    );
  };


   // Add exercise to the correct log
  const addExercise = (id) => {
    setLogs(
      logs.map((log) =>
        log.id === id && log.exerciseInput.trim() !== ""
          ? {
              ...log,
              exercises: [...log.exercises, log.exerciseInput],
              exerciseInput: "",
            }
          : log
      )
    );
  }; // Fixed
  

  // This sends the JSON to the backend
  const submitLog = async (id) => {

    console.log("🟢 submitLog called with id:", id); // For debugging purposes

    /* 
    Changes after adding backend:
    - removed setLogs() because you don't need to update the UI state to talk to the backend
    - construct "payload" as a plain JS object, then use JSON.stringify(payload) when sending it to the API
    - made the function async
    - added the fetch() call to save the workout
    - added a try/catch block for error handling
    */

    const log = logs.find(l => l.id === id);
    if (!log) return;

    // JS object to send to the backend API (which persists to the database)
    const payload = {
      timestamp: Date.now(),
      ...(log.type === "lift"
        ? {
            // Lift custom fields
            exercise: log.data.exercise,
            weight_lbs: log.data.weight_lbs,
            total_sets: log.data.total_sets,
          }
        : {
            // Run custom fields
            distance_miles: log.data.distance_miles,
            elapsed_secs: log.data.elapsed_secs,
            speed_mph:
              log.data.elapsed_secs
                ? log.data.distance_miles / (log.data.elapsed_secs / 3600)
                : 0,
            incline_deg: log.data.incline_deg,
          }),

    };

    console.log(" Sending:", payload);


    try {

      // Actually sending it to the database
      const res = await fetch("http://localhost:8080/api/enterWorkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // just specifies it is sending a json
        },
        body: JSON.stringify(payload), // convert JS object to JSON string for HTTP
      });

      console.log("workout saved!")
    
    } catch (err){
      console.error("Failed to send workout:", err);
    }

  };


  return (
    <div className="app">

      {/* Frontend Magic */}
      <h1>Fitness Logs 🏋️‍♂️</h1>

      {/* Button for NEW fitness log */}
      <button onClick={createLog}>
        Make a new fitness log
      </button>

       {/* Render ALL fitness logs */}
      {logs.map((log, index) => (
        <div className="log-card" key={log.id}>
          <h3>Workout #{index + 1}</h3>


        
        {/* Section to choose workout type */}
          {log.type === null && (
            <div className="type-selector">
              <button
                className="run-btn"
                onClick={() =>
                  setLogs(
                    logs.map((l) =>
                      l.id === log.id ? { ...l, type: "run" } : l
                    )
                  )
                }
              >
                🏃 Run
              </button>

              <button
                className="lift-btn"
                onClick={() =>
                  setLogs(
                    logs.map((l) =>
                      l.id === log.id ? { ...l, type: "lift" } : l
                    )
                  )
                }
              >
                🏋️ Lift
              </button>
            </div>
          )}


        {/* Lifting Custom Form */}

        {log.type === "lift" && (
          <div className="lift-form">
            <input
              placeholder="Exercise (e.g. Bench Press)"
              onChange={(e) =>
                setLogs(
                  logs.map((l) =>
                    l.id === log.id
                      ? {
                          ...l,
                          data: { ...l.data, exercise: e.target.value },
                        }
                      : l
                  )
                )
              }
            />

            <input
              type="number"
              placeholder="Weight (lbs)"
              onChange={(e) =>
                setLogs(
                  logs.map((l) =>
                    l.id === log.id
                      ? {
                          ...l,
                          data: { ...l.data, weight_lbs: Number(e.target.value) },
                        }
                      : l
                  )
                )
              }
            />

            <input
              type="number"
              placeholder="Total sets"
              onChange={(e) =>
                setLogs(
                  logs.map((l) =>
                    l.id === log.id
                      ? {
                          ...l,
                          data: { ...l.data, total_sets: Number(e.target.value) },
                        }
                      : l
                  )
                )
              }
            />
          </div>
        )}



        {/* Running custom form */}
        {log.type === "run" && (
          <div className="run-form">
            <input
              type="number"
              placeholder="Distance (miles)"
              onChange={(e) =>
                setLogs(
                  logs.map((l) =>
                    l.id === log.id
                      ? {
                          ...l,
                          data: { ...l.data, distance_miles: Number(e.target.value) },
                        }
                      : l
                  )
                )
              }
            />

            <input
              type="number"
              placeholder="Elapsed time (seconds)"
              onChange={(e) =>
                setLogs(
                  logs.map((l) =>
                    l.id === log.id
                      ? {
                          ...l,
                          data: { ...l.data, elapsed_secs: Number(e.target.value) },
                        }
                      : l
                  )
                )
              }
            />

            <input
              type="number"
              placeholder="Incline (degrees)"
              onChange={(e) =>
                setLogs(
                  logs.map((l) =>
                    l.id === log.id
                      ? {
                          ...l,
                          data: { ...l.data, incline_deg: Number(e.target.value) },
                        }
                      : l
                  )
                )
              }
            />
          </div>
        )}


          {/* Submit button converts this log to JSON */}
          <button className="submit-btn" onClick={() => submitLog(log.id)}>
            Submit
          </button>

          {/* Show JSON only AFTER submission */}
          {log.jsonOutput && (
            <pre className="json-output">
              {log.jsonOutput}
            </pre>
          )}
        </div>
      ))}
      
      
    </div>
  );
}

export default App;
