import React from 'react';
import styles from './ProcessVisualization.module.css';

const ProcessVisualization = ({ steps, expression, finalResult }) => {
  return (
    <div className={styles.processContainer}>
      <h2 className={styles.subHeader}>Expression Evaluation Process</h2>
      {expression && (
        <div className={styles.expressionSection}>
          <p><strong>Expression:</strong></p>
          <pre>{expression}</pre>
        </div>
      )}
      <ul className={styles.stepsList}>
        {steps.map((step, index) => (
          <li key={index} className={styles.step}>
            <p>{step.description}</p>
            {step.tokensBinary && (
              <div>
                <p><em>Tokens with Binary Conversion:</em></p>
                <pre>{JSON.stringify(step.tokensBinary, null, 2)}</pre>
              </div>
            )}
            {step.decodedTokens && (
              <div>
                <p><em>Decoded Tokens:</em></p>
                <pre>{JSON.stringify(step.decodedTokens, null, 2)}</pre>
              </div>
            )}
            {step.sandboxSnapshot && (
              <div>
                <p><em>Sandbox Snapshot:</em></p>
                <pre>{JSON.stringify(step.sandboxSnapshot, null, 2)}</pre>
              </div>
            )}
          </li>
        ))}
      </ul>
      {finalResult !== null && (
        <div className={styles.finalResult}>
          <h3>Final Result: {String(finalResult)}</h3>
        </div>
      )}
    </div>
  );
};

export default ProcessVisualization;
