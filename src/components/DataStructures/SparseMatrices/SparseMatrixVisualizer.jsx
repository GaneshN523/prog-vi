// src/components/SparseMatrixVisualizer.jsx
import React, { useState } from "react";
import SparseMatrixCreation from "./SparseMatrixCreation";
import SparseMatrixRepresentation from "./SparseMatrixRepresentation";
import SparseMatrixOperations from "./SparseMatrixOperations";
import SparseMatrixMemoryGrid from "./SparseMatrixMemoryGrid";
import styles from "./SparseMatrixVisualizer.module.css";

const SparseMatrixVisualizer = () => {
  const [createdMatrices, setCreatedMatrices] = useState([]);
  const [activeMatrixId, setActiveMatrixId] = useState(null);

  const activeMatrix = createdMatrices.find((m) => m.id === activeMatrixId);

  const handleCreate = (matrix) => {
    setCreatedMatrices([...createdMatrices, matrix]);
    setActiveMatrixId(matrix.id);
  };

  const handleUpdate = (updatedMatrix) => {
    setCreatedMatrices(
      createdMatrices.map((m) => (m.id === updatedMatrix.id ? updatedMatrix : m))
    );
  };

  const handleDeleteMatrix = (id) => {
    setCreatedMatrices(createdMatrices.filter((m) => m.id !== id));
    if (activeMatrixId === id) {
      setActiveMatrixId(null);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Sparse Matrix Visualizer</h2>

      <SparseMatrixCreation onCreate={handleCreate} />

      <div className={styles.matrixList}>
        <h3>Created Matrices</h3>
        {createdMatrices.length === 0 ? (
          <div>No matrices created.</div>
        ) : (
          <ul>
            {createdMatrices.map((matrix) => (
              <li key={matrix.id} className={styles.matrixItem}>
                <button
                  onClick={() => setActiveMatrixId(matrix.id)}
                  className={styles.matrixButton}
                >
                  {matrix.name} ({matrix.rows}×{matrix.cols}, {matrix.representation})
                </button>
                <button
                  onClick={() => handleDeleteMatrix(matrix.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {activeMatrix ? (
        <div className={styles.activeMatrixContainer}>
          <h3>Active Matrix: {activeMatrix.name}</h3>
          <div>
            <strong>Dimensions:</strong> {activeMatrix.rows} × {activeMatrix.cols} |{" "}
            <strong>Representation:</strong> {activeMatrix.representation}
          </div>
          <SparseMatrixRepresentation matrix={activeMatrix} onUpdate={handleUpdate} />
          <SparseMatrixOperations matrix={activeMatrix} onUpdate={handleUpdate} />
          <SparseMatrixMemoryGrid matrix={activeMatrix} />
          <div className={styles.simulationLog}>
            <h3>Simulation Log</h3>
            <button
              onClick={() =>
                handleUpdate({ ...activeMatrix, simulationLog: [] })
              }
              className={styles.clearLogButton}
            >
              Clear Log
            </button>
            <div className={styles.logContainer}>
              {activeMatrix.simulationLog.map((msg, index) => (
                <div key={index}>{msg}</div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>Please select a matrix from the list or create a new one.</div>
      )}
    </div>
  );
};

export default SparseMatrixVisualizer;
