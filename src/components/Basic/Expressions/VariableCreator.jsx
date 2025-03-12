import React, { useState } from 'react';
import styles from './VariableCreator.module.css';

const VariableCreator = ({ onAddVariable }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('number');
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || value === '') {
      alert('Please enter both a variable name and a value.');
      return;
    }
    onAddVariable({ name, type, value });
    setName('');
    setValue('');
  };

  return (
    <form className={styles.variableCreator} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>Variable Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. a"
        />
      </div>
      <div className={styles.formGroup}>
        <label>Data Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="number">Number</option>
          <option value="string">String</option>
          <option value="boolean">Boolean</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label>Value:</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
        />
      </div>
      <button type="submit" className={styles.button}>
        Add Variable
      </button>
    </form>
  );
};

export default VariableCreator;
