import React from 'react';
import styles from './LoopControls.module.css';

function LoopControls({
  counterName,
  setCounterName,
  startValue,
  setStartValue,
  endValue,
  setEndValue,
  stepValue,
  setStepValue,
  controlFlow,
  setControlFlow,
  controlFlowIteration,
  setControlFlowIteration,
}) {
  return (
    <>
      <label className={styles.controlLabel}>
        <strong>Counter Variable Name:</strong>
        <input
          type="text"
          value={counterName}
          onChange={(e) => setCounterName(e.target.value)}
          className={styles.inputField}
        />
      </label>
      <label className={styles.controlLabel}>
        <strong>Start Value:</strong>
        <input
          type="number"
          value={startValue}
          onChange={(e) => setStartValue(e.target.value)}
          className={styles.inputField}
        />
      </label>
      <label className={styles.controlLabel}>
        <strong>End Value:</strong>
        <input
          type="number"
          value={endValue}
          onChange={(e) => setEndValue(e.target.value)}
          className={styles.inputField}
        />
      </label>
      <label className={styles.controlLabel}>
        <strong>Step Value:</strong>
        <input
          type="number"
          value={stepValue}
          onChange={(e) => setStepValue(e.target.value)}
          className={styles.inputField}
        />
      </label>
      <label className={styles.controlLabel}>
        <strong>Control Flow:</strong>
        <select
          value={controlFlow}
          onChange={(e) => setControlFlow(e.target.value)}
          className={styles.inputField}
        >
          <option value="none">None</option>
          <option value="break">Break</option>
          <option value="continue">Continue</option>
        </select>
      </label>
      {controlFlow !== 'none' && (
        <label className={styles.controlLabel}>
          <strong>{controlFlow} at Iteration:</strong>
          <input
            type="number"
            value={controlFlowIteration}
            onChange={(e) => setControlFlowIteration(e.target.value)}
            className={styles.inputField}
          />
        </label>
      )}
    </>
  );
}

export default LoopControls;
