import React from 'react';
import styles from './VariablesTable.module.css';

const VariablesTable = ({ variables }) => {
  return (
    <div className={styles.variablesTableContainer}>
      <h2 className={styles.subHeader}>Variables</h2>
      <table className={styles.variablesTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Value</th>
            <th>Memory Address</th>
            <th>Size</th>
            <th>Binary</th>
          </tr>
        </thead>
        <tbody>
          {variables.map((variable) => (
            <tr key={variable.name}>
              <td>{variable.name}</td>
              <td>{variable.type}</td>
              <td>{String(variable.value)}</td>
              <td>{variable.memoryAddress}</td>
              <td>{variable.size}</td>
              <td>{variable.binary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariablesTable;
