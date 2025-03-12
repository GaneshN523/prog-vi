import React, { useState, useRef } from 'react';
import VariableCreator from './VariableCreator';
import ConditionalBuilder from './ConditionalBuilder';
import MemoryGrid from './MemoryGrid';
import ProcessVisualization from './ProcessVisualization';
import VariablesTable from './VariablesTable';
import styles from './ConditionalVisualizer.module.css';

const ConditionalVisualizer = () => {
  const totalMemoryCells = 64;
  const [memory, setMemory] = useState(Array(totalMemoryCells).fill('00000000'));
  // Each variable: { name, type, value, memoryAddress, size, binary }
  const [variables, setVariables] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [conditionalCode, setConditionalCode] = useState('');
  const [finalResult, setFinalResult] = useState(null);
  const [nextFreeAddress, setNextFreeAddress] = useState(0);

  // The sandbox holds our variables during execution.
  const sandboxRef = useRef({});

  // This function predefines a variable by updating the sandbox, memory, and variables table.
  const addOrUpdateVariable = (varName, varType, varValue) => {
    const sandbox = sandboxRef.current;
    sandbox[varName] =
      varType === 'number'
        ? Number(varValue)
        : varType === 'boolean'
        ? varValue === 'true' || varValue === true
        : varValue;

    const existingVar = variables.find((v) => v.name === varName);
    let newVariables = [...variables];
    let updatedVar;

    if (varType === 'number') {
      const numericValue = Number(varValue);
      if (isNaN(numericValue)) {
        alert(`Invalid number value for variable ${varName}`);
        return;
      }
      const binary = (numericValue >>> 0).toString(2).padStart(32, '0');
      const size = 4;
      if (existingVar) {
        const newMemory = [...memory];
        for (let i = 0; i < size; i++) {
          newMemory[existingVar.memoryAddress + i] = binary.slice(i * 8, i * 8 + 8);
        }
        setMemory(newMemory);
        updatedVar = { ...existingVar, value: numericValue, binary, size };
        newVariables = newVariables.map((v) => (v.name === varName ? updatedVar : v));
      } else {
        if (nextFreeAddress + size > totalMemoryCells) {
          alert(`Not enough memory for variable ${varName}`);
          return;
        }
        const newMemory = [...memory];
        for (let i = 0; i < size; i++) {
          newMemory[nextFreeAddress + i] = binary.slice(i * 8, i * 8 + 8);
        }
        setMemory(newMemory);
        updatedVar = { name: varName, type: varType, value: numericValue, memoryAddress: nextFreeAddress, size, binary };
        newVariables.push(updatedVar);
        setNextFreeAddress(nextFreeAddress + size);
      }
    } else if (varType === 'string') {
      const strVal = varValue;
      const size = strVal.length;
      if (existingVar) {
        const newMemory = [...memory];
        let binaryArr = [];
        for (let i = 0; i < strVal.length; i++) {
          const bin = strVal.charCodeAt(i).toString(2).padStart(8, '0');
          newMemory[existingVar.memoryAddress + i] = bin;
          binaryArr.push(bin);
        }
        setMemory(newMemory);
        updatedVar = { ...existingVar, value: strVal, binary: binaryArr.join(' '), size };
        newVariables = newVariables.map((v) => (v.name === varName ? updatedVar : v));
      } else {
        if (nextFreeAddress + size > totalMemoryCells) {
          alert(`Not enough memory for variable ${varName}`);
          return;
        }
        const newMemory = [...memory];
        let binaryArr = [];
        for (let i = 0; i < strVal.length; i++) {
          const bin = strVal.charCodeAt(i).toString(2).padStart(8, '0');
          newMemory[nextFreeAddress + i] = bin;
          binaryArr.push(bin);
        }
        setMemory(newMemory);
        updatedVar = { name: varName, type: varType, value: strVal, memoryAddress: nextFreeAddress, size, binary: binaryArr.join(' ') };
        newVariables.push(updatedVar);
        setNextFreeAddress(nextFreeAddress + size);
      }
    } else if (varType === 'boolean') {
      const boolVal = varValue === 'true' || varValue === true;
      const numericValue = boolVal ? 1 : 0;
      const binary = (numericValue >>> 0).toString(2).padStart(8, '0');
      const size = 1;
      if (existingVar) {
        const newMemory = [...memory];
        newMemory[existingVar.memoryAddress] = binary;
        setMemory(newMemory);
        updatedVar = { ...existingVar, value: boolVal, binary, size };
        newVariables = newVariables.map((v) => (v.name === varName ? updatedVar : v));
      } else {
        if (nextFreeAddress + size > totalMemoryCells) {
          alert(`Not enough memory for variable ${varName}`);
          return;
        }
        const newMemory = [...memory];
        newMemory[nextFreeAddress] = binary;
        setMemory(newMemory);
        updatedVar = { name: varName, type: varType, value: boolVal, memoryAddress: nextFreeAddress, size, binary };
        newVariables.push(updatedVar);
        setNextFreeAddress(nextFreeAddress + size);
      }
    }
    setVariables(newVariables);
  };

  // Called by VariableCreator.
  const handleAddVariable = ({ name, type, value }) => {
    addOrUpdateVariable(name, type, value);
  };

  // An operator set used during the FETCH phase.
  const operatorSet = ['+', '-', '*', '/', '%', '==', '!=', '>', '<', '>=', '<=', '&&', '||', '=', '?', ':'];

  // Evaluate the conditional statement built by the ConditionalBuilder.
  // This simulates the fetch–decode–execute pipeline:
  // • It tokenizes the conditional code, converts tokens to raw binary (where applicable),
  // • Then decodes the tokens,
  // • Executes the conditional statement in a sandbox,
  // • And finally shows the state before and after execution.
  const evaluateConditional = (codeStr) => {
    setConditionalCode(codeStr);
    const sandbox = sandboxRef.current;
    const stateBefore = { ...sandbox };

    let steps = [];
    steps.push({
      description: "State Before Evaluation",
      sandboxSnapshot: stateBefore,
    });

    // TOKENIZE: Split the code into tokens (by whitespace)
    const tokens = codeStr.trim().split(/\s+/);

    // FETCH: Convert tokens into raw binary where possible.
    const tokensBinary = tokens.map(token => {
      if (!isNaN(token)) {
        const num = Number(token);
        return { token, binary: (num >>> 0).toString(2).padStart(32, '0') };
      } else if (
        (token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'"))
      ) {
        const content = token.slice(1, -1);
        const binaryArr = content.split('').map(ch => ch.charCodeAt(0).toString(2).padStart(8, '0'));
        return { token, binary: binaryArr.join(' ') };
      } else if (operatorSet.includes(token) || token === '(' || token === ')') {
        const binaryArr = token.split('').map(ch => ch.charCodeAt(0).toString(2).padStart(8, '0'));
        return { token, binary: binaryArr.join(' ') };
      } else {
        // Assume variable name; if defined, show its binary.
        if (sandbox[token] !== undefined) {
          let value = sandbox[token];
          if (typeof value === 'number') {
            return { token, binary: (value >>> 0).toString(2).padStart(32, '0') };
          } else if (typeof value === 'string') {
            const binaryArr = value.split('').map(ch => ch.charCodeAt(0).toString(2).padStart(8, '0'));
            return { token, binary: binaryArr.join(' ') };
          } else if (typeof value === 'boolean') {
            return { token, binary: ((value ? 1 : 0) >>> 0).toString(2).padStart(8, '0') };
          } else {
            return { token, binary: "N/A" };
          }
        } else {
          return { token, binary: "N/A" };
        }
      }
    });

    steps.push({
      description: "FETCH: Tokens Converted to Raw Binary",
      tokensBinary,
    });

    // DECODE: Simply log the tokens.
    steps.push({
      description: "DECODE: Interpreted Tokens",
      decodedTokens: tokens,
    });

    // EXECUTE: Run the conditional code in the sandbox.
    try {
      // We use a with-block so that any variable references are taken from the sandbox.
      const execCode = `with(sandbox) { ${codeStr} }`;
      const result = new Function('sandbox', execCode)(sandbox);
      steps.push({
        description: `EXECUTE: Successfully executed the conditional statement.`,
        sandboxSnapshot: { ...sandbox },
      });
      setFinalResult(result);
    } catch (error) {
      steps.push({
        description: `EXECUTE ERROR: ${error.message}. Please revise your conditional statement.`,
        sandboxSnapshot: { ...sandbox },
      });
      setFinalResult(null);
    }

    const stateAfter = { ...sandbox };
    steps.push({
      description: "State After Evaluation",
      sandboxSnapshot: stateAfter,
    });

    setProcessSteps(steps);

    // Update the variables table based on the sandbox.
    for (let varName in sandbox) {
      const existing = variables.find((v) => v.name === varName);
      if (existing) {
        addOrUpdateVariable(varName, existing.type, sandbox[varName]);
      } else {
        // If a new variable is created via the conditional, infer its type.
        const inferredType = typeof sandbox[varName] === 'number'
          ? 'number'
          : (typeof sandbox[varName] === 'boolean' ? 'boolean' : 'string');
        addOrUpdateVariable(varName, inferredType, sandbox[varName]);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Conditional Statement Visualizer</h1>

      {/* Predefine variables (optional) */}
      <div className={styles.predefineSection}>
        <h2>Predefine Variables</h2>
        <VariableCreator onAddVariable={handleAddVariable} />
      </div>

      {/* Build a conditional statement */}
      <div className={styles.builderSection}>
        <h2>Build Conditional Statement</h2>
        <ConditionalBuilder variables={variables} onEvaluateConditional={evaluateConditional} />
      </div>

      <VariablesTable variables={variables} />
      <MemoryGrid memory={memory} totalCells={totalMemoryCells} />
      <ProcessVisualization
        steps={processSteps}
        expression={conditionalCode}
        finalResult={finalResult}
      />
    </div>
  );
};

export default ConditionalVisualizer;
