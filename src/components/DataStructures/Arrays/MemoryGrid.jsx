// src/components/MemoryGrid.jsx
import React from "react";
import { typeSizes, getBinaryRepresentation } from "./arrayUtils";
import styles from "./MemoryGrid.module.css";

const MemoryGrid = ({ dimension, arrayData, dataType, baseAddress, cols }) => {
  if (dimension === "1") {
    return (
      <div className={styles.memoryGridContainer}>
        {arrayData.map((elem, index) => {
          const address = baseAddress + index * typeSizes[dataType];
          return (
            <div key={index} className={styles.memoryCell}>
              <div>
                <strong>Address:</strong> {`0x${address.toString(16)}`}
              </div>
              <div>
                <strong>Value:</strong> {getBinaryRepresentation(elem, dataType)}
              </div>
              <div>
                <strong>Index:</strong> {index}
              </div>
            </div>
          );
        })}
      </div>
    );
  } else if (dimension === "2") {
    return (
      <div>
        {arrayData.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.memoryRow}>
            {row.map((elem, colIndex) => {
              const index = rowIndex * cols + colIndex;
              const address = baseAddress + index * typeSizes[dataType];
              return (
                <div key={colIndex} className={styles.memoryCell}>
                  <div>
                    <strong>Address:</strong> {`0x${address.toString(16)}`}
                  </div>
                  <div>
                    <strong>Value:</strong> {getBinaryRepresentation(elem, dataType)}
                  </div>
                  <div>
                    <strong>Index:</strong> [{rowIndex},{colIndex}]
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export default MemoryGrid;
