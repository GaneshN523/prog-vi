// src/components/SparseMatrixCreation.jsx
import React, { useState } from "react";
import styles from "./SparseMatrixCreation.module.css";
import { denseToCOO } from "./sparseMatrixUtils";

const SparseMatrixCreation = ({ onCreate }) => {
  const [creationMethod, setCreationMethod] = useState("dense");
  const [name, setName] = useState("");
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [denseMatrix, setDenseMatrix] = useState([]);
  const [cooText, setCooText] = useState("");

  const initializeDenseMatrix = (r, c) => {
    const matrix = Array.from({ length: r }, () => Array(c).fill(0));
    setDenseMatrix(matrix);
  };

  const handleDenseMatrixChange = (i, j, value) => {
    const newMatrix = denseMatrix.map((row) => [...row]);
    newMatrix[i][j] = value;
    setDenseMatrix(newMatrix);
  };

  const handleCreate = () => {
    if (!name) {
      alert("Please enter a name for the sparse matrix.");
      return;
    }
    if (creationMethod === "dense") {
      if (rows <= 0 || cols <= 0) {
        alert("Please enter valid dimensions.");
        return;
      }
      // Convert the dense matrix to a COO representation.
      const coo = denseToCOO(denseMatrix);
      onCreate({
        id: Date.now(),
        name,
        rows,
        cols,
        denseMatrix,
        sparseData: coo,
        representation: "COO",
        simulationLog: [
          `Created from Dense Matrix; converted to COO with ${coo.length} nonzero element(s).`,
        ],
      });
    } else if (creationMethod === "coo") {
      // Parse the COO text input: each line should be "row,col,value"
      const lines = cooText.split("\n").filter((line) => line.trim() !== "");
      const coo = [];
      let maxRow = 0,
        maxCol = 0;
      lines.forEach((line) => {
        const parts = line.split(",");
        if (parts.length === 3) {
          const i = parseInt(parts[0], 10);
          const j = parseInt(parts[1], 10);
          const value = parseFloat(parts[2]);
          coo.push({ i, j, value });
          if (i > maxRow) maxRow = i;
          if (j > maxCol) maxCol = j;
        }
      });
      onCreate({
        id: Date.now(),
        name,
        rows: maxRow + 1,
        cols: maxCol + 1,
        denseMatrix: null,
        sparseData: coo,
        representation: "COO",
        simulationLog: [
          `Created from COO text input with ${coo.length} nonzero element(s).`,
        ],
      });
    }
  };

  return (
    <div className={styles.creationContainer}>
      <h3>Create Sparse Matrix</h3>
      <div className={styles.formGroup}>
        <label>
          Name:{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          <input
            type="radio"
            value="dense"
            checked={creationMethod === "dense"}
            onChange={() => setCreationMethod("dense")}
          />
          From Dense Matrix
        </label>
        <label>
          <input
            type="radio"
            value="coo"
            checked={creationMethod === "coo"}
            onChange={() => setCreationMethod("coo")}
          />
          From Coordinate List (COO)
        </label>
      </div>
      {creationMethod === "dense" ? (
        <div className={styles.denseCreation}>
          <div className={styles.formGroup}>
            <label>
              Rows:{" "}
              <input
                type="number"
                value={rows}
                onChange={(e) => {
                  const r = parseInt(e.target.value, 10);
                  setRows(r);
                  if (r > 0 && cols > 0) {
                    initializeDenseMatrix(r, cols);
                  }
                }}
              />
            </label>
            <label>
              Columns:{" "}
              <input
                type="number"
                value={cols}
                onChange={(e) => {
                  const c = parseInt(e.target.value, 10);
                  setCols(c);
                  if (rows > 0 && c > 0) {
                    initializeDenseMatrix(rows, c);
                  }
                }}
              />
            </label>
          </div>
          {denseMatrix.length > 0 && (
            <div className={styles.matrixGrid}>
              {denseMatrix.map((row, i) => (
                <div key={i} className={styles.matrixRow}>
                  {row.map((val, j) => (
                    <input
                      key={j}
                      type="number"
                      value={val}
                      onChange={(e) =>
                        handleDenseMatrixChange(i, j, e.target.value)
                      }
                      className={styles.matrixCell}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.cooCreation}>
          <div className={styles.formGroup}>
            <label>
              Enter COO data (each line: row,col,value):
            </label>
          </div>
          <textarea
            value={cooText}
            onChange={(e) => setCooText(e.target.value)}
            className={styles.cooTextArea}
          ></textarea>
        </div>
      )}
      <button onClick={handleCreate} className={styles.createButton}>
        Create Sparse Matrix
      </button>
    </div>
  );
};

export default SparseMatrixCreation;
