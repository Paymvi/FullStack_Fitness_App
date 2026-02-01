import { useState } from "react";
import "./App.css";

function App() {
  const [showLog, setShowLog] = useState(false);
  const [exerciseInput, setExerciseInput] = useState("");
  const [exercises, setExercises] = useState([]);
  const [jsonOutput, setJsonOutput] = useState(null);

  const addExercise = () => {
    if (exerciseInput.trim() === "") return; // Catches empty inputs and stops it early

    setExercises([...exercises, exerciseInput]); // Adds exercise
     
    setExerciseInput(""); // Deletes input after added
  };

  // This makes the JSON
  const submitLog = () => {
    const log = {
      date: new Date().toISOString(),
      exercises: exercises,
    };

    setJsonOutput(JSON.stringify(log, null, 2));
  };

  return (
    <div className="app">

      {/* Frontend Magic */}
      <h1>Fitness Diary 🏋️‍♂️</h1>

      <button onClick={() => setShowLog(true)}>
        Make the fitness log
      </button>

      {showLog && (
        <div className="log-card">

          {/* Standard input box */}
          <input
            type="text"
            placeholder="Enter exercise (e.g. Bench Press 3x10)"
            value={exerciseInput}
            onChange={(e) => setExerciseInput(e.target.value)}
          />

          <button onClick={addExercise}>
            Turn in your exercise
          </button>


          {/* Just so we can visually see it as the user */}
          <ul>
            {exercises.map((ex, index) => (
              <li key={index}>{ex}</li>
            ))}
          </ul>

          <button className="submit-btn" onClick={submitLog}>
            Submit
          </button>
        </div>
      )}

      {/* Also here so we can visually see it as the user */}
      {jsonOutput && (
        <pre className="json-output">
          {jsonOutput}
        </pre>
      )}
    </div>
  );
}

export default App;
