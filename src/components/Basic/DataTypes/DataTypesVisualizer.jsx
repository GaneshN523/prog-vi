import { useState } from 'react';
import styles from './DataTypesVisualizer.module.css';
import MemoryGrid from './MemoryGrid';
import VariableForm from './VariableForm';
import VariableList from './VariableList';

// Utility functions for binary conversion
const intToBinary = (num, bits = 32) => num.toString(2).padStart(bits, '0');

const floatToBinary = (num) => {
  const [integerPart, fractionalPart] = num.toString().split('.');
  let intBinary = parseInt(integerPart, 10).toString(2);
  let fracBinary = '';
  
  if (fractionalPart) {
    let frac = parseFloat('0.' + fractionalPart);
    for (let i = 0; i < 8; i++) {
      frac *= 2;
      const bit = Math.floor(frac);
      fracBinary += bit.toString();
      frac -= bit;
    }
  }
  return (intBinary + fracBinary).padStart(32, '0');
};

const charToBinary = (char) => char.charCodeAt(0).toString(2).padStart(8, '0');

const boolToBinary = (bool) => bool ? '00000001' : '00000000';

const stringToBinaryArray = (str) => str.split('').map(char => charToBinary(char));

const DataTypesVisualizer = () => {
  const totalMemoryCells = 64; // total memory cells (each 8-bit)
  const [memory, setMemory] = useState(Array(totalMemoryCells).fill('00000000'));
  const [variables, setVariables] = useState([]);
  const [nextFreeAddress, setNextFreeAddress] = useState(0);

  // Function to add a new variable and allocate memory
  const addVariable = ({ name, type, value }) => {
    let binaryValues = [];
    let size = 0;

    switch (type) {
      case 'integer':
        size = 4;
        const intVal = parseInt(value, 10);
        const intBin = intToBinary(intVal, 32);
        for (let i = 0; i < 4; i++) {
          binaryValues.push(intBin.slice(i * 8, i * 8 + 8));
        }
        break;

      case 'float':
        size = 4;
        const floatVal = parseFloat(value);
        const floatBin = floatToBinary(floatVal);
        for (let i = 0; i < 4; i++) {
          binaryValues.push(floatBin.slice(i * 8, i * 8 + 8));
        }
        break;

      case 'char':
        size = 1;
        binaryValues = [charToBinary(value)];
        break;

      case 'boolean':
        size = 1;
        const boolVal = value.toLowerCase() === 'true';
        binaryValues = [boolToBinary(boolVal)];
        break;

      case 'string':
        size = value.length;
        binaryValues = stringToBinaryArray(value);
        break;

      default:
        alert('Unsupported type');
        return;
    }

    if (nextFreeAddress + size > totalMemoryCells) {
      alert('Not enough memory to allocate this variable.');
      return;
    }

    // Allocate memory cells with the binary values
    const newMemory = [...memory];
    for (let i = 0; i < size; i++) {
      newMemory[nextFreeAddress + i] = binaryValues[i];
    }
    setMemory(newMemory);

    // Create a variable object with details
    const newVariable = {
      name,
      type,
      value,
      startAddress: nextFreeAddress,
      size,
      binaryValues,
    };
    setVariables([...variables, newVariable]);

    // Update the pointer to the next free memory cell
    setNextFreeAddress(nextFreeAddress + size);
  };

  // Function to delete a variable
  const deleteVariable = (variableName) => {
    const updatedVariables = variables.filter(variable => variable.name !== variableName);
    setVariables(updatedVariables);

    // Also clear memory associated with the deleted variable
    const variableToDelete = variables.find(variable => variable.name === variableName);
    if (variableToDelete) {
      const updatedMemory = [...memory];
      for (let i = variableToDelete.startAddress; i < variableToDelete.startAddress + variableToDelete.size; i++) {
        updatedMemory[i] = '00000000'; // Clear memory cells
      }
      setMemory(updatedMemory);
    }
  };

  // Function to edit a variable's value
  const editVariable = (variableName, newValue) => {
    const updatedVariables = variables.map(variable =>
      variable.name === variableName ? { ...variable, value: newValue } : variable
    );
    setVariables(updatedVariables);

    // Update the memory for the edited variable
    const updatedMemory = [...memory];
    const variableToEdit = variables.find(variable => variable.name === variableName);
    if (variableToEdit) {
      let binaryValues = [];
      switch (variableToEdit.type) {
        case 'integer':
          const intVal = parseInt(newValue, 10);
          const intBin = intToBinary(intVal, 32);
          for (let i = 0; i < 4; i++) {
            binaryValues.push(intBin.slice(i * 8, i * 8 + 8));
          }
          break;

        case 'float':
          const floatVal = parseFloat(newValue);
          const floatBin = floatToBinary(floatVal);
          for (let i = 0; i < 4; i++) {
            binaryValues.push(floatBin.slice(i * 8, i * 8 + 8));
          }
          break;

        case 'char':
          binaryValues = [charToBinary(newValue)];
          break;

        case 'boolean':
          const boolVal = newValue.toLowerCase() === 'true';
          binaryValues = [boolToBinary(boolVal)];
          break;

        case 'string':
          binaryValues = stringToBinaryArray(newValue);
          break;

        default:
          return;
      }

      for (let i = 0; i < binaryValues.length; i++) {
        updatedMemory[variableToEdit.startAddress + i] = binaryValues[i];
      }
      setMemory(updatedMemory);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Data Types & Memory Visualization</h1>
      <VariableForm onAddVariable={addVariable} />
      <MemoryGrid memory={memory} totalCells={totalMemoryCells} />
      <VariableList
        variables={variables}
        onVariableDelete={deleteVariable}
        onVariableEdit={editVariable}
        onHighlightMemory={() => {}} // Empty function, can be implemented further if needed
      />
    </div>
  );
};

export default DataTypesVisualizer;
