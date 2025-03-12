import React from 'react';
import styles from './LoopExecutor.module.css';

// Helper function for delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function LoopExecutor({
  loopType,
  counterName,
  startValue,
  endValue,
  stepValue,
  controlFlow,
  controlFlowIteration,
  setLog,
  setCurrentCounter,
  setPipelineStage,
  onComplete,
}) {
  // Simulate pipeline stages: Fetch → Decode → Execute
  const simulatePipeline = async (iteration, counter) => {
    setPipelineStage('Fetch');
    await delay(300);
    setPipelineStage('Decode');
    await delay(300);
    setPipelineStage('Execute');
    await delay(300);
    setPipelineStage(`Iteration ${iteration} executed`);
    await delay(300);
    setPipelineStage('');
  };

  // Executes the loop based on selected type.
  const execute = async () => {
    setLog([]);
    let counter;
    let iteration = 0;
    const sValue = Number(startValue);
    const eValue = Number(endValue);
    const stValue = Number(stepValue);

    // Condition helper for both incrementing and decrementing loops.
    const condition = (v) => (stValue > 0 ? v <= eValue : v >= eValue);

    if (loopType === 'for') {
      for (counter = sValue; condition(counter); counter += stValue) {
        iteration++;
        await simulatePipeline(iteration, counter);
        if (controlFlow !== 'none' && Number(controlFlowIteration) === iteration) {
          if (controlFlow === 'break') {
            setLog((prev) => [
              ...prev,
              `Iteration ${iteration}: break encountered. Exiting loop.`,
            ]);
            setPipelineStage('Break: Exiting loop');
            break;
          } else if (controlFlow === 'continue') {
            setLog((prev) => [
              ...prev,
              `Iteration ${iteration}: continue encountered. Skipping loop body.`,
            ]);
            continue;
          }
        }
        setLog((prev) => [
          ...prev,
          `Iteration ${iteration}: ${counterName} = ${counter}`,
        ]);
        setCurrentCounter(counter);
        await delay(1000);
      }
      if (!condition(counter)) {
        setLog((prev) => [
          ...prev,
          `Loop completed as condition became false.`,
        ]);
      }
    } else if (loopType === 'while') {
      counter = sValue;
      while (condition(counter)) {
        iteration++;
        await simulatePipeline(iteration, counter);
        if (controlFlow !== 'none' && Number(controlFlowIteration) === iteration) {
          if (controlFlow === 'break') {
            setLog((prev) => [
              ...prev,
              `Iteration ${iteration}: break encountered. Exiting loop.`,
            ]);
            setPipelineStage('Break: Exiting loop');
            break;
          } else if (controlFlow === 'continue') {
            setLog((prev) => [
              ...prev,
              `Iteration ${iteration}: continue encountered. Skipping loop body.`,
            ]);
            counter += stValue;
            continue;
          }
        }
        setLog((prev) => [
          ...prev,
          `Iteration ${iteration}: ${counterName} = ${counter}`,
        ]);
        setCurrentCounter(counter);
        await delay(1000);
        counter += stValue;
      }
      setLog((prev) => [
        ...prev,
        `Loop completed as condition became false.`,
      ]);
    } else if (loopType === 'do-while') {
      counter = sValue;
      do {
        iteration++;
        await simulatePipeline(iteration, counter);
        if (controlFlow !== 'none' && Number(controlFlowIteration) === iteration) {
          if (controlFlow === 'break') {
            setLog((prev) => [
              ...prev,
              `Iteration ${iteration}: break encountered. Exiting loop.`,
            ]);
            setPipelineStage('Break: Exiting loop');
            break;
          } else if (controlFlow === 'continue') {
            setLog((prev) => [
              ...prev,
              `Iteration ${iteration}: continue encountered. Skipping loop body.`,
            ]);
            counter += stValue;
            continue;
          }
        }
        setLog((prev) => [
          ...prev,
          `Iteration ${iteration}: ${counterName} = ${counter}`,
        ]);
        setCurrentCounter(counter);
        await delay(1000);
        counter += stValue;
      } while (condition(counter));
      setLog((prev) => [
        ...prev,
        `Loop completed as condition became false.`,
      ]);
    } else if (loopType === 'for-each') {
      const arr = [];
      for (let v = sValue; condition(v); v += stValue) {
        arr.push(v);
      }
      for (const item of arr) {
        iteration++;
        await simulatePipeline(iteration, item);
        if (controlFlow !== 'none' && Number(controlFlowIteration) === iteration) {
          if (controlFlow === 'break') {
            setLog((prev) => [
              ...prev,
              `Iteration ${iteration}: break encountered. Exiting loop.`,
            ]);
            setPipelineStage('Break: Exiting loop');
            break;
          } else if (controlFlow === 'continue') {
            setLog((prev) => [
              ...prev,
              `Iteration ${iteration}: continue encountered. Skipping loop body.`,
            ]);
            continue;
          }
        }
        setLog((prev) => [
          ...prev,
          `Iteration ${iteration}: ${counterName} = ${item}`,
        ]);
        setCurrentCounter(item);
        await delay(1000);
      }
      setLog((prev) => [
        ...prev,
        `Loop completed as all elements were processed.`,
      ]);
    }
    onComplete();
  };

  return (
    <button onClick={execute} className={styles.executeButton}>
      Execute Loop
    </button>
  );
}

export default LoopExecutor;
