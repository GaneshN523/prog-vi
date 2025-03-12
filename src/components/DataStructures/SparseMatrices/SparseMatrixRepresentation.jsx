// src/components/SparseMatrixRepresentation.jsx
import React, { useState } from "react";
import styles from "./SparseMatrixRepresentation.module.css";
import { convertCOOToCSR, convertCOOToCSC } from "./sparseMatrixUtils";

const SparseMatrixRepresentation = ({ matrix, onUpdate }) => {
  const [selectedRep, setSelectedRep] = useState(matrix.representation);

  const handleChangeRepresentation = (newRep) => {
    let newSparseData = matrix.sparseData;
    let logMsg = "";
    if (matrix.representation === "COO" && newRep === "CSR") {
      newSparseData = convertCOOToCSR(matrix.sparseData, matrix.rows, matrix.cols);
      logMsg = "Converted from COO to CSR.";
    } else if (matrix.representation === "COO" && newRep === "CSC") {
      newSparseData = convertCOOToCSC(matrix.sparseData, matrix.rows, matrix.cols);
      logMsg = "Converted from COO to CSC.";
    } else {
      logMsg = `Representation changed to ${newRep}. (Simulation)`;
    }
    setSelectedRep(newRep);
    onUpdate({
      ...matrix,
      representation: newRep,
      sparseData: newSparseData,
      simulationLog: [...matrix.simulationLog, logMsg],
    });
  };

  return (
    <div className={styles.representationContainer}>
      <h3>Matrix Representation</h3>
      <div className={styles.formGroup}>
        <label>
          Select Representation:
          <select
            value={selectedRep}
            onChange={(e) => handleChangeRepresentation(e.target.value)}
          >
            <option value="COO">COO (Coordinate List)</option>
            <option value="CSR">CSR (Compressed Sparse Row)</option>
            <option value="CSC">CSC (Compressed Sparse Column)</option>
            <option value="DOK">DOK (Dictionary of Keys)</option>
            <option value="Triplet">Triplet (List of Tuples)</option>
            <option value="LinkedList">Linked List</option>
          </select>
        </label>
      </div>
      {selectedRep === "COO" && (
        <div className={styles.cooView}>
          <h4>COO Representation</h4>
          <table className={styles.cooTable}>
            <thead>
              <tr>
                <th>Row</th>
                <th>Col</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {matrix.sparseData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.i}</td>
                  <td>{entry.j}</td>
                  <td>{entry.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Additional views for other representations can be added here */}
    </div>
  );
};

export default SparseMatrixRepresentation;
