import React, { useState } from 'react';
import LoopSelector from './LoopSelector';
import LoopControls from './LoopControls';
import LoopExecutor from './LoopExecutor';
import MemoryGrid from './MemoryGrid';
import PipelineViewer from './PipelineViewer';
import styles from './LoopSimulator.module.css';

function LoopSimulator() {
  const [loopType, setLoopType] = useState('for');
  const [counterName, setCounterName] = useState('i');
  const [startValue, setStartValue] = useState(0);
  const [endValue, setEndValue] = useState(10);
  const [stepValue, setStepValue] = useState(1);
  const [controlFlow, setControlFlow] = useState('none');
  const [controlFlowIteration, setControlFlowIteration] = useState('');
  const [log, setLog] = useState([]);
  const [currentCounter, setCurrentCounter] = useState(0);
  const [pipelineStage, setPipelineStage] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  // Compute a high-level loop instruction string based on the loop type and parameters.
  let loopInstruction = '';
  if (loopType === 'for') {
    loopInstruction = `for (${counterName} = ${startValue}; ${counterName} <= ${endValue}; ${counterName} += ${stepValue})`;
  } else if (loopType === 'while') {
    loopInstruction = `while (${counterName} <= ${endValue}) { ... }`;
  } else if (loopType === 'do-while') {
    loopInstruction = `do { ... } while (${counterName} <= ${endValue});`;
  } else if (loopType === 'for-each') {
    loopInstruction = `for (let item of array) { ... }`;
  }

  const handleExecutionComplete = () => {
    setIsExecuting(false);
  };

  return (
    <div className={styles.loopSimulator}>
      <h2>Loop Simulator</h2>
      <div className={styles.config}>
        <LoopSelector loopType={loopType} setLoopType={setLoopType} />
        <LoopControls
          counterName={counterName}
          setCounterName={setCounterName}
          startValue={startValue}
          setStartValue={setStartValue}
          endValue={endValue}
          setEndValue={setEndValue}
          stepValue={stepValue}
          setStepValue={setStepValue}
          controlFlow={controlFlow}
          setControlFlow={setControlFlow}
          controlFlowIteration={controlFlowIteration}
          setControlFlowIteration={setControlFlowIteration}
        />
        <LoopExecutor
          loopType={loopType}
          counterName={counterName}
          startValue={startValue}
          endValue={endValue}
          stepValue={stepValue}
          controlFlow={controlFlow}
          controlFlowIteration={controlFlowIteration}
          setLog={setLog}
          setCurrentCounter={setCurrentCounter}
          setPipelineStage={setPipelineStage}
          onComplete={handleExecutionComplete}
        />
      </div>

      <div className={styles.simulationOutput}>
        <h3>Simulation Log:</h3>
        <div className={styles.logContainer}>
          {log.map((entry, idx) => (
            <div key={idx}>{entry}</div>
          ))}
        </div>
      </div>

      <MemoryGrid counter={currentCounter} />
      <PipelineViewer stage={pipelineStage} instruction={loopInstruction} />
    </div>
  );
}

export default LoopSimulator;
