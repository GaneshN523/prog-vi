import React, { useState, useRef } from 'react';
import VariableCreator from './VariableCreator';
import ExpressionBuilder from './ExpressionBuilder';
import MemoryGrid from './MemoryGrid';
import ProcessVisualization from './ProcessVisualization';
import VariablesTable from './VariablesTable';
import styles from './AExpressionVisualizer.module.css';

const AExpressionVisualizer = () => {
  const totalMemoryCells = 64;
  const [memory, setMemory] = useState(Array(totalMemoryCells).fill('00000000'));
  const [variables, setVariables] = useState([]); // Each variable: { name, type, value, memoryAddress, size, binary }
  const [processSteps, setProcessSteps] = useState([]);
  const [expression, setExpression] = useState('');
  const [finalResult, setFinalResult] = useState(null);
  const [nextFreeAddress, setNextFreeAddress] = useState(0);

  // Our sandbox holds variable values during evaluation.
  const sandboxRef = useRef({});

  // This function adds or updates a variable in the state, memory, and sandbox.
  const addOrUpdateVariable = (varName, varType, varValue) => {
    const sandbox = sandboxRef.current;
    sandbox[varName] = varValue; // update sandbox

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
        // Update memory for existing variable.
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
      const boolVal = (varValue === 'true' || varValue === true);
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

  // Called when a variable is created via the VariableCreator.
  const handleAddVariable = ({ name, type, value }) => {
    addOrUpdateVariable(name, type, value);
  };

  // Array of operators for binary conversion in the fetch phase.
  const operatorSet = ['=','+', '-', '*', '/', '%', '==', '!=', '>', '<', '>=', '<=', '&&', '||', '=', '**'];

  // Evaluate the expression built from the ExpressionBuilder.
  // This version is dynamic and flexible. It simulates the fetch–decode–execute pipeline,
  // showing how each token is converted to raw binary (where applicable) and how the state changes.
  const evaluateExpression = (expr) => {
    setExpression(expr);
    const sandbox = sandboxRef.current;
    // Capture state before evaluation.
    const stateBefore = { ...sandbox };
    let steps = [];
    steps.push({
      description: "State Before Evaluation",
      sandboxSnapshot: stateBefore,
    });

    // Tokenize the expression (split by whitespace).
    const tokens = expr.trim().split(/\s+/);

    // FETCH: Convert each token to its raw binary representation.
    const tokenBinarySteps = tokens.map(token => {
      // If the token is a numeric literal.
      if (!isNaN(token)) {
        const num = Number(token);
        return { token, binary: (num >>> 0).toString(2).padStart(32, '0') };
      }
      // If the token is a string literal.
      else if (
        (token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'"))
      ) {
        const content = token.slice(1, -1);
        const binaryArr = content.split('').map(ch => ch.charCodeAt(0).toString(2).padStart(8, '0'));
        return { token, binary: binaryArr.join(' ') };
      }
      // If the token is an operator.
      else if (operatorSet.includes(token)) {
        const binaryArr = token.split('').map(ch => ch.charCodeAt(0).toString(2).padStart(8, '0'));
        return { token, binary: binaryArr.join(' ') };
      }
      // If the token is a parenthesis.
      else if (token === '(' || token === ')') {
        return { token, binary: token.charCodeAt(0).toString(2).padStart(8, '0') };
      }
      // Otherwise, assume it’s a variable name.
      else {
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
      description: "FETCH: Token Conversion to Raw Binary",
      tokensBinary: tokenBinarySteps,
    });

    // DECODE: In this simple simulation we just log the tokens.
    steps.push({
      description: "DECODE: Interpreted Tokens",
      decodedTokens: tokens,
    });

    // EXECUTE: Try to execute the expression in the sandbox.
    try {
      const code = `with(sandbox) { ${expr} }`;
      const result = new Function('sandbox', code)(sandbox);
      steps.push({
        description: `EXECUTE: Successfully executed expression: ${expr}`,
        sandboxSnapshot: { ...sandbox },
      });
      setFinalResult(result);
    } catch (error) {
      steps.push({
        description: `EXECUTE ERROR: ${error.message}. Please revise your expression.`,
        sandboxSnapshot: { ...sandbox },
      });
      setFinalResult(null);
    }

    // Capture state after evaluation.
    const stateAfter = { ...sandbox };
    steps.push({
      description: "State After Evaluation",
      sandboxSnapshot: stateAfter,
    });

    setProcessSteps(steps);

    // Update variables based on the sandbox.
    for (let varName in sandbox) {
      const existing = variables.find((v) => v.name === varName);
      if (existing) {
        addOrUpdateVariable(varName, existing.type, sandbox[varName]);
      } else {
        // If a new variable is created via the expression, infer its type.
        const inferredType = typeof sandbox[varName] === 'number'
          ? 'number'
          : (typeof sandbox[varName] === 'boolean' ? 'boolean' : 'string');
        addOrUpdateVariable(varName, inferredType, sandbox[varName]);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Expression Visualizer</h1>

      {/* Section to predefine variables */}
      <div className={styles.predefineSection}>
        <h2>Predefine Variables</h2>
        <VariableCreator onAddVariable={handleAddVariable} />
      </div>

      {/* Section to build an expression */}
      <div className={styles.builderSection}>
        <h2>Build Expression</h2>
        <ExpressionBuilder variables={variables} onEvaluateExpression={evaluateExpression} />
      </div>

      <VariablesTable variables={variables} />
      <MemoryGrid memory={memory} totalCells={totalMemoryCells} />
      <ProcessVisualization
        steps={processSteps}
        expression={expression}
        finalResult={finalResult}
      />
    </div>
  );
};

export default AExpressionVisualizer;
