import React from 'react';
import styles from './MemoryGrid.module.css';

const MemoryGrid = ({ memory, totalCells }) => {
  return (
    <div className={styles.memoryGridContainer}>
      <h2 className={styles.subHeader}>Memory Grid</h2>
      <div className={styles.memoryGrid}>
        {memory.map((cell, index) => (
          <div key={index} className={styles.memoryCell}>
            <span className={styles.address}>Addr {index}</span>
            <span className={styles.cellValue}>{cell}</span>
          </div>
        ))}
      </div>
      <p className={styles.memoryInfo}>Total Memory Cells: {totalCells}</p>
    </div>
  );
};

export default MemoryGrid;
