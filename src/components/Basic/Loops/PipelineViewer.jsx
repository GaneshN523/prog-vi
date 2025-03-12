import React from 'react';
import styles from './PipelineViewer.module.css';

function PipelineViewer({ stage, instruction }) {
  // Tokenize the high-level instruction and convert tokens to 8-bit binary.
  const tokenizedInstruction = instruction ? instruction.split(' ') : [];
  const binaryRepresentation = tokenizedInstruction.map(token =>
    token
      .split('')
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ')
  );

  const getStageClass = (name) => {
    return stage === name
      ? `${styles.stage} ${styles.activeStage}`
      : styles.stage;
  };

  return (
    <div className={styles.pipeline}>
      <h3>Pipeline Simulation</h3>
      <div className={styles.header}>
        <strong>Current Stage:</strong> {stage || 'Idle'}
      </div>
      <div className={styles.stages}>
        <div className={getStageClass('Fetch')}>Fetch</div>
        <div className={getStageClass('Decode')}>Decode</div>
        <div className={getStageClass('Execute')}>Execute</div>
      </div>
      <div className={styles.tokenizer}>
        <h4>Token Breakdown</h4>
        {tokenizedInstruction.length > 0 ? (
          <ul className={styles.tokenList}>
            {tokenizedInstruction.map((token, index) => (
              <li key={index} className={styles.token}>
                {token}
              </li>
            ))}
          </ul>
        ) : (
          <p>No instruction provided.</p>
        )}
      </div>
      <div className={styles.binaryConversion}>
        <h4>Machine Code (Raw Bits)</h4>
        {binaryRepresentation.length > 0 ? (
          <ul className={styles.bitsList}>
            {binaryRepresentation.map((bits, index) => (
              <li key={index} className={styles.bits}>
                {bits}
              </li>
            ))}
          </ul>
        ) : (
          <p>No conversion available.</p>
        )}
      </div>
    </div>
  );
}

export default PipelineViewer;
