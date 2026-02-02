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
        exerciseInput: "",
        exercises: [],
        jsonOutput: null,
      },
    ]);

  };

  // const [showLog, setShowLog] = useState(false);
  // const [exerciseInput, setExerciseInput] = useState("");
  // const [exercises, setExercises] = useState([]);
  // const [jsonOutput, setJsonOutput] = useState(null);


  const updateInput = (id, value) => {
    setLogs(
      logs.map((log) =>
        log.id === id ?
        { ...log, exerciseInput: value} // update the right log
        : log // leave the rest the same
    )
    );
  };

  // // Add an exercise to the right log (it takes in id as a parameter)
  // const addExercise = (id) => {
  //   setLogs(
  //     logs.map((log) => 
  //       log.id === id && log.exerciseInput.trim() !== ""  // Checks id and catches empty inputs and stops it early
  //       ? {
  //           ...log,
  //           exercises: [...log.exercises, log.exerciseInput],
  //           exerciseInput: "", // clear input after adding
  //         }
  //         : log
  //     )
  // );

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
  

  // This makes the JSON
  const submitLog = (id) => {
    setLogs(
      logs.map((log) =>
        log.id === id
          ? {
              ...log,
              jsonOutput: JSON.stringify( // stringify turns objects and turns it into json text
                {
                  date: new Date().toISOString(),
                  exercises: log.exercises,
                },
                null,
                2 // pretty-print JSON
              ),
            }
          : log
      )
    );
  };

  return (
    <div className="app">

      {/* Frontend Magic */}
      <h1>Fitness Diary 🏋️‍♂️</h1>

      {/* Button for NEW fitness log */}
      <button onClick={createLog}>
        Make a new fitness log
      </button>

       {/* Render ALL fitness logs */}
      {logs.map((log, index) => (
        <div className="log-card" key={log.id}>
          <h3>Workout #{index + 1}</h3>

          {/* Input field for the exercises */}
          <input
            type="text"
            placeholder="Enter exercise (e.g. Deadlift 3x5)"
            value={log.exerciseInput}
            onChange={(e) => updateInput(log.id, e.target.value)}
          />

          {/* Adds the exercise to this log */}
          <button onClick={() => addExercise(log.id)}>
            Turn in your exercise
          </button>

          {/* Display exercises already added */}
          <ul>
            {log.exercises.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>

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
