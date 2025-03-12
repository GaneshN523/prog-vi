import React, { useState } from 'react';
import styles from './RecursionVisualizer.module.css';

// Helper to generate a simulated memory address.
const generateAddress = (id) => `0x${id.toString(16)}`;

// Code snippets for different recursive functions.
const codeSnippets = {
  Factorial: `function factorial(n) {
  if (n === 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}`,
  Fibonacci: `function fib(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fib(n - 1) + fib(n - 2);
}`
};

/**
 * Generates simulation steps for factorial recursion.
 * For each recursive call and return, a step is recorded.
 */
function generateFactorialSteps(n) {
  const steps = [];
  let frameIdCounter = 1;
  function simulate(n) {
    const frame = {
      id: frameIdCounter++,
      functionName: "factorial",
      param: n,
      address: generateAddress(frameIdCounter)
    };
    steps.push({ type: "call", frame, message: `Call factorial(${n})` });
    if (n === 0) {
      steps.push({ type: "return", frame, result: 1, message: `Return factorial(0) = 1` });
      return 1;
    } else {
      const r = simulate(n - 1);
      const result = n * r;
      steps.push({ type: "return", frame, result, message: `Return factorial(${n}) = ${n} * ${r} = ${result}` });
      return result;
    }
  }
  simulate(n);
  return steps;
}

/**
 * Generates simulation steps for Fibonacci recursion.
 * This recursive function calls itself twice (for n-1 and n-2),
 * so the call tree is more complex.
 */
function generateFibonacciSteps(n) {
  const steps = [];
  let frameIdCounter = 1;
  function simulate(n) {
    const frame = {
      id: frameIdCounter++,
      functionName: "fib",
      param: n,
      address: generateAddress(frameIdCounter)
    };
    steps.push({ type: "call", frame, message: `Call fib(${n})` });
    if (n === 0) {
      steps.push({ type: "return", frame, result: 0, message: `Return fib(0) = 0` });
      return 0;
    }
    if (n === 1) {
      steps.push({ type: "return", frame, result: 1, message: `Return fib(1) = 1` });
      return 1;
    }
    const left = simulate(n - 1);
    const right = simulate(n - 2);
    const result = left + right;
    steps.push({ type: "return", frame, result, message: `Return fib(${n}) = ${left} + ${right} = ${result}` });
    return result;
  }
  simulate(n);
  return steps;
}

const RecursionVisualizer = () => {
  // Input value for the recursive function (e.g. n for factorial or Fibonacci)
  const [inputValue, setInputValue] = useState("");
  // Dropdown selection for which recursive function to simulate.
  const [selectedFunction, setSelectedFunction] = useState("Factorial");
  // All simulation steps generated by the recursive simulation.
  const [simulationSteps, setSimulationSteps] = useState([]);
  // Current simulation step index.
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // Call stack as seen in the machine-level view.
  const [callStack, setCallStack] = useState([]);
  // Operation log (step-by-step messages).
  const [log, setLog] = useState([]);
  // Whether a simulation has been started.
  const [simulationStarted, setSimulationStarted] = useState(false);

  // Starts the simulation based on the selected recursive function.
  const startSimulation = () => {
    const n = parseInt(inputValue);
    if (isNaN(n) || n < 0) {
      alert("Please enter a non-negative integer.");
      return;
    }
    let steps = [];
    if (selectedFunction === "Factorial") {
      steps = generateFactorialSteps(n);
    } else if (selectedFunction === "Fibonacci") {
      // A caution: Fibonacci recursion is exponential – choose small n.
      if (n > 10) {
        alert("For Fibonacci recursion, please choose n ≤ 10 to avoid too many recursive calls.");
        return;
      }
      steps = generateFibonacciSteps(n);
    }
    setSimulationSteps(steps);
    setCurrentStepIndex(0);
    setCallStack([]);
    setLog([]);
    setSimulationStarted(true);
  };

  // Resets the simulation.
  const resetSimulation = () => {
    setInputValue("");
    setSimulationSteps([]);
    setCurrentStepIndex(0);
    setCallStack([]);
    setLog([]);
    setSimulationStarted(false);
  };

  // Advances one simulation step. For a "call", push the frame onto the stack;
  // for a "return", pop the top frame.
  const nextStep = () => {
    if (currentStepIndex >= simulationSteps.length) {
      alert("Simulation complete.");
      return;
    }
    const step = simulationSteps[currentStepIndex];
    if (step.type === "call") {
      setCallStack(prev => [...prev, step.frame]);
    } else if (step.type === "return") {
      setCallStack(prev => prev.slice(0, -1));
    }
    setLog(prev => [...prev, step.message]);
    setCurrentStepIndex(prev => prev + 1);
  };

  return (
    <div className={styles.container}>
      <h1>Recursion Visualizer</h1>
      <div className={styles.controls}>
        <div className={styles.simulationControls}>
          <h2>Simulation Controls</h2>
          <div className={styles.formGroup}>
            <label htmlFor="functionSelect">Select Function:</label>
            <select
              id="functionSelect"
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
            >
              <option value="Factorial">Factorial</option>
              <option value="Fibonacci">Fibonacci</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <input
              type="number"
              placeholder={`Enter n for ${selectedFunction}(n)`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={startSimulation} className={styles.button}>Start Simulation</button>
            <button onClick={nextStep} className={styles.button} disabled={!simulationStarted}>
              Next Step
            </button>
            <button onClick={resetSimulation} className={styles.button}>Reset</button>
          </div>
        </div>

        {/* Code Snippet Display */}
        <div className={styles.codeDisplay}>
          <h2>Code Snippet for {selectedFunction}</h2>
          <pre>
            <code>{codeSnippets[selectedFunction]}</code>
          </pre>
          <p className={styles.explanation}>
            In this {selectedFunction} function, a recursive call is made with a decreased value of n (e.g. n-1
            for Factorial, and n-1/n-2 for Fibonacci). This decrement drives the recursion toward the base case,
            ensuring that the recursive calls eventually stop and the results are computed as the call stack unwinds.
          </p>
        </div>
      </div>

      {simulationStarted && (
        <div className={styles.visualizationPanel}>
          <h2>High-Level Call Tree</h2>
          <div className={styles.callTree}>
            {simulationSteps.map((step, idx) => (
              <div key={idx} className={`${styles.step} ${idx < currentStepIndex ? styles.executed : ''}`}>
                {step.message}
              </div>
            ))}
          </div>

          <h2>Low-Level Memory (Call Stack)</h2>
          <div className={styles.callStack}>
            {callStack.length > 0 ? (
              callStack.map((frame) => (
                <div key={frame.id} className={styles.frame}>
                  <div><strong>Function:</strong> {frame.functionName}()</div>
                  <div><strong>Param:</strong> {frame.param}</div>
                  <div><strong>Address:</strong> {frame.address}</div>
                </div>
              ))
            ) : (
              <div className={styles.emptyStack}>Call stack is empty.</div>
            )}
          </div>

          <h2>Operation Log</h2>
          <div className={styles.operationLog}>
            <ul>
              {log.map((entry, idx) => (
                <li key={idx}>{entry}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecursionVisualizer;
