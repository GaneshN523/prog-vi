import React, { useState } from 'react';
import styles from './PointerVisualizer.module.css';

// Helper to create an initial memory grid of 16 cells.
const createInitialMemoryGrid = () => {
  const grid = [];
  const startAddress = 0x100; // starting address (in hex)
  for (let i = 0; i < 16; i++) {
    grid.push({ address: startAddress + i * 4, content: null });
  }
  return grid;
};

const PointerVisualizer = () => {
  // States for our simulation:
  const [activeOperation, setActiveOperation] = useState("createVariable");
  const [memory, setMemory] = useState(createInitialMemoryGrid());
  const [variables, setVariables] = useState([]);
  const [pointers, setPointers] = useState([]);
  const [variableCount, setVariableCount] = useState(0);
  const [pointerCount, setPointerCount] = useState(0);

  // Create Variable form states:
  const [newVarType, setNewVarType] = useState("int");
  const [newVarValue, setNewVarValue] = useState("0");

  // Create Pointer form states:
  const [newPointerType, setNewPointerType] = useState("pointer to int");
  const [selectedVariableId, setSelectedVariableId] = useState("");

  // Dereference Pointer form states:
  const [selectedPointerId, setSelectedPointerId] = useState("");
  const [dereferenceResult, setDereferenceResult] = useState(null);

  // Find the index of the first free memory cell.
  const findFreeMemoryCellIndex = () => {
    return memory.findIndex(cell => cell.content === null);
  };

  // --- Create Variable ---
  const handleCreateVariable = () => {
    const freeIndex = findFreeMemoryCellIndex();
    if (freeIndex === -1) {
      alert("No free memory cells available!");
      return;
    }
    // Create a new variable object.
    const newVar = {
      id: `var-${variableCount}`,
      type: newVarType,
      value: newVarValue,
      address: memory[freeIndex].address,
    };
    setVariables([...variables, newVar]);
    // Update the memory grid cell.
    const newMemory = [...memory];
    newMemory[freeIndex] = { 
      ...newMemory[freeIndex], 
      content: { label: newVar.id, type: newVar.type, value: newVar.value } 
    };
    setMemory(newMemory);
    setVariableCount(variableCount + 1);
  };

  // --- Create Pointer ---
  const handleCreatePointer = () => {
    if (!selectedVariableId) {
      alert("Please select a variable to point to!");
      return;
    }
    const variable = variables.find(v => v.id === selectedVariableId);
    // Check that pointer type matches the variable type.
    const expectedVarType = newPointerType.split(" ")[2];
    if (variable.type !== expectedVarType) {
      alert("Pointer type and variable type do not match!");
      return;
    }
    const freeIndex = findFreeMemoryCellIndex();
    if (freeIndex === -1) {
      alert("No free memory cells available!");
      return;
    }
    const newPtr = {
      id: `ptr-${pointerCount}`,
      pointerType: newPointerType,
      pointsTo: selectedVariableId,
      address: memory[freeIndex].address,
    };
    setPointers([...pointers, newPtr]);
    // Update the memory grid cell for the pointer.
    const newMemory = [...memory];
    newMemory[freeIndex] = {
      ...newMemory[freeIndex],
      content: { label: newPtr.id, type: newPtr.pointerType, pointsTo: newPtr.pointsTo },
    };
    setMemory(newMemory);
    setPointerCount(pointerCount + 1);
  };

  // --- Dereference Pointer ---
  const handleDereferencePointer = () => {
    if (!selectedPointerId) {
      alert("Please select a pointer!");
      return;
    }
    const pointer = pointers.find(p => p.id === selectedPointerId);
    if (!pointer) return;
    const variable = variables.find(v => v.id === pointer.pointsTo);
    if (!variable) {
      alert("This pointer does not reference a valid variable!");
      return;
    }
    // Simulate machine-level raw bit representation.
    const pointerAddressBinary = pointer.address.toString(2).padStart(16, '0');
    let variableValueBinary;
    if (variable.type === "int") {
      variableValueBinary = parseInt(variable.value).toString(2).padStart(16, '0');
    } else if (variable.type === "char") {
      variableValueBinary = variable.value.charCodeAt(0).toString(2).padStart(8, '0');
    } else if (variable.type === "float") {
      // For simplicity, convert the float to an integer part for binary representation.
      variableValueBinary = Math.floor(parseFloat(variable.value)).toString(2).padStart(16, '0');
    } else {
      variableValueBinary = "N/A";
    }
    setDereferenceResult({
      pointerAddress: pointer.address,
      pointerAddressBinary,
      variableAddress: variable.address,
      variableValue: variable.value,
      variableValueBinary,
    });
  };

  return (
    <div className={styles.pointerVisualizerContainer}>
      {/* Left Panel: Operations */}
      <div className={styles.operationsPanel}>
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveOperation("createVariable")}
            className={activeOperation === "createVariable" ? styles.active : ""}
          >
            Create Variable
          </button>
          <button
            onClick={() => setActiveOperation("createPointer")}
            className={activeOperation === "createPointer" ? styles.active : ""}
          >
            Create Pointer
          </button>
          <button
            onClick={() => setActiveOperation("dereferencePointer")}
            className={activeOperation === "dereferencePointer" ? styles.active : ""}
          >
            Dereference Pointer
          </button>
        </div>
        <div className={styles.operationContent}>
          {activeOperation === "createVariable" && (
            <div className={styles.createVariableForm}>
              <h3>Create Variable</h3>
              <div className={styles.formGroup}>
                <label>Type: </label>
                <select
                  value={newVarType}
                  onChange={(e) => {
                    const type = e.target.value;
                    setNewVarType(type);
                    // Set a default value based on type.
                    setNewVarValue(type === "int" ? "0" : type === "char" ? "A" : "0.0");
                  }}
                >
                  <option value="int">int</option>
                  <option value="char">char</option>
                  <option value="float">float</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Value: </label>
                {newVarType === "int" && (
                  <select value={newVarValue} onChange={(e) => setNewVarValue(e.target.value)}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                )}
                {newVarType === "char" && (
                  <select value={newVarValue} onChange={(e) => setNewVarValue(e.target.value)}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                )}
                {newVarType === "float" && (
                  <select value={newVarValue} onChange={(e) => setNewVarValue(e.target.value)}>
                    <option value="1.1">1.1</option>
                    <option value="2.2">2.2</option>
                    <option value="3.3">3.3</option>
                    <option value="4.4">4.4</option>
                    <option value="5.5">5.5</option>
                  </select>
                )}
              </div>
              <button onClick={handleCreateVariable}>Create Variable</button>
            </div>
          )}
          {activeOperation === "createPointer" && (
            <div className={styles.createPointerForm}>
              <h3>Create Pointer</h3>
              <div className={styles.formGroup}>
                <label>Pointer Type: </label>
                <select
                  value={newPointerType}
                  onChange={(e) => {
                    setNewPointerType(e.target.value);
                    // Reset selected variable when pointer type changes.
                    setSelectedVariableId("");
                  }}
                >
                  <option value="pointer to int">pointer to int</option>
                  <option value="pointer to char">pointer to char</option>
                  <option value="pointer to float">pointer to float</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Variable to Point To: </label>
                <select
                  value={selectedVariableId}
                  onChange={(e) => setSelectedVariableId(e.target.value)}
                >
                  <option value="">--Select Variable--</option>
                  {variables
                    .filter(v => v.type === newPointerType.split(" ")[2])
                    .map(v => (
                      <option key={v.id} value={v.id}>
                        {v.id} ({v.type}) @ 0x{v.address.toString(16)}
                      </option>
                    ))}
                </select>
              </div>
              <button onClick={handleCreatePointer}>Create Pointer</button>
            </div>
          )}
          {activeOperation === "dereferencePointer" && (
            <div className={styles.dereferencePointerForm}>
              <h3>Dereference Pointer</h3>
              <div className={styles.formGroup}>
                <label>Select Pointer: </label>
                <select
                  value={selectedPointerId}
                  onChange={(e) => setSelectedPointerId(e.target.value)}
                >
                  <option value="">--Select Pointer--</option>
                  {pointers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} ({p.pointerType}) @ 0x{p.address.toString(16)}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={handleDereferencePointer}>Dereference</button>
              {dereferenceResult && (
                <div className={styles.dereferenceResult}>
                  <h4>Dereference Result:</h4>
                  <p>
                    <strong>Pointer Address:</strong> 0x
                    {dereferenceResult.pointerAddress.toString(16)}{" "}
                    (Binary: {dereferenceResult.pointerAddressBinary})
                  </p>
                  <p>
                    <strong>Points to Variable at:</strong> 0x
                    {dereferenceResult.variableAddress.toString(16)}
                  </p>
                  <p>
                    <strong>Variable Value:</strong> {dereferenceResult.variableValue}{" "}
                    (Binary: {dereferenceResult.variableValueBinary})
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Memory Grid */}
      <div className={styles.memoryPanel}>
        <h3>Memory Grid</h3>
        <div className={styles.memoryGrid}>
          {memory.map(cell => (
            <div key={cell.address} className={styles.memoryCell}>
              <div className={styles.cellAddress}>0x{cell.address.toString(16)}</div>
              <div className={styles.cellContent}>
                {cell.content ? (
                  <>
                    <strong>{cell.content.label}</strong>
                    <div>{cell.content.type}</div>
                    {cell.content.value && <div>Val: {cell.content.value}</div>}
                    {cell.content.pointsTo && <div>→ {cell.content.pointsTo}</div>}
                  </>
                ) : (
                  <em>Empty</em>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PointerVisualizer;
