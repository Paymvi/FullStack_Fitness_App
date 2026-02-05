import { useState, useEffect } from "react";
import "./App.css";

function App() {


  // Change to having 1 array of objects
  const [logs, setLogs] = useState([]);

  // In order to make multiple tabs... make another state. Default to the log tab.
  const [activeTab, setActiveTab] = useState("log");

  // Make a state for the summary data
  const [summary, setSummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);


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


  // Gets the summary from the database!
  const fetchSummary = async () => {
    setSummaryLoading(true);

    try {
      // 1. Get all timestamps
      const tsRes = await fetch("http://localhost:8080/api/getDates", {
        method: "POST",
      });

      // Turn the json into a JS array
      const timestamps = await tsRes.json();

      const workouts = [];

      // For each timestampe fetch the workout
      for (const ts of timestamps) {
        // 2. Try to fetch a weight lifting record
        const wRes = await fetch("http://localhost:8080/api/getWeight", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: ts.toString(),
        });

        // Parse the json
        const weight = await wRes.json();

        // If there is an object it is a lift
        if (Object.keys(weight).length > 0) {
          workouts.push({
            type: "lift",
            timestamp: ts,
            ...weight,      // exercise, weight_lbs, total_sets, etc.
          });
          continue;
        }

        // 3. Try running this time
        const rRes = await fetch("http://localhost:8080/api/getRun", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: ts.toString(),
        });

        // Parse the json
        const run = await rRes.json();

        // If there is an object it is a run
        if (Object.keys(run).length > 0) {
          workouts.push({
            type: "run",
            timestamp: ts,
            ...run,         // distance, speed, incline, etc.
          });
        }
      }

      // update the summary state
      setSummary(workouts);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      } finally {
        setSummaryLoading(false);
      }
  };

  useEffect(() => {
    if (activeTab === "summary") {
      fetchSummary();
    }
  }, [activeTab]);




  return (
    <div className="app">

      {/* Frontend Magic */}
      <h1>Fitness Logs 🏋️‍♂️</h1>


      {/* Tab buttons */}
      <div className="tabs">

        {/* Log tab */}
        <button
          className={activeTab === "log" ? "active" : ""}
          onClick={() => setActiveTab("log")}>
          New Log
        </button>

        {/* Summary */}
        <button
          className={activeTab === "summary" ? "active" : ""}
          onClick={() => setActiveTab("summary")}>
          Summary
        </button>

      </div>


      {/* The Log Tab Section */}
      {activeTab === "log" && (
        <>
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

      </> 

    )}


    {/* The Summary Section */}
   
   {activeTab === "summary" && (
      <div className="summary">
          <h2>Workout Summary 📊</h2>

          {summaryLoading && <p>Loading workouts...</p>}

          {!summaryLoading && summary.length === 0 && (
            <p>No workouts yet.</p>
          )}

          {summary.map((w, i) => (
            <div key={i} className="summary-card">
              <strong>{new Date(w.timestamp).toLocaleString()}</strong>

              {w.type === "lift" && (
                <p>
                  🏋️ {w.exercise} : {w.weight_lbs} lbs × {w.total_sets} sets
                </p>
              )}

              {w.type === "run" && (
                <p>
                  🏃 {w.distance_miles} miles @ {w.speed_mph.toFixed(1)} mph
                </p>
              )}
            </div>
          ))}
        </div>
      )}

    
    

      
      
    </div>
  )
  
}

export default App;
