import React, { useState } from 'react';
import styles from './AbstractionVisualizer.module.css';

const AbstractionVisualizer = () => {
  // Step 1: Abstract Definition State
  const [abstractType, setAbstractType] = useState("abstract"); // "abstract" or "interface"
  const [abstractClassName, setAbstractClassName] = useState("Shape");
  const [abstractMethodName, setAbstractMethodName] = useState("calculateArea");
  const [abstractDefinition, setAbstractDefinition] = useState("");

  // Step 2: Concrete Implementation State
  const [concreteCreated, setConcreteCreated] = useState(false);
  const [concreteClassName, setConcreteClassName] = useState("Circle");
  const [radius, setRadius] = useState(5);
  const [concreteDefinition, setConcreteDefinition] = useState("");

  // Step 3: Invocation & Logging State
  const [invocationResult, setInvocationResult] = useState("");
  const [consoleLog, setConsoleLog] = useState([]);

  // Helper: Append messages to console log
  const addLog = (message) => {
    setConsoleLog((prev) => [...prev, message]);
  };

  // Generate the abstract definition based on the chosen type
  const generateAbstractDefinition = () => {
    if (abstractType === "abstract") {
      const code = `abstract class ${abstractClassName} {
  abstract ${abstractMethodName}();
}`;
      setAbstractDefinition(code);
      addLog(`Defined abstract class '${abstractClassName}' with abstract method '${abstractMethodName}'.`);
    } else {
      const code = `interface ${abstractClassName} {
  ${abstractMethodName}();
}`;
      setAbstractDefinition(code);
      addLog(`Defined interface '${abstractClassName}' with method signature '${abstractMethodName}()'.`);
    }
  };

  // Create a concrete class implementing the abstract definition
  const handleCreateConcrete = () => {
    const code = `class ${concreteClassName} extends ${abstractClassName} {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  ${abstractMethodName}() {
    return Math.PI * this.radius * this.radius;
  }
}`;
    setConcreteDefinition(code);
    setConcreteCreated(true);
    addLog(`Created concrete class '${concreteClassName}' implementing '${abstractClassName}'.`);
  };

  // Simulate invoking the abstract method via the concrete instance
  const handleInvokeMethod = () => {
    if (!concreteCreated) {
      alert("Please create the concrete class implementation first.");
      return;
    }
    const area = Math.PI * radius * radius;
    setInvocationResult(`Area calculated: ${area.toFixed(2)}`);
    addLog(`High-Level: Invoked '${abstractMethodName}' on '${concreteClassName}' with radius ${radius}.`);
    addLog(`Mid-Level: Method pointer resolved to concrete implementation.`);
    // Simulate a low-level binary representation (for demonstration only)
    const binaryRepresentation = "01001101 01100101 01110100 01101000 01101111 01100100 00100000 01000011 01101111 01100100 01100101";
    addLog(`Low-Level: Binary representation of method instructions: ${binaryRepresentation}`);
  };

  // Reset the entire simulation
  const handleReset = () => {
    setAbstractDefinition("");
    setConcreteDefinition("");
    setConcreteCreated(false);
    setInvocationResult("");
    setConsoleLog([]);
  };

  return (
    <div className={styles.container}>
      <h1>Abstraction Visualizer</h1>

      {/* Step 1: Define Abstract Class / Interface */}
      <div className={styles.stepSection}>
        <h2>Step 1: Define {abstractType === "abstract" ? "Abstract Class" : "Interface"}</h2>
        <div className={styles.formGroup}>
          <label>Type:</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="abstract"
                checked={abstractType === "abstract"}
                onChange={() => setAbstractType("abstract")}
              />
              Abstract Class
            </label>
            <label>
              <input
                type="radio"
                value="interface"
                checked={abstractType === "interface"}
                onChange={() => setAbstractType("interface")}
              />
              Interface
            </label>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>{abstractType === "abstract" ? "Abstract Class Name:" : "Interface Name:"}</label>
          <input
            type="text"
            value={abstractClassName}
            onChange={(e) => setAbstractClassName(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Abstract Method Name:</label>
          <input
            type="text"
            value={abstractMethodName}
            onChange={(e) => setAbstractMethodName(e.target.value)}
            className={styles.input}
          />
        </div>
        <button className={styles.button} onClick={generateAbstractDefinition}>
          Generate {abstractType === "abstract" ? "Abstract Class" : "Interface"}
        </button>
        {abstractDefinition && (
          <div className={styles.codeSection}>
            <h3>High-Level Definition</h3>
            <pre className={styles.codeBlock}>{abstractDefinition}</pre>
          </div>
        )}
      </div>

      {/* Step 2: Implement Concrete Class */}
      {abstractDefinition && (
        <div className={styles.stepSection}>
          <h2>Step 2: Implement Concrete Class</h2>
          <div className={styles.formGroup}>
            <label>Concrete Class Name:</label>
            <input
              type="text"
              value={concreteClassName}
              onChange={(e) => setConcreteClassName(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Radius (for area calculation):</label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className={styles.input}
            />
          </div>
          <button className={styles.button} onClick={handleCreateConcrete}>
            Create Concrete Class
          </button>
          {concreteDefinition && (
            <div className={styles.codeSection}>
              <h3>Concrete Class Definition</h3>
              <pre className={styles.codeBlock}>{concreteDefinition}</pre>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Invoke Abstract Method */}
      {concreteCreated && (
        <div className={styles.stepSection}>
          <h2>Step 3: Invoke Abstract Method</h2>
          <button className={styles.button} onClick={handleInvokeMethod}>
            Invoke {abstractMethodName}()
          </button>
          {invocationResult && (
            <div className={styles.result}>
              <strong>{invocationResult}</strong>
            </div>
          )}
        </div>
      )}

      {/* Interactive Console Log */}
      <div className={styles.consoleLog}>
        <h3>Interactive Console Log</h3>
        <div className={styles.logArea}>
          {consoleLog.map((log, index) => (
            <div key={index} className={styles.logLine}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Section */}
      <div className={styles.comparisonSection}>
        <h2>Comparison: Abstract Class vs. Interface</h2>
        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Abstract Class</th>
              <th>Interface</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Methods</td>
              <td>Can have both abstract and concrete methods</td>
              <td>Only abstract methods (pre Java 8); from Java 8, can have default/static methods</td>
            </tr>
            <tr>
              <td>Variables</td>
              <td>Can have instance variables (any access modifier)</td>
              <td>Only public static final constants</td>
            </tr>
            <tr>
              <td>Constructors</td>
              <td>Can have constructors</td>
              <td>Cannot have constructors</td>
            </tr>
            <tr>
              <td>Access Modifiers</td>
              <td>Any access modifier (private, protected, public)</td>
              <td>Methods are public by default</td>
            </tr>
            <tr>
              <td>Inheritance</td>
              <td>Supports single inheritance (extends one abstract class)</td>
              <td>Supports multiple inheritance (implements multiple interfaces)</td>
            </tr>
            <tr>
              <td>Usage</td>
              <td>Used to share common behavior among related classes</td>
              <td>Used to define a contract for unrelated classes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button className={styles.button} onClick={handleReset}>
        Reset Simulation
      </button>
    </div>
  );
};

export default AbstractionVisualizer;
