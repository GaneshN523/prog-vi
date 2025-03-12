import React from "react";
import styles from "./instructionpanel.module.css";

const InstructionPanel = ({
  registers,
  stackPointer,
  heapPointer,
  pipelineStage,
  instructionRegister,
  aluOutput,
  currentProcess,
  instructionInput,
  setInstructionInput,
  handleLoadInstructions,
  executeNextInstruction,
  runAllInstructions,
  stopExecution,
  programCounter,
}) => {
  return (
    <>
    <div className={styles.instructionPanelContainer}>
      {/* Registers & Pointers Display */}
      <div className={styles.registersGrid}>
        {Object.entries(registers).map(([reg, value]) => (
          <div key={reg} className={styles.registerBox}>
            <p>{reg}</p>
            <p>{value}</p>
          </div>
        ))}
        <div className={styles.registerBox}>
          <p>SP</p>
          <p>{stackPointer}</p>
        </div>
        <div className={styles.registerBox}>
          <p>HP</p>
          <p>{heapPointer}</p>
        </div>
      </div>



      {/* Instruction Input Area */}
      <div className={styles.instructionArea}>
        <textarea
          value={instructionInput}
          onChange={(e) => setInstructionInput(e.target.value)}
          placeholder={`Enter instructions (one per line). They will be stored in memory addresses 0–15.
Example:
MOV R1 00000010
ALLOC R2 4
STORE 8 R1
PUSH R1
CALL 5
RET
CMP R1 R2
JE 10
JNE 12
AND R1 R2
FOR R1 3
ENDFOR`}
        />
        <button className={styles.button} onClick={handleLoadInstructions}>
          Load Instructions
        </button>
      </div>

      {/* Control Buttons */}
      <div className={styles.controls}>
        <button className={styles.button} onClick={executeNextInstruction}>
          Execute Next Instruction
        </button>
        <button
          className={`${styles.button} ${styles.buttonBlue600}`}
          onClick={runAllInstructions}
        >
          Run All Instructions
        </button>
        <button
          className={`${styles.button} ${styles.buttonRed}`}
          onClick={stopExecution}
        >
          Stop Execution
        </button>
      </div>
      <p className={styles.programCounter}>
        Program Counter: {programCounter}
      </p>
    </div>
    <div className={styles.rightsidebar}>
          {/* Pipeline & ALU Visualization */}
          <div className={styles.pipeline}>
          <h2>Instruction Pipeline</h2>
          <p>
            <strong>Current Stage:</strong> {pipelineStage}
          </p>
          <p>
            <strong>Instruction Register (IR):</strong>{" "}
            {instructionRegister || "N/A"}
          </p>
          <p>
            <strong>ALU Output:</strong> {aluOutput || "N/A"}
          </p>
        </div>
  
        {/* Multi-Process Placeholder */}
        <div className={styles.processInfo}>
          <h2>Process Info</h2>
          <p>
            <strong>Current Process:</strong> {currentProcess}
          </p>
        </div>
        </div>

        </>
  );
};

export default InstructionPanel;
