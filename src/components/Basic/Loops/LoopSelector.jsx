import React from 'react';
import styles from './LoopSelector.module.css';

function LoopSelector({ loopType, setLoopType }) {
  return (
    <label className={styles.selectorLabel}>
      <strong>Select Loop Type:</strong>
      <select
        value={loopType}
        onChange={(e) => setLoopType(e.target.value)}
        className={styles.selectLoop}
      >
        <option value="for">For</option>
        <option value="while">While</option>
        <option value="do-while">Do-While</option>
        <option value="for-each">For-Each</option>
      </select>
    </label>
  );
}

export default LoopSelector;
