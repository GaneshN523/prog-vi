import React from 'react';
import styles from './MemoryGrid.module.css';

function MemoryGrid({ counter }) {
  // Convert counter to a 16-bit unsigned binary string.
  const binaryString = (Number(counter) >>> 0).toString(2).padStart(16, '0');

  return (
    <div className={styles.memoryGrid}>
      <h3>Memory Grid (Raw Bits)</h3>
      <div className={styles.gridContainer}>
        {binaryString.split('').map((bit, index) => (
          <div key={index} className={styles.gridItem}>
            {bit}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemoryGrid;
