// src/components/SparseMatrixOperations.jsx
import React from "react";
import styles from "./SparseMatrixOperations.module.css";

const SparseMatrixOperations = ({ matrix, onUpdate }) => {
  const handleRetrieve = () => {
    const i = parseInt(prompt("Enter row index:"), 10);
    const j = parseInt(prompt("Enter column index:"), 10);
    const entry = matrix.sparseData.find(
      (e) => e.i === i && e.j === j
    );
    if (entry) {
      alert(`Element at (${i},${j}) is ${entry.value}`);
      onUpdate({
        ...matrix,
        simulationLog: [
          ...matrix.simulationLog,
          `Retrieved element at (${i},${j}): ${entry.value}`,
        ],
      });
    } else {
      alert(`Element at (${i},${j}) is 0 (default)`);
      onUpdate({
        ...matrix,
        simulationLog: [
          ...matrix.simulationLog,
          `Retrieved element at (${i},${j}): 0`,
        ],
      });
    }
  };

  const handleInsert = () => {
    const i = parseInt(prompt("Enter row index for insertion:"), 10);
    const j = parseInt(prompt("Enter column index for insertion:"), 10);
    const value = parseFloat(prompt("Enter nonzero value:"));
    if (value === 0) {
      alert("Value cannot be zero for insertion.");
      return;
    }
    const exists = matrix.sparseData.find((e) => e.i === i && e.j === j);
    if (exists) {
      alert("Element already exists; use modify instead.");
      return;
    }
    const newSparseData = [...matrix.sparseData, { i, j, value }];
    onUpdate({
      ...matrix,
      sparseData: newSparseData,
      simulationLog: [
        ...matrix.simulationLog,
        `Inserted element ${value} at (${i},${j})`,
      ],
    });
  };

  const handleModify = () => {
    const i = parseInt(prompt("Enter row index to modify:"), 10);
    const j = parseInt(prompt("Enter column index to modify:"), 10);
    const value = parseFloat(prompt("Enter new nonzero value:"));
    const newSparseData = matrix.sparseData.map((e) =>
      e.i === i && e.j === j ? { i, j, value } : e
    );
    onUpdate({
      ...matrix,
      sparseData: newSparseData,
      simulationLog: [
        ...matrix.simulationLog,
        `Modified element at (${i},${j}) to ${value}`,
      ],
    });
  };

  const handleDelete = () => {
    const i = parseInt(prompt("Enter row index to delete:"), 10);
    const j = parseInt(prompt("Enter column index to delete:"), 10);
    const exists = matrix.sparseData.find((e) => e.i === i && e.j === j);
    if (!exists) {
      alert("No element exists at that position.");
      return;
    }
    const newSparseData = matrix.sparseData.filter(
      (e) => !(e.i === i && e.j === j)
    );
    onUpdate({
      ...matrix,
      sparseData: newSparseData,
      simulationLog: [
        ...matrix.simulationLog,
        `Deleted element at (${i},${j})`,
      ],
    });
  };

  const handleTranspose = () => {
    // Swap i and j for all entries and swap rows/cols.
    const newSparseData = matrix.sparseData.map((e) => ({
      i: e.j,
      j: e.i,
      value: e.value,
    }));
    onUpdate({
      ...matrix,
      rows: matrix.cols,
      cols: matrix.rows,
      sparseData: newSparseData,
      simulationLog: [...matrix.simulationLog, "Transposed matrix"],
    });
  };

  // More operations (e.g., addition, multiplication, etc.) can be added similarly.

  return (
    <div className={styles.operationsContainer}>
      <h3>Operations</h3>
      <button onClick={handleRetrieve} className={styles.operationButton}>
        Retrieve Element
      </button>
      <button onClick={handleInsert} className={styles.operationButton}>
        Insert Element
      </button>
      <button onClick={handleModify} className={styles.operationButton}>
        Modify Element
      </button>
      <button onClick={handleDelete} className={styles.operationButton}>
        Delete Element
      </button>
      <button onClick={handleTranspose} className={styles.operationButton}>
        Transpose Matrix
      </button>
      {/* Additional buttons for other operations can be added here */}
    </div>
  );
};

export default SparseMatrixOperations;
