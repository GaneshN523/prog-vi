// src/components/ArrayGrid.jsx
import React from "react";
import styles from "./ArrayGrid.module.css";

const ArrayGrid = ({ dimension, arrayData, onEditElement, onDeleteElement }) => {
  if (dimension === "1") {
    return (
      <div className={styles.arrayGridContainer}>
        {arrayData.map((elem, index) => (
          <div key={index} className={styles.cell}>
            <div>Index: {index}</div>
            <input
              value={elem === null ? "" : elem}
              onChange={(e) => onEditElement(index, e.target.value)}
              className={styles.cellInput}
            />
            <button
              onClick={() => onDeleteElement(index)}
              className={styles.deleteButton}
              title="Delete"
            >
              X
            </button>
          </div>
        ))}
      </div>
    );
  } else if (dimension === "2") {
    return (
      <table className={styles.table}>
        <tbody>
          {arrayData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((elem, colIndex) => (
                <td key={colIndex} className={styles.tableCell}>
                  <div>
                    Index: [{rowIndex},{colIndex}]
                  </div>
                  <input
                    value={elem === null ? "" : elem}
                    onChange={(e) =>
                      onEditElement([rowIndex, colIndex], e.target.value)
                    }
                    className={styles.tableInput}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else {
    return null;
  }
};

export default ArrayGrid;
