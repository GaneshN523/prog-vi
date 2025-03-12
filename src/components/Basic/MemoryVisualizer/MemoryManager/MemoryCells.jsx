import React from "react";
import styles from "./memorycells.module.css";

const MemoryCells = ({
  memory,
  memorySize,
  updateMemorySize,
  selectedCell,
  setSelectedCell,
  cellEditValue,
  setCellEditValue,
  updateMemoryCell,
  getCellBackgroundClass,
  asciiEquivalent,
}) => {
  return (
    <div className={styles.memoryCellsContainer}>
      {/* Memory Size Input */}
      <div className={styles.memorySizeInput}>
        <label>Memory Size:</label>
        <input
          type="number"
          min="16"
          value={memorySize}
          onChange={(e) => updateMemorySize(parseInt(e.target.value))}
        />
      </div>

      {/* Memory Grid */}
      <div className={styles.memoryGrid}>
        {memory.map((value, index) => (
          <div
            key={index}
            className={`${styles.memoryCell} ${
              selectedCell === index
                ? styles.selectedCell
                : getCellBackgroundClass(index)
            }`}
            onClick={() => {
              setSelectedCell(index);
              setCellEditValue(value);
            }}
          >
            <span>Addr {index}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>

      {/* Direct Memory Cell Edit */}
      {selectedCell !== null && (
        <div className={styles.cellEdit}>
          <input
            type="text"
            value={cellEditValue}
            onChange={(e) => setCellEditValue(e.target.value)}
            placeholder="Enter ASCII char or 8-bit binary"
          />
          <span className={styles.asciiOutput}>
            {asciiEquivalent && `ASCII: ${asciiEquivalent}`}
          </span>
          <button className={styles.button} onClick={updateMemoryCell}>
            Update Cell {selectedCell}
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryCells;
