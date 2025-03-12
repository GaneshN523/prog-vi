import React, { useState } from 'react';
import styles from './InheritanceVisualizer.module.css';

const InheritanceVisualizer = () => {
  // State for Parent Class properties
  const [parentProps, setParentProps] = useState([]);
  const [newParentPropName, setNewParentPropName] = useState("");
  const [newParentPropValue, setNewParentPropValue] = useState("");

  // State for Child Class properties
  const [childProps, setChildProps] = useState([]);
  const [newChildPropName, setNewChildPropName] = useState("");
  const [newChildPropValue, setNewChildPropValue] = useState("");

  // Code representations for classes
  const [parentClassCode, setParentClassCode] = useState("");
  const [childClassCode, setChildClassCode] = useState("");

  // Object simulation state
  const [objectCreated, setObjectCreated] = useState(false);
  const [childObjectState, setChildObjectState] = useState({});

  // Low-level memory representation state
  const [memoryRepresentation, setMemoryRepresentation] = useState([]);

  // Console log to trace operations
  const [consoleLog, setConsoleLog] = useState([]);

  // Helper: Append message to console log
  const addLog = (message) => {
    setConsoleLog((prev) => [...prev, message]);
  };

  // Add a new property to the Parent Class
  const addParentProperty = () => {
    if (!newParentPropName.trim()) {
      alert("Enter a property name for the parent class.");
      return;
    }
    const prop = {
      id: Date.now(),
      name: newParentPropName,
      value: newParentPropValue
    };
    setParentProps([...parentProps, prop]);
    setNewParentPropName("");
    setNewParentPropValue("");
    addLog(`Added parent property '${prop.name}' with value '${prop.value}'.`);
  };

  // Add a new property to the Child Class
  const addChildProperty = () => {
    if (!newChildPropName.trim()) {
      alert("Enter a property name for the child class.");
      return;
    }
    const prop = {
      id: Date.now(),
      name: newChildPropName,
      value: newChildPropValue
    };
    setChildProps([...childProps, prop]);
    setNewChildPropName("");
    setNewChildPropValue("");
    addLog(`Added child property '${prop.name}' with value '${prop.value}'.`);
  };

  // Generate Parent Class Code (High-Level)
  const generateParentClass = () => {
    let code = `class Parent {\n  constructor() {\n`;
    parentProps.forEach(prop => {
      code += `    this.${prop.name} = "${prop.value}";\n`;
    });
    code += "  }\n}";
    setParentClassCode(code);
    addLog("Generated Parent class code.");
  };

  // Generate Child Class Code (High-Level)
  const generateChildClass = () => {
    let code = `class Child extends Parent {\n  constructor() {\n    super();\n`;
    childProps.forEach(prop => {
      code += `    this.${prop.name} = "${prop.value}";\n`;
    });
    code += "  }\n}";
    setChildClassCode(code);
    addLog("Generated Child class code.");
  };

  // Simulate creation of a Child object that inherits parent's properties
  const createChildObject = () => {
    let obj = {};
    parentProps.forEach(prop => {
      obj[prop.name] = prop.value;
    });
    childProps.forEach(prop => {
      obj[prop.name] = prop.value;
    });
    setChildObjectState(obj);
    setObjectCreated(true);
    addLog("Created Child object inheriting parent properties.");
  };

  // Helper: Convert value to raw binary representation
  const convertToBinary = (value) => {
    if (!value) return "";
    if (!isNaN(value)) {
      return parseInt(value, 10).toString(2).padStart(8, '0');
    }
    return value.split("").map(char => 
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join(" ");
  };

  // Generate low-level memory view for object properties
  const generateMemoryRepresentation = () => {
    let memRepr = [];
    Object.keys(childObjectState).forEach(key => {
      memRepr.push({
        name: key,
        binary: convertToBinary(childObjectState[key])
      });
    });
    setMemoryRepresentation(memRepr);
    addLog("Generated low-level memory representation.");
  };

  // Reset simulation
  const resetSimulation = () => {
    setParentProps([]);
    setChildProps([]);
    setNewParentPropName("");
    setNewParentPropValue("");
    setNewChildPropName("");
    setNewChildPropValue("");
    setParentClassCode("");
    setChildClassCode("");
    setChildObjectState({});
    setObjectCreated(false);
    setMemoryRepresentation([]);
    setConsoleLog([]);
  };

  return (
    <div className={styles.container}>
      <h1>Inheritance Visualizer</h1>

      {/* Parent Class Definition Section */}
      <div className={styles.section}>
        <h2>Step 1: Define Parent Class</h2>
        <div className={styles.formGroup}>
          <label>Parent Property Name:</label>
          <input
            type="text"
            value={newParentPropName}
            onChange={(e) => setNewParentPropName(e.target.value)}
            className={styles.input}
            placeholder="e.g., color"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Parent Property Value:</label>
          <input
            type="text"
            value={newParentPropValue}
            onChange={(e) => setNewParentPropValue(e.target.value)}
            className={styles.input}
            placeholder="e.g., red"
          />
        </div>
        <button className={styles.button} onClick={addParentProperty}>
          Add Parent Property
        </button>
        {parentProps.length > 0 && (
          <div className={styles.listSection}>
            <h3>Parent Properties:</h3>
            <ul>
              {parentProps.map(prop => (
                <li key={prop.id}>
                  {prop.name}: {prop.value}
                </li>
              ))}
            </ul>
            <button className={styles.button} onClick={generateParentClass}>
              Generate Parent Class Code
            </button>
            {parentClassCode && (
              <pre className={styles.codeBlock}>{parentClassCode}</pre>
            )}
          </div>
        )}
      </div>

      {/* Child Class Definition Section */}
      {parentClassCode && (
        <div className={styles.section}>
          <h2>Step 2: Define Child Class</h2>
          <div className={styles.formGroup}>
            <label>Child Property Name:</label>
            <input
              type="text"
              value={newChildPropName}
              onChange={(e) => setNewChildPropName(e.target.value)}
              className={styles.input}
              placeholder="e.g., radius"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Child Property Value:</label>
            <input
              type="text"
              value={newChildPropValue}
              onChange={(e) => setNewChildPropValue(e.target.value)}
              className={styles.input}
              placeholder="e.g., 10"
            />
          </div>
          <button className={styles.button} onClick={addChildProperty}>
            Add Child Property
          </button>
          {childProps.length > 0 && (
            <div className={styles.listSection}>
              <h3>Child Properties:</h3>
              <ul>
                {childProps.map(prop => (
                  <li key={prop.id}>
                    {prop.name}: {prop.value}
                  </li>
                ))}
              </ul>
              <button className={styles.button} onClick={generateChildClass}>
                Generate Child Class Code
              </button>
              {childClassCode && (
                <pre className={styles.codeBlock}>{childClassCode}</pre>
              )}
            </div>
          )}
        </div>
      )}

      {/* Object Creation & Memory Visualization */}
      {childClassCode && (
        <div className={styles.section}>
          <h2>Step 3: Create Child Object</h2>
          <button className={styles.button} onClick={createChildObject}>
            Create Object
          </button>
          {objectCreated && (
            <div className={styles.objectState}>
              <h3>Child Object State (High-Level)</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(childObjectState).map(([key, value], index) => (
                    <tr key={index}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className={styles.button} onClick={generateMemoryRepresentation}>
                Show Low-Level Memory Representation
              </button>
            </div>
          )}
        </div>
      )}

      {/* Low-Level Memory Representation */}
      {memoryRepresentation.length > 0 && (
        <div className={styles.section}>
          <h2>Low-Level Memory (Binary Representation)</h2>
          {memoryRepresentation.map((item, index) => (
            <div key={index} className={styles.memoryBlock}>
              <strong>{item.name}:</strong>
              <pre className={styles.codeBlock}>{item.binary}</pre>
            </div>
          ))}
        </div>
      )}

      {/* Console Log Section */}
      <div className={styles.section}>
        <h2>Interactive Console Log</h2>
        <div className={styles.logArea}>
          {consoleLog.map((log, index) => (
            <div key={index} className={styles.logLine}>
              {log}
            </div>
          ))}
        </div>
      </div>

      <button className={styles.button} onClick={resetSimulation}>
        Reset Simulation
      </button>
    </div>
  );
};

export default InheritanceVisualizer;
