// src/components/ArrayVisualizer.jsx
import React, { useState } from "react";
import ArrayGrid from "./ArrayGrid";
import MemoryGrid from "./MemoryGrid";
import OperationsPanel from "./OperationsPanel";
import styles from "./ArrayVisualizer.module.css";

const ArrayVisualizer = () => {
  // State for the list of created arrays and tracking the active one
  const [createdArrays, setCreatedArrays] = useState([]);
  const [activeArrayId, setActiveArrayId] = useState(null);

  // States for the "Create New Array" form
  const [newArrayName, setNewArrayName] = useState("");
  const [newDataType, setNewDataType] = useState("int");
  const [newDimension, setNewDimension] = useState("1");
  const [newArrayLength, setNewArrayLength] = useState(0); // for 1D
  const [newRows, setNewRows] = useState(0); // for 2D
  const [newCols, setNewCols] = useState(0); // for 2D

  // Base address for memory simulation
  const baseAddress = 0x1000;

  // Get the active array object
  const activeArray = createdArrays.find((a) => a.id === activeArrayId);

  // Helper to update the active array in the list
  const updateActiveArray = (updatedActiveArray) => {
    setCreatedArrays((arrays) =>
      arrays.map((a) => (a.id === updatedActiveArray.id ? updatedActiveArray : a))
    );
  };

  // Handle creating a new array (1D or 2D)
  const handleCreateArray = () => {
    if (newArrayName.trim() === "") {
      alert("Please enter a valid array name!");
      return;
    }
    if (newDimension === "1" && newArrayLength <= 0) {
      alert("Please provide a valid array length!");
      return;
    }
    if (newDimension === "2" && (newRows <= 0 || newCols <= 0)) {
      alert("Please provide valid rows and columns!");
      return;
    }

    let newArray;
    if (newDimension === "1") {
      newArray = {
        id: Date.now(),
        name: newArrayName,
        dataType: newDataType,
        dimension: newDimension,
        arrayLength: newArrayLength,
        arrayData: Array(newArrayLength).fill(null),
        simulationLog: [],
      };
    } else {
      let data = [];
      for (let i = 0; i < newRows; i++) {
        let row = [];
        for (let j = 0; j < newCols; j++) {
          row.push(null);
        }
        data.push(row);
      }
      newArray = {
        id: Date.now(),
        name: newArrayName,
        dataType: newDataType,
        dimension: newDimension,
        rows: newRows,
        cols: newCols,
        arrayData: data,
        simulationLog: [],
      };
    }
    setCreatedArrays((prev) => [...prev, newArray]);
    setActiveArrayId(newArray.id);
    // Reset form fields
    setNewArrayName("");
    setNewArrayLength(0);
    setNewRows(0);
    setNewCols(0);
  };

  // Operation functions for 1D arrays (active array must exist)
  const handleAddElement = (value) => {
    if (!activeArray || activeArray.dimension !== "1") {
      alert("Operation is only available for an active 1D array.");
      return;
    }
    const firstEmpty = activeArray.arrayData.findIndex((elem) => elem === null);
    if (firstEmpty === -1) {
      alert("Array is full. Cannot add new element.");
      return;
    }
    const newArrayData = [...activeArray.arrayData];
    newArrayData[firstEmpty] = value;
    const newLog = [
      ...activeArray.simulationLog,
      `Added element "${value}" at index ${firstEmpty}`,
    ];
    updateActiveArray({ ...activeArray, arrayData: newArrayData, simulationLog: newLog });
  };

  const handleInsertElement = (index, value) => {
    if (!activeArray || activeArray.dimension !== "1") {
      alert("Operation is only available for an active 1D array.");
      return;
    }
    if (index < 0 || index >= activeArray.arrayLength) {
      alert("Index out of bounds!");
      return;
    }
    if (activeArray.arrayData[activeArray.arrayData.length - 1] !== null) {
      alert("Array is full. Cannot insert new element.");
      return;
    }
    const newArrayData = [...activeArray.arrayData];
    let newLog = [...activeArray.simulationLog];
    for (let i = newArrayData.length - 1; i > index; i--) {
      newArrayData[i] = newArrayData[i - 1];
      newLog.push(`Shifting element from index ${i - 1} to index ${i}`);
    }
    newArrayData[index] = value;
    newLog.push(`Inserted element "${value}" at index ${index}`);
    updateActiveArray({ ...activeArray, arrayData: newArrayData, simulationLog: newLog });
  };

  const handleDeleteElement = (index) => {
    if (!activeArray || activeArray.dimension !== "1") {
      alert("Operation is only available for an active 1D array.");
      return;
    }
    if (index < 0 || index >= activeArray.arrayLength) {
      alert("Index out of bounds!");
      return;
    }
    if (activeArray.arrayData[index] === null) {
      alert("No element at this index to delete.");
      return;
    }
    const newArrayData = [...activeArray.arrayData];
    let newLog = [
      ...activeArray.simulationLog,
      `Deleting element "${newArrayData[index]}" at index ${index}`,
    ];
    for (let i = index; i < newArrayData.length - 1; i++) {
      newArrayData[i] = newArrayData[i + 1];
      newLog.push(`Shifting element from index ${i + 1} to index ${i}`);
    }
    newArrayData[newArrayData.length - 1] = null;
    newLog.push(`Set last index ${newArrayData.length - 1} to empty`);
    updateActiveArray({ ...activeArray, arrayData: newArrayData, simulationLog: newLog });
  };

  const handleEditElement = (indexOrIndices, newValue) => {
    if (!activeArray) return;
    if (activeArray.dimension === "1") {
      if (indexOrIndices < 0 || indexOrIndices >= activeArray.arrayLength) {
        alert("Index out of bounds!");
        return;
      }
      const newArrayData = [...activeArray.arrayData];
      newArrayData[indexOrIndices] = newValue;
      const newLog = [
        ...activeArray.simulationLog,
        `Edited element at index ${indexOrIndices} to "${newValue}"`,
      ];
      updateActiveArray({ ...activeArray, arrayData: newArrayData, simulationLog: newLog });
    } else if (activeArray.dimension === "2") {
      const [rowIndex, colIndex] = indexOrIndices;
      if (
        rowIndex < 0 ||
        rowIndex >= activeArray.rows ||
        colIndex < 0 ||
        colIndex >= activeArray.cols
      ) {
        alert("Index out of bounds!");
        return;
      }
      const newArrayData = activeArray.arrayData.map((row, r) =>
        r === rowIndex ? row.map((cell, c) => (c === colIndex ? newValue : cell)) : row
      );
      const newLog = [
        ...activeArray.simulationLog,
        `Edited element at index [${rowIndex},${colIndex}] to "${newValue}"`,
      ];
      updateActiveArray({ ...activeArray, arrayData: newArrayData, simulationLog: newLog });
    }
  };

  const handleSortArray = () => {
    if (!activeArray || activeArray.dimension !== "1") {
      alert("Operation is only available for an active 1D array.");
      return;
    }
    const nonNull = activeArray.arrayData.filter((elem) => elem !== null);
    nonNull.sort();
    const newArrayData = activeArray.arrayData.map((elem, i) =>
      nonNull[i] !== undefined ? nonNull[i] : null
    );
    const newLog = [...activeArray.simulationLog, "Sorted array"];
    updateActiveArray({ ...activeArray, arrayData: newArrayData, simulationLog: newLog });
  };

  // Delete an entire array from the list
  const handleDeleteArray = (id) => {
    setCreatedArrays((arrays) => arrays.filter((a) => a.id !== id));
    if (activeArrayId === id) {
      setActiveArrayId(null);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Array Data Structure Visualizer</h2>

      {/* Create New Array Form */}
      <div className={styles.formContainer}>
        <h3>Create New Array</h3>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Array Name:{" "}
            <input
              type="text"
              value={newArrayName}
              onChange={(e) => setNewArrayName(e.target.value)}
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Data Type:{" "}
            <select value={newDataType} onChange={(e) => setNewDataType(e.target.value)}>
              <option value="int">int</option>
              <option value="float">float</option>
              <option value="char">char</option>
              <option value="bool">bool</option>
            </select>
          </label>
          <label className={styles.label} style={{ marginLeft: "10px" }}>
            Dimension:{" "}
            <select value={newDimension} onChange={(e) => setNewDimension(e.target.value)}>
              <option value="1">1D</option>
              <option value="2">2D</option>
            </select>
          </label>
        </div>
        {newDimension === "1" ? (
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Array Length:{" "}
              <input
                type="number"
                value={newArrayLength}
                onChange={(e) => setNewArrayLength(parseInt(e.target.value, 10))}
                className={styles.inputField}
              />
            </label>
          </div>
        ) : (
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Rows:{" "}
              <input
                type="number"
                value={newRows}
                onChange={(e) => setNewRows(parseInt(e.target.value, 10))}
                className={styles.inputField}
              />
            </label>
            <label className={styles.label} style={{ marginLeft: "10px" }}>
              Columns:{" "}
              <input
                type="number"
                value={newCols}
                onChange={(e) => setNewCols(parseInt(e.target.value, 10))}
                className={styles.inputField}
              />
            </label>
          </div>
        )}
        <button onClick={handleCreateArray}>Create Array</button>
      </div>

      {/* List of Created Arrays */}
      <div className={styles.arrayList}>
        <h3>Created Arrays</h3>
        {createdArrays.length === 0 ? (
          <div>No arrays created.</div>
        ) : (
          <ul>
            {createdArrays.map((array) => (
              <li key={array.id}>
                <button
                  onClick={() => setActiveArrayId(array.id)}
                  className={styles.arrayButton}
                >
                  {array.name} ({array.dimension === "1" ? "1D" : "2D"})
                </button>
                <button
                  onClick={() => handleDeleteArray(array.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Active Array Display */}
      {activeArray ? (
        <>
          <h3 className={styles.activeArrayHeader}>Active Array: {activeArray.name}</h3>
          <div className={styles.formGroup}>
            <strong>Data Type:</strong> {activeArray.dataType} |{" "}
            <strong>Dimension:</strong> {activeArray.dimension === "1" ? "1D" : "2D"}
            {activeArray.dimension === "1"
              ? ` | Array Length: ${activeArray.arrayLength}`
              : ` | Rows: ${activeArray.rows}, Columns: ${activeArray.cols}`}
          </div>
          <hr />
          <h3>Array Grid</h3>
          <ArrayGrid
            dimension={activeArray.dimension}
            arrayData={activeArray.arrayData}
            onEditElement={handleEditElement}
            onDeleteElement={handleDeleteElement}
          />
          <hr />
          <h3>Memory Grid Representation</h3>
          <MemoryGrid
            dimension={activeArray.dimension}
            arrayData={activeArray.arrayData}
            dataType={activeArray.dataType}
            baseAddress={baseAddress}
            cols={activeArray.dimension === "1" ? activeArray.arrayLength : activeArray.cols}
          />
          <hr />
          <OperationsPanel
            dimension={activeArray.dimension}
            arrayData={activeArray.arrayData}
            onAddElement={handleAddElement}
            onInsertElement={handleInsertElement}
            onDeleteElement={handleDeleteElement}
            onSortArray={handleSortArray}
          />
          <hr />
          <div>
            <h3>Simulation Log</h3>
            <button
              onClick={() =>
                updateActiveArray({ ...activeArray, simulationLog: [] })
              }
              className={styles.clearLogButton}
            >
              Clear Log
            </button>
            <div className={styles.simulationLogContainer}>
              {activeArray.simulationLog.map((msg, index) => (
                <div key={index}>{msg}</div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>Please select an array from the list or create a new one.</div>
      )}
    </div>
  );
};

export default ArrayVisualizer;
