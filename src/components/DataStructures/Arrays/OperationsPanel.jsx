// src/components/OperationsPanel.jsx
import React from "react";
import styles from "./OperationsPanel.module.css";

const OperationsPanel = ({
  dimension,
  arrayData,
  onAddElement,
  onInsertElement,
  onDeleteElement,
  onSearchElement,
  onSortArray,
}) => {
  if (dimension === "1") {
    return (
      <div className={styles.operationsPanel}>
        <h3 className={styles.operationsHeader}>Operations</h3>
        <button
          onClick={() => {
            const value = prompt("Enter value to add at end:");
            if (value !== null) onAddElement(value);
          }}
          className={styles.operationButton}
          title="O(1) average time complexity"
        >
          Add Element at End (simulate shift if needed)
        </button>
        <button
          onClick={() => {
            const index = prompt("Enter index to insert at:");
            const value = prompt("Enter value to insert:");
            if (index !== null && value !== null)
              onInsertElement(parseInt(index, 10), value);
          }}
          className={styles.operationButton}
          title="O(n) time complexity due to shifting"
        >
          Insert Element at Index (simulate shifting)
        </button>
        <button
          onClick={() => {
            const index = prompt("Enter index to delete:");
            if (index !== null) onDeleteElement(parseInt(index, 10));
          }}
          className={styles.operationButton}
          title="O(n) time complexity due to shifting"
        >
          Delete Element at Index (simulate shifting)
        </button>
        <button
          onClick={() => {
            const value = prompt("Enter value to search:");
            const index = arrayData.findIndex((elem) => elem === value);
            if (index !== -1) {
              alert(
                `Element found at index ${index} (O(n) time complexity for unsorted arrays)`
              );
            } else {
              alert("Element not found (O(n) time complexity)");
            }
            if (onSearchElement) {
              onSearchElement(value);
            }
          }}
          className={styles.operationButton}
          title="O(n) time complexity"
        >
          Search Element (O(n))
        </button>
        <button
          onClick={() => {
            onSortArray();
            alert("Array sorted (O(n log n) time complexity)");
          }}
          className={styles.operationButton}
          title="O(n log n) time complexity"
        >
          Sort Array (non-null values)
        </button>
      </div>
    );
  } else if (dimension === "2") {
    return (
      <div className={styles.operationsPanel}>
        <h3 className={styles.operationsHeader}>Operations</h3>
        <p>
          2D array operations (insertion, deletion, etc.) can be similarly added.
        </p>
      </div>
    );
  } else {
    return null;
  }
};

export default OperationsPanel;
