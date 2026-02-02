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
        type: null, // This was added to account for the differnt types of workouts
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
  

  // This makes the JSON summary for a particular log
  const submitLog = (id) => {

    // Update log state
    setLogs(
      logs.map((log) =>
        log.id === id // Find the right log
          ? {
              // Keep existing stuff
              ...log,

              jsonOutput: JSON.stringify( // stringify turns objects and turns it into json text
                {
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
                },
                null,
                2 // Keep pretty print w/ 2 space indent
              ),
            }
          : log // Return other logs unchanged
      )
    );
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
