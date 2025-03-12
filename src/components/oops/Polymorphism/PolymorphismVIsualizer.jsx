import React, { useState } from 'react';
import styles from './PolymorphismVisualizer.module.css';

const PolymorphismVisualizer = () => {
  // Common state for selecting polymorphism type
  const [polyType, setPolyType] = useState("static"); // "static" for compile-time, "dynamic" for runtime

  // ======= Static Polymorphism (Compile-Time) State =======
  const [calcMethod, setCalcMethod] = useState("2"); // "2" for two parameters, "3" for three
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
  const [calcResult, setCalcResult] = useState(null);

  // ======= Dynamic Polymorphism (Runtime) State =======
  const [selectedAnimal, setSelectedAnimal] = useState("Dog");
  const [soundResult, setSoundResult] = useState("");

  // Common states
  const [consoleLog, setConsoleLog] = useState([]);
  const [memoryRepresentation, setMemoryRepresentation] = useState("");

  // Helper: Append message to console log
  const addLog = (message) => {
    setConsoleLog(prev => [...prev, message]);
  };

  // Helper: Convert a number to an 8-bit binary string
  const convertNumberToBinary = (value) => {
    return parseInt(value, 10).toString(2).padStart(8, '0');
  };

  // Helper: Convert a string to its binary representation (each char as 8 bits)
  const convertStringToBinary = (str) => {
    return str.split("").map(ch => ch.charCodeAt(0).toString(2).padStart(8, '0')).join(" ");
  };

  // Handler for static polymorphism (Calculator Overloading)
  const handleCalculate = () => {
    let result;
    if (calcMethod === "2") {
      result = (parseFloat(num1) || 0) + (parseFloat(num2) || 0);
      addLog(`Static: Called add(${num1}, ${num2}).`);
    } else {
      result = (parseFloat(num1) || 0) + (parseFloat(num2) || 0) + (parseFloat(num3) || 0);
      addLog(`Static: Called add(${num1}, ${num2}, ${num3}).`);
    }
    setCalcResult(result);
    const binary = convertNumberToBinary(result);
    setMemoryRepresentation(binary);
    addLog(`Low-Level: Result binary representation: ${binary}`);
  };

  // Handler for dynamic polymorphism (Method Overriding)
  const handleMakeSound = () => {
    let sound = "";
    if (selectedAnimal === "Dog") {
      sound = "Bark";
      addLog(`Dynamic: Dog.makeSound() invoked.`);
    } else if (selectedAnimal === "Cat") {
      sound = "Meow";
      addLog(`Dynamic: Cat.makeSound() invoked.`);
    } else {
      sound = "Generic Sound";
      addLog(`Dynamic: Animal.makeSound() invoked.`);
    }
    setSoundResult(sound);
    const binary = convertStringToBinary(sound);
    setMemoryRepresentation(binary);
    addLog(`Low-Level: Sound binary representation: ${binary}`);
  };

  // Handler: Reset simulation
  const handleReset = () => {
    setPolyType("static");
    setCalcMethod("2");
    setNum1("");
    setNum2("");
    setNum3("");
    setCalcResult(null);
    setSelectedAnimal("Dog");
    setSoundResult("");
    setConsoleLog([]);
    setMemoryRepresentation("");
  };

  // Generate high-level code snippet based on selected polymorphism type
  const generateHighLevelCode = () => {
    if (polyType === "static") {
      return `// Calculator with overloaded add methods
class Calculator {
  // Method for two parameters
  add(a, b) {
    return a + b;
  }

  // Method for three parameters
  add(a, b, c) {
    return a + b + c;
  }
}

// Usage:
const calc = new Calculator();
console.log(calc.add(${calcMethod === "2" ? "num1, num2" : "num1, num2, num3"}));`;
    } else {
      return `// Animal example demonstrating method overriding
class Animal {
  makeSound() {
    return "Generic Sound";
  }
}

class Dog extends Animal {
  makeSound() {
    return "Bark";
  }
}

class Cat extends Animal {
  makeSound() {
    return "Meow";
  }
}

// Usage:
const animal = new ${selectedAnimal}();
console.log(animal.makeSound());`;
    }
  };

  return (
    <div className={styles.container}>
      <h1>Polymorphism Visualizer</h1>

      {/* Polymorphism Type Selection */}
      <div className={styles.section}>
        <h2>Select Polymorphism Type</h2>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              value="static"
              checked={polyType === "static"}
              onChange={() => {
                setPolyType("static");
                setConsoleLog([]);
                setMemoryRepresentation("");
                setCalcResult(null);
                setSoundResult("");
              }}
            />
            Compile-Time (Static)
          </label>
          <label>
            <input
              type="radio"
              value="dynamic"
              checked={polyType === "dynamic"}
              onChange={() => {
                setPolyType("dynamic");
                setConsoleLog([]);
                setMemoryRepresentation("");
                setCalcResult(null);
                setSoundResult("");
              }}
            />
            Runtime (Dynamic)
          </label>
        </div>
      </div>

      {/* Static Polymorphism Simulation */}
      {polyType === "static" && (
        <div className={styles.section}>
          <h2>Static Polymorphism - Method Overloading</h2>
          <div className={styles.formGroup}>
            <label>Select Overload:</label>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  value="2"
                  checked={calcMethod === "2"}
                  onChange={() => setCalcMethod("2")}
                />
                Two Parameters
              </label>
              <label>
                <input
                  type="radio"
                  value="3"
                  checked={calcMethod === "3"}
                  onChange={() => setCalcMethod("3")}
                />
                Three Parameters
              </label>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Number 1:</label>
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Number 2:</label>
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className={styles.input}
            />
          </div>
          {calcMethod === "3" && (
            <div className={styles.formGroup}>
              <label>Number 3:</label>
              <input
                type="number"
                value={num3}
                onChange={(e) => setNum3(e.target.value)}
                className={styles.input}
              />
            </div>
          )}
          <button className={styles.button} onClick={handleCalculate}>
            Calculate
          </button>
          {calcResult !== null && (
            <div className={styles.result}>
              <strong>Result: {calcResult}</strong>
            </div>
          )}
          <div className={styles.codeSection}>
            <h3>High-Level Code</h3>
            <pre className={styles.codeBlock}>{generateHighLevelCode()}</pre>
          </div>
        </div>
      )}

      {/* Dynamic Polymorphism Simulation */}
      {polyType === "dynamic" && (
        <div className={styles.section}>
          <h2>Dynamic Polymorphism - Method Overriding</h2>
          <div className={styles.formGroup}>
            <label>Select Animal:</label>
            <select
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
              className={styles.select}
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Animal">Generic Animal</option>
            </select>
          </div>
          <button className={styles.button} onClick={handleMakeSound}>
            Make Sound
          </button>
          {soundResult && (
            <div className={styles.result}>
              <strong>Sound: {soundResult}</strong>
            </div>
          )}
          <div className={styles.codeSection}>
            <h3>High-Level Code</h3>
            <pre className={styles.codeBlock}>{generateHighLevelCode()}</pre>
          </div>
        </div>
      )}

      {/* Low-Level Memory Representation */}
      {memoryRepresentation && (
        <div className={styles.section}>
          <h2>Low-Level Memory (Binary Representation)</h2>
          <pre className={styles.codeBlock}>{memoryRepresentation}</pre>
        </div>
      )}

      {/* Console Log */}
      <div className={styles.section}>
        <h2>Interactive Console Log</h2>
        <div className={styles.logArea}>
          {consoleLog.map((line, idx) => (
            <div key={idx} className={styles.logLine}>
              {line}
            </div>
          ))}
        </div>
      </div>

      <button className={styles.button} onClick={handleReset}>
        Reset Simulation
      </button>
    </div>
  );
};

export default PolymorphismVisualizer;
