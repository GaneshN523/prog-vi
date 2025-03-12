// src/components/SparseMatrixMemoryGrid.jsx
import React from "react";
import styles from "./SparseMatrixMemoryGrid.module.css";
import { getBinaryRepresentation } from "./sparseMatrixUtils";

const SparseMatrixMemoryGrid = ({ matrix, baseAddress = 0x2000 }) => {
  // For simulation, each nonzero element is assigned a dummy memory address.
  return (
    <div>
      <h3>Memory Grid Representation</h3>
      <div className={styles.memoryGridContainer}>
        {matrix.sparseData.map((entry, index) => {
          const address = baseAddress + index * 4; // assume each entry occupies 4 bytes
          return (
            <div key={index} className={styles.memoryCell}>
              <div>
                <strong>Address:</strong> {`0x${address.toString(16)}`}
              </div>
              <div>
                <strong>Value:</strong> {getBinaryRepresentation(entry.value)}
              </div>
              <div>
                <strong>Location:</strong> ({entry.i}, {entry.j})
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SparseMatrixMemoryGrid;
