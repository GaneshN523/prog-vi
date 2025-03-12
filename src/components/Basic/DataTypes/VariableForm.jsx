// VariableForm.jsx
import { useState } from 'react';
import styles from './VariableForm.module.css';

const VariableForm = ({ onAddVariable }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('integer');
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !value) {
      alert('Please enter both a name and a value.');
      return;
    }
    onAddVariable({ name, type, value });
    setName('');
    setValue('');
  };

  return (
    <form className={styles.variableForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>Variable Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. x"
        />
      </div>
      <div className={styles.formGroup}>
        <label>Data Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="integer">Integer (4 bytes)</option>
          <option value="float">Float (4 bytes)</option>
          <option value="char">Char (1 byte)</option>
          <option value="boolean">Boolean (1 byte)</option>
          <option value="string">String (n bytes)</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label>Value:</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 42 or hello"
        />
      </div>
      <button type="submit" className={styles.button}>Add Variable</button>
    </form>
  );
};

export default VariableForm;
