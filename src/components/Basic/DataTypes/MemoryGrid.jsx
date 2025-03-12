// MemoryGrid.jsx
import React from 'react';
import styles from './MemoryGrid.module.css';

const MemoryGrid = ({ memory, totalCells }) => {
  const getBinaryAddress = (index) => {
    return index.toString(2).padStart(Math.ceil(Math.log2(totalCells)), '0');
  };

  return (
    <div className={styles.memoryGridContainer}>
      <h2 className={styles.subHeader}>Memory Grid</h2>
      <p className={styles.memoryInfo}>Total Memory Cells: {totalCells}</p>
      <div className={styles.memoryGrid}>
        {memory.map((cell, index) => (
          <div key={index} className={styles.memoryCell}>
            <span className={styles.address}>
              Addr {index} ({getBinaryAddress(index)})
            </span>
            <span className={styles.cellValue}>{cell}</span>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default MemoryGrid;
