import React, { useState } from 'react';
import styles from './StackVisualizer.module.css';

// Helper function to simulate a memory address.
const generateAddress = (id) => `0x${id.toString(16)}`;

// List of all available stack types.
const stackTypes = [
  "Array-Based Stack",
  "Linked List-Based Stack",
  "Doubly Linked List Stack",
  "Dynamic Stack",
  "Limited Size Stack",
  "Persistent Stack",
  "Circular Stack",
  "Double-Ended Stack (Deque-Based Stack)",
  "Min Stack",
  "Max Stack",
  "Two-Stack Queue",
  "Stack with Auxiliary Stack",
  "Multi-Stack (K Stacks in One Array)",
  "Thread-Safe Stack",
  "Monotonic Stack",
  "Expression Stack",
  "Call Stack"
];

const dataTypes = ["String", "Number", "Boolean"];

const StackVisualizer = () => {
  // State to hold all created stacks.
  const [stacks, setStacks] = useState([]);
  // Currently selected stack.
  const [selectedStack, setSelectedStack] = useState(null);
  // For creating a new stack.
  const [newStackName, setNewStackName] = useState('');
  const [selectedStackType, setSelectedStackType] = useState(stackTypes[0]);
  const [selectedDataType, setSelectedDataType] = useState(dataTypes[0]);
  // For element operations.
  const [newElementValue, setNewElementValue] = useState('');
  // Operation log for step-by-step tracking.
  const [operationLog, setOperationLog] = useState([]);

  // Log operations so users can follow the steps.
  const logOperation = (message) => {
    setOperationLog(prev => [...prev, message]);
  };

  // Create a new stack.
  const createStack = (name, type, dataType) => {
    const newStack = {
      name,
      type,
      dataType,
      elements: [] // The stack elements are stored here.
    };
    setStacks([...stacks, newStack]);
    logOperation(`Created new ${type} with data type ${dataType} named "${name}"`);
  };

  // Delete an existing stack.
  const deleteStack = (name) => {
    setStacks(stacks.filter(stack => stack.name !== name));
    if (selectedStack && selectedStack.name === name) {
      setSelectedStack(null);
    }
    logOperation(`Deleted stack "${name}"`);
  };

  // Helper to update a stack in both the selected state and the overall list.
  const updateSelectedStack = (updatedStack) => {
    setSelectedStack(updatedStack);
    setStacks(stacks.map(stack => stack.name === updatedStack.name ? updatedStack : stack));
  };

  // Create an element with a simulated binary representation.
  const createElement = (value) => {
    return {
      id: Date.now(),
      value,
      binary: (typeof value === 'string'
        ? value.split('').map(c => c.charCodeAt(0).toString(2)).join(' ')
        : parseInt(value).toString(2))
    };
  };

  // Primary Operations

  // Push: Adds an element to the top.
  const pushElement = (value) => {
    if (!selectedStack) return;
    // For a limited size stack, simulate a max capacity (e.g., 5).
    if (selectedStack.type === "Limited Size Stack" && selectedStack.elements.length >= 5) {
      alert("Stack is full!");
      logOperation(`Attempted to push on full stack "${selectedStack.name}"`);
      return;
    }
    const newElem = createElement(value);
    const updatedStack = { ...selectedStack, elements: [...selectedStack.elements, newElem] };
    updateSelectedStack(updatedStack);
    logOperation(`Pushed element "${value}" onto stack "${selectedStack.name}"`);
  };

  // Pop: Removes the top element.
  const popElement = () => {
    if (!selectedStack || selectedStack.elements.length === 0) return;
    const removedElem = selectedStack.elements[selectedStack.elements.length - 1];
    const updatedStack = { ...selectedStack, elements: selectedStack.elements.slice(0, -1) };
    updateSelectedStack(updatedStack);
    logOperation(`Popped element "${removedElem.value}" from stack "${selectedStack.name}"`);
  };

  // Peek: Retrieves the top element without removing it.
  const peekElement = () => {
    if (!selectedStack || selectedStack.elements.length === 0) return;
    const topElem = selectedStack.elements[selectedStack.elements.length - 1];
    logOperation(`Peeked at element "${topElem.value}" on stack "${selectedStack.name}"`);
    alert(`Top Element: ${topElem.value}`);
  };

  // Secondary and Helper Operations

  // Clear: Empties the stack.
  const clearStack = () => {
    if (!selectedStack) return;
    const updatedStack = { ...selectedStack, elements: [] };
    updateSelectedStack(updatedStack);
    logOperation(`Cleared stack "${selectedStack.name}"`);
  };

  // Clone: Creates a duplicate of the current stack.
  const cloneStack = () => {
    if (!selectedStack) return;
    const clonedStack = { ...selectedStack, name: `${selectedStack.name}_clone` };
    setStacks([...stacks, clonedStack]);
    logOperation(`Cloned stack "${selectedStack.name}" to "${clonedStack.name}"`);
  };

  // Reverse: Reverses the order of elements.
  const reverseStack = () => {
    if (!selectedStack) return;
    const updatedStack = { ...selectedStack, elements: [...selectedStack.elements].reverse() };
    updateSelectedStack(updatedStack);
    logOperation(`Reversed stack "${selectedStack.name}"`);
  };

  // Sort: Sorts the stack elements (numeric or lexicographic).
  const sortStack = () => {
    if (!selectedStack) return;
    const sortedElements = [...selectedStack.elements].sort((a, b) => {
      if (selectedStack.dataType === 'Number') {
        return parseFloat(a.value) - parseFloat(b.value);
      } else {
        return a.value.toString().localeCompare(b.value.toString());
      }
    });
    const updatedStack = { ...selectedStack, elements: sortedElements };
    updateSelectedStack(updatedStack);
    logOperation(`Sorted stack "${selectedStack.name}"`);
  };

  // PrintStack: Displays the stack elements.
  const printStack = () => {
    if (!selectedStack) return;
    const stackString = selectedStack.elements.map(elem => elem.value).join(', ');
    logOperation(`Printed stack "${selectedStack.name}": ${stackString}`);
    alert(`Stack: ${stackString}`);
  };

  // Special Operations

  // Merge: Merges another stack into the current one.
  const mergeStacks = () => {
    if (!selectedStack) return;
    const otherStackName = prompt("Enter the name of the stack to merge with:");
    if (!otherStackName) return;
    const otherStack = stacks.find(s => s.name === otherStackName);
    if (!otherStack) {
      alert("Stack not found!");
      return;
    }
    const mergedElements = [...selectedStack.elements, ...otherStack.elements];
    const updatedStack = { ...selectedStack, elements: mergedElements };
    updateSelectedStack(updatedStack);
    logOperation(`Merged stack "${otherStack.name}" into "${selectedStack.name}"`);
  };

  // Convert Stack to Queue (Simulation).
  const convertToQueue = () => {
    if (!selectedStack) return;
    logOperation(`Converted stack "${selectedStack.name}" to a queue (simulation)`);
    alert('Stack converted to queue (simulation).');
  };

  // Balanced Parentheses Check (using a stack mechanism).
  const checkBalancedParentheses = () => {
    const expression = prompt("Enter an expression to check for balanced parentheses:");
    if (expression === null) return;
    const tempStack = [];
    let balanced = true;
    for (let char of expression) {
      if (char === '(') {
        tempStack.push(char);
      } else if (char === ')') {
        if (tempStack.length === 0) {
          balanced = false;
          break;
        }
        tempStack.pop();
      }
    }
    if (tempStack.length !== 0) balanced = false;
    logOperation(`Checked balanced parentheses for "${expression}": ${balanced ? 'Balanced' : 'Not Balanced'}`);
    alert(`Expression is ${balanced ? 'Balanced' : 'Not Balanced'}`);
  };

  // Helper to compute pointer information for visualization based on the stack type.
  // (For array-based stacks, the “pointer” simulates the element below the current one.)
  const getElementPointers = (index) => {
    if (!selectedStack) return {};
    const elements = selectedStack.elements;
    let pointers = {};
    // For array-based, dynamic, limited size, min, max stacks, use the previous element as pointer.
    if (
      selectedStack.type === 'Array-Based Stack' ||
      selectedStack.type === 'Dynamic Stack' ||
      selectedStack.type === 'Limited Size Stack' ||
      selectedStack.type === 'Min Stack' ||
      selectedStack.type === 'Max Stack'
    ) {
      pointers.next = index > 0 ? generateAddress(elements[index - 1].id) : 'null';
    }
    // For linked list–based, persistent, expression, and call stacks.
    if (
      selectedStack.type === 'Linked List-Based Stack' ||
      selectedStack.type === 'Persistent Stack' ||
      selectedStack.type === 'Expression Stack' ||
      selectedStack.type === 'Call Stack'
    ) {
      pointers.next = index > 0 ? generateAddress(elements[index - 1].id) : 'null';
    }
    // For doubly linked list stacks, simulate both next and previous pointers.
    if (selectedStack.type === 'Doubly Linked List Stack') {
      pointers.next = index > 0 ? generateAddress(elements[index - 1].id) : 'null';
      pointers.prev = index < elements.length - 1 ? generateAddress(elements[index + 1].id) : 'null';
    }
    // For circular stacks, the bottom element’s pointer loops back.
    if (selectedStack.type === 'Circular Stack') {
      if (index > 0) {
        pointers.next = generateAddress(elements[index - 1].id);
      } else if (elements.length > 0) {
        pointers.next = generateAddress(elements[elements.length - 1].id);
      } else {
        pointers.next = 'null';
      }
    }
    // For double-ended stacks, simulate both pointers.
    if (selectedStack.type === 'Double-Ended Stack (Deque-Based Stack)') {
      pointers.next = index > 0 ? generateAddress(elements[index - 1].id) : 'null';
      pointers.prev = index < elements.length - 1 ? generateAddress(elements[index + 1].id) : 'null';
    }
    return pointers;
  };

  return (
    <div className={styles.container}>
      <h1>Stack Visualizer</h1>
      <div className={styles.controls}>
        {/* Create a new stack */}
        <div className={styles.createStack}>
          <h2>Create Stack</h2>
          <input
            type="text"
            placeholder="Stack Name"
            value={newStackName}
            onChange={(e) => setNewStackName(e.target.value)}
          />
          <select
            value={selectedStackType}
            onChange={(e) => setSelectedStackType(e.target.value)}
          >
            {stackTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={selectedDataType}
            onChange={(e) => setSelectedDataType(e.target.value)}
          >
            {dataTypes.map((dt, idx) => (
              <option key={idx} value={dt}>
                {dt}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (newStackName.trim()) {
                createStack(newStackName.trim(), selectedStackType, selectedDataType);
                setNewStackName('');
              }
            }}
          >
            Create
          </button>
        </div>

        {/* List of created stacks */}
        <div className={styles.stackSelection}>
          <h2>Existing Stacks</h2>
          <table className={styles.stackTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Data Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stacks.map((stack) => (
                <tr key={stack.name}>
                  <td>{stack.name}</td>
                  <td>{stack.type}</td>
                  <td>{stack.dataType}</td>
                  <td>
                    <button onClick={() => setSelectedStack(stack)}>Select</button>
                    <button onClick={() => deleteStack(stack.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Operations panel for the selected stack */}
        {selectedStack && (
          <div className={styles.operations}>
            <h2>Operations on "{selectedStack.name}"</h2>
            <div className={styles.opControls}>
              <input
                type="text"
                placeholder="Element Value"
                value={newElementValue}
                onChange={(e) => setNewElementValue(e.target.value)}
              />
              <button
                onClick={() => {
                  if (newElementValue.trim()) {
                    pushElement(newElementValue.trim());
                    setNewElementValue('');
                  }
                }}
              >
                Push
                <br />
                <small>(O(1) time, O(1) space)</small>
              </button>
              <button onClick={popElement}>
                Pop
                <br />
                <small>(O(1) time)</small>
              </button>
              <button onClick={peekElement}>
                Peek
                <br />
                <small>(O(1) time)</small>
              </button>
              <button onClick={clearStack}>
                Clear
                <br />
                <small>(O(n) time)</small>
              </button>
              <button onClick={cloneStack}>
                Clone
                <br />
                <small>(O(n) time, O(n) space)</small>
              </button>
              <button onClick={reverseStack}>
                Reverse
                <br />
                <small>(O(n) time, O(1) space)</small>
              </button>
              <button onClick={sortStack}>
                Sort
                <br />
                <small>(O(n log n) or O(n²))</small>
              </button>
              <button onClick={printStack}>Print Stack</button>
              <button onClick={mergeStacks}>Merge Stacks</button>
              <button onClick={convertToQueue}>Convert to Queue</button>
              <button onClick={checkBalancedParentheses}>
                Check Balanced Parentheses
              </button>
            </div>

            {/* Complexity Information Panel */}
            <div className={styles.complexityInfo}>
              <h3>Operation Complexity</h3>
              <table>
                <thead>
                  <tr>
                    <th>Operation</th>
                    <th>Time Complexity</th>
                    <th>Space Complexity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Push</td>
                    <td>O(1)</td>
                    <td>O(1)</td>
                  </tr>
                  <tr>
                    <td>Pop</td>
                    <td>O(1)</td>
                    <td>O(1)</td>
                  </tr>
                  <tr>
                    <td>Peek</td>
                    <td>O(1)</td>
                    <td>O(1)</td>
                  </tr>
                  <tr>
                    <td>Clear</td>
                    <td>O(n)</td>
                    <td>O(1)</td>
                  </tr>
                  <tr>
                    <td>Clone</td>
                    <td>O(n)</td>
                    <td>O(n)</td>
                  </tr>
                  <tr>
                    <td>Reverse</td>
                    <td>O(n)</td>
                    <td>O(1)</td>
                  </tr>
                  <tr>
                    <td>Sort</td>
                    <td>O(n log n) or O(n²)</td>
                    <td>O(1)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Visualization Panel */}
            <div className={styles.visualization}>
              <h3>High-Level Representation (Top at the Top)</h3>
              <div className={styles.stackVisual}>
                {selectedStack.elements
                  .slice()
                  .reverse()
                  .map((element, idx) => {
                    // Calculate the actual index in the elements array.
                    const actualIndex = selectedStack.elements.length - 1 - idx;
                    const pointers = getElementPointers(actualIndex);
                    return (
                      <div key={element.id} className={styles.node}>
                        <div className={styles.nodeInfo}>
                          <span>
                            <strong>Data:</strong> {element.value}
                          </span>
                          {(selectedStack.type === 'Doubly Linked List Stack' ||
                            selectedStack.type === 'Double-Ended Stack (Deque-Based Stack)') ? (
                            <>
                              <span>
                                <strong>Prev:</strong> {pointers.prev}
                              </span>
                              <span>
                                <strong>Next:</strong> {pointers.next}
                              </span>
                            </>
                          ) : (
                            <span>
                              <strong>Next:</strong> {pointers.next}
                            </span>
                          )}
                        </div>
                        {idx !== selectedStack.elements.length - 1 && (
                          <span className={styles.pointer}>↓</span>
                        )}
                      </div>
                    );
                  })}
              </div>

              <h3>Low-Level Memory Grid</h3>
              <div className={styles.memoryGrid}>
                {selectedStack.elements.map((element, index) => {
                  const pointers = getElementPointers(index);
                  return (
                    <div key={element.id} className={styles.memoryCell}>
                      <div>
                        <strong>Address:</strong> {generateAddress(element.id)}
                      </div>
                      <div>
                        <strong>Data:</strong> {element.value}
                      </div>
                      <div>
                        <strong>Binary:</strong> {element.binary}
                      </div>
                      {(selectedStack.type === 'Doubly Linked List Stack' ||
                        selectedStack.type === 'Double-Ended Stack (Deque-Based Stack)') ? (
                        <>
                          <div>
                            <strong>Prev Pointer:</strong> {pointers.prev}
                          </div>
                          <div>
                            <strong>Next Pointer:</strong> {pointers.next}
                          </div>
                        </>
                      ) : (
                        <div>
                          <strong>Next Pointer:</strong> {pointers.next}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operation Log Panel */}
            <div className={styles.operationLog}>
              <h3>Operation Log (Step-by-Step)</h3>
              <ul>
                {operationLog.map((log, idx) => (
                  <li key={idx}>{log}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StackVisualizer;
