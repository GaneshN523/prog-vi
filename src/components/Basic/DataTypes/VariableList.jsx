import React, { useState } from 'react';
import styles from './VariableList.module.css';

const VariableList = ({ variables, onVariableDelete, onVariableEdit, onHighlightMemory }) => {
  const [isEditing, setIsEditing] = useState(null);  // To manage the editing state for variables
  const [editValue, setEditValue] = useState('');    // Store value for editing

  const handleEditClick = (variable) => {
    setIsEditing(variable.name);
    setEditValue(variable.value);
  };

  const handleSaveEdit = (variable) => {
    onVariableEdit(variable.name, editValue);
    setIsEditing(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditValue('');
  };

  const handleVariableClick = (variable) => {
    onHighlightMemory(variable.startAddress, variable.size);
  };

  return (
    <div className={styles.variableListContainer}>
      <h2 className={styles.subHeader}>Variables</h2>
      {variables.length === 0 ? (
        <p>No variables allocated yet.</p>
      ) : (
        <table className={styles.variableTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Value</th>
              <th>Start Address</th>
              <th>Size (bytes)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {variables.map((variable, idx) => (
              <tr key={idx} onClick={() => handleVariableClick(variable)}>
                <td>{variable.name}</td>
                <td>{variable.type}</td>
                <td>
                  {isEditing === variable.name ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    variable.value
                  )}
                </td>
                <td>{variable.startAddress}</td>
                <td>{variable.size}</td>
                <td>
                  <button onClick={() => onVariableDelete(variable.name)}>Delete</button>
                  {isEditing === variable.name ? (
                    <>
                      <button onClick={() => handleSaveEdit(variable)}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleEditClick(variable)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VariableList;
