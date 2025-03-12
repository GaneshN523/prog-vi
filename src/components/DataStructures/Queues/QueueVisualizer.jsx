import React, { useState } from 'react';
import styles from './QueueVisualizer.module.css';

// Helper to generate a pseudo-memory address.
const generateAddress = (id) => `0x${id.toString(16)}`;

// List of available queue types.
const queueTypes = [
  "Array-Based Queue",
  "Linked List-Based Queue",
  "Doubly Linked List Queue",
  "Circular Queue",
  "Double-Ended Queue (Deque)",
  "Priority Queue",
  "Min Queue",
  "Max Queue",
  "Circular Buffer Queue",
  "Thread-Safe Queue",
  "Multi-Level Priority Queue",
  "Multi-Queue (K Queues in One Array)",
  "Monotonic Queue",
  "Expression Evaluation Queue",
  "Call Queue (Task Scheduling Queue)",
  "Undo/Redo Queue",
  "Job Queue",
  "Blocking Queue"
];

const dataTypes = ["String", "Number", "Boolean"];

const QueueVisualizer = () => {
  // State for created queues.
  const [queues, setQueues] = useState([]);
  // Currently selected queue.
  const [selectedQueue, setSelectedQueue] = useState(null);
  // For creating a new queue.
  const [newQueueName, setNewQueueName] = useState('');
  const [selectedQueueType, setSelectedQueueType] = useState(queueTypes[0]);
  const [selectedDataType, setSelectedDataType] = useState(dataTypes[0]);
  // For element operations.
  const [newElementValue, setNewElementValue] = useState('');
  // Operation log to show step-by-step actions.
  const [operationLog, setOperationLog] = useState([]);

  // Log operations.
  const logOperation = (message) => {
    setOperationLog(prev => [...prev, message]);
  };

  // Create a new queue.
  const createQueue = (name, type, dataType) => {
    const newQueue = {
      name,
      type,
      dataType,
      elements: [] // Elements stored in FIFO order.
    };
    setQueues([...queues, newQueue]);
    logOperation(`Created new ${type} with data type ${dataType} named "${name}"`);
  };

  // Delete a queue.
  const deleteQueue = (name) => {
    setQueues(queues.filter(queue => queue.name !== name));
    if (selectedQueue && selectedQueue.name === name) {
      setSelectedQueue(null);
    }
    logOperation(`Deleted queue "${name}"`);
  };

  // Helper to update selected queue.
  const updateSelectedQueue = (updatedQueue) => {
    setSelectedQueue(updatedQueue);
    setQueues(queues.map(queue => queue.name === updatedQueue.name ? updatedQueue : queue));
  };

  // Create a new element with binary representation.
  const createElement = (value) => {
    return {
      id: Date.now(),
      value,
      binary: (typeof value === 'string'
        ? value.split('').map(c => c.charCodeAt(0).toString(2)).join(' ')
        : parseInt(value).toString(2))
    };
  };

  // PRIMARY OPERATIONS

  // Enqueue: add an element at the rear.
  const enqueueElement = (value) => {
    if (!selectedQueue) return;
    // For fixed-size (Array-Based or Blocking Queue) simulate a max size.
    if ((selectedQueue.type === "Array-Based Queue" || selectedQueue.type === "Blocking Queue") && selectedQueue.elements.length >= 5) {
      alert("Queue is full!");
      logOperation(`Attempted to enqueue on full queue "${selectedQueue.name}"`);
      return;
    }
    const newElem = createElement(value);
    const updatedQueue = { ...selectedQueue, elements: [...selectedQueue.elements, newElem] };
    updateSelectedQueue(updatedQueue);
    logOperation(`Enqueued element "${value}" to queue "${selectedQueue.name}"`);
  };

  // Dequeue: remove element from the front.
  const dequeueElement = () => {
    if (!selectedQueue || selectedQueue.elements.length === 0) return;
    const removedElem = selectedQueue.elements[0];
    const updatedQueue = { ...selectedQueue, elements: selectedQueue.elements.slice(1) };
    updateSelectedQueue(updatedQueue);
    logOperation(`Dequeued element "${removedElem.value}" from queue "${selectedQueue.name}"`);
  };

  // Front: view the front element.
  const frontElement = () => {
    if (!selectedQueue || selectedQueue.elements.length === 0) return;
    const frontElem = selectedQueue.elements[0];
    logOperation(`Front element of queue "${selectedQueue.name}" is "${frontElem.value}"`);
    alert(`Front Element: ${frontElem.value}`);
  };

  // Rear: view the rear element.
  const rearElement = () => {
    if (!selectedQueue || selectedQueue.elements.length === 0) return;
    const rearElem = selectedQueue.elements[selectedQueue.elements.length - 1];
    logOperation(`Rear element of queue "${selectedQueue.name}" is "${rearElem.value}"`);
    alert(`Rear Element: ${rearElem.value}`);
  };

  // SECONDARY OPERATIONS

  // Clear the queue.
  const clearQueue = () => {
    if (!selectedQueue) return;
    const updatedQueue = { ...selectedQueue, elements: [] };
    updateSelectedQueue(updatedQueue);
    logOperation(`Cleared queue "${selectedQueue.name}"`);
  };

  // Clone the queue.
  const cloneQueue = () => {
    if (!selectedQueue) return;
    const clonedQueue = { ...selectedQueue, name: `${selectedQueue.name}_clone` };
    setQueues([...queues, clonedQueue]);
    logOperation(`Cloned queue "${selectedQueue.name}" to "${clonedQueue.name}"`);
  };

  // Print the queue.
  const printQueue = () => {
    if (!selectedQueue) return;
    const queueStr = selectedQueue.elements.map(elem => elem.value).join(', ');
    logOperation(`Queue "${selectedQueue.name}": ${queueStr}`);
    alert(`Queue: ${queueStr}`);
  };

  // SPECIAL OPERATIONS

  // Reverse the queue.
  const reverseQueue = () => {
    if (!selectedQueue) return;
    const updatedQueue = { ...selectedQueue, elements: [...selectedQueue.elements].reverse() };
    updateSelectedQueue(updatedQueue);
    logOperation(`Reversed queue "${selectedQueue.name}"`);
  };

  // Sort the queue.
  const sortQueue = () => {
    if (!selectedQueue) return;
    const sortedElements = [...selectedQueue.elements].sort((a, b) => {
      if (selectedQueue.dataType === 'Number') {
        return parseFloat(a.value) - parseFloat(b.value);
      } else {
        return a.value.toString().localeCompare(b.value.toString());
      }
    });
    const updatedQueue = { ...selectedQueue, elements: sortedElements };
    updateSelectedQueue(updatedQueue);
    logOperation(`Sorted queue "${selectedQueue.name}"`);
  };

  // Merge with another queue.
  const mergeQueues = () => {
    if (!selectedQueue) return;
    const otherQueueName = prompt("Enter the name of the queue to merge with:");
    if (!otherQueueName) return;
    const otherQueue = queues.find(q => q.name === otherQueueName);
    if (!otherQueue) {
      alert("Queue not found!");
      return;
    }
    const mergedElements = [...selectedQueue.elements, ...otherQueue.elements];
    const updatedQueue = { ...selectedQueue, elements: mergedElements };
    updateSelectedQueue(updatedQueue);
    logOperation(`Merged queue "${otherQueue.name}" into "${selectedQueue.name}"`);
  };

  // Convert the queue to a stack (simulation).
  const convertToStack = () => {
    if (!selectedQueue) return;
    logOperation(`Converted queue "${selectedQueue.name}" to a stack (simulation)`);
    alert("Queue converted to stack (simulation).");
  };

  // Check balanced parentheses using a queue (simulation).
  const checkBalancedParentheses = () => {
    const expression = prompt("Enter an expression to check for balanced parentheses:");
    if (expression === null) return;
    // Although stacks are preferred, here we simulate with a temporary array.
    const tempQueue = [];
    let balanced = true;
    for (let char of expression) {
      if (char === '(') {
        tempQueue.push(char);
      } else if (char === ')') {
        if (tempQueue.length === 0) {
          balanced = false;
          break;
        }
        tempQueue.pop();
      }
    }
    if (tempQueue.length !== 0) balanced = false;
    logOperation(`Balanced parentheses check for "${expression}": ${balanced ? 'Balanced' : 'Not Balanced'}`);
    alert(`Expression is ${balanced ? 'Balanced' : 'Not Balanced'}`);
  };

  // Additional operations like task scheduling or process queue operations can be added similarly.
  // For brevity, we'll log them without full implementations.
  const taskScheduling = () => {
    logOperation(`Executed task scheduling on queue "${selectedQueue.name}" (simulation)`);
    alert("Task scheduling executed (simulation).");
  };

  const processQueueOperations = () => {
    logOperation(`Processed real-time queue operations for "${selectedQueue.name}" (simulation)`);
    alert("Real-time queue processing executed (simulation).");
  };

  // Compute pointer information for visualization.
  // For most queue types, we simulate a "next" pointer from one element to the next.
  // For doubly linked list queues or deques, we simulate both next and previous pointers.
  // For circular queues, the last element points back to the front.
  const getElementPointers = (index) => {
    if (!selectedQueue) return {};
    const elements = selectedQueue.elements;
    let pointers = {};
    // For Array-Based, Linked List-Based, Priority, Min, Max, etc.
    if (
      selectedQueue.type === "Array-Based Queue" ||
      selectedQueue.type === "Linked List-Based Queue" ||
      selectedQueue.type === "Priority Queue" ||
      selectedQueue.type === "Min Queue" ||
      selectedQueue.type === "Max Queue" ||
      selectedQueue.type === "Expression Evaluation Queue" ||
      selectedQueue.type === "Call Queue (Task Scheduling Queue)" ||
      selectedQueue.type === "Undo/Redo Queue" ||
      selectedQueue.type === "Job Queue"
    ) {
      pointers.next = index < elements.length - 1 ? generateAddress(elements[index + 1].id) : 'null';
    }
    // For Doubly Linked List Queue and Double-Ended Queue.
    if (
      selectedQueue.type === "Doubly Linked List Queue" ||
      selectedQueue.type === "Double-Ended Queue (Deque)"
    ) {
      pointers.next = index < elements.length - 1 ? generateAddress(elements[index + 1].id) : 'null';
      pointers.prev = index > 0 ? generateAddress(elements[index - 1].id) : 'null';
    }
    // For Circular Queue / Circular Buffer Queue:
    if (
      selectedQueue.type === "Circular Queue" ||
      selectedQueue.type === "Circular Buffer Queue"
    ) {
      if (index < elements.length - 1) {
        pointers.next = generateAddress(elements[index + 1].id);
      } else if (elements.length > 0) {
        pointers.next = generateAddress(elements[0].id);
      } else {
        pointers.next = 'null';
      }
    }
    // For Thread-Safe Queue, Multi-Level Priority Queue, Multi-Queue, Monotonic Queue,
    // we'll simulate similar pointer behavior as the basic types.
    return pointers;
  };

  return (
    <div className={styles.container}>
      <h1>Queue Visualizer</h1>
      <div className={styles.controls}>
        {/* Create a new queue */}
        <div className={styles.createQueue}>
          <h2>Create Queue</h2>
          <input
            type="text"
            placeholder="Queue Name"
            value={newQueueName}
            onChange={(e) => setNewQueueName(e.target.value)}
          />
          <select
            value={selectedQueueType}
            onChange={(e) => setSelectedQueueType(e.target.value)}
          >
            {queueTypes.map((type, idx) => (
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
              if (newQueueName.trim()) {
                createQueue(newQueueName.trim(), selectedQueueType, selectedDataType);
                setNewQueueName('');
              }
            }}
          >
            Create
          </button>
        </div>

        {/* List of created queues */}
        <div className={styles.queueSelection}>
          <h2>Existing Queues</h2>
          <table className={styles.queueTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Data Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queues.map((queue) => (
                <tr key={queue.name}>
                  <td>{queue.name}</td>
                  <td>{queue.type}</td>
                  <td>{queue.dataType}</td>
                  <td>
                    <button onClick={() => setSelectedQueue(queue)}>Select</button>
                    <button onClick={() => deleteQueue(queue.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Operations panel for the selected queue */}
        {selectedQueue && (
          <div className={styles.operations}>
            <h2>Operations on "{selectedQueue.name}"</h2>
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
                    enqueueElement(newElementValue.trim());
                    setNewElementValue('');
                  }
                }}
              >
                Enqueue<br /><small>(O(1) time, O(1) space)</small>
              </button>
              <button onClick={dequeueElement}>
                Dequeue<br /><small>(O(1) time)</small>
              </button>
              <button onClick={frontElement}>
                Front/Peek<br /><small>(O(1) time)</small>
              </button>
              <button onClick={rearElement}>
                Rear<br /><small>(O(1) time)</small>
              </button>
              <button onClick={clearQueue}>
                Clear<br /><small>(O(n) time)</small>
              </button>
              <button onClick={cloneQueue}>
                Clone<br /><small>(O(n) time, O(n) space)</small>
              </button>
              <button onClick={reverseQueue}>
                Reverse<br /><small>(O(n) time, O(1) space)</small>
              </button>
              <button onClick={sortQueue}>
                Sort<br /><small>(O(n log n) or O(n²))</small>
              </button>
              <button onClick={printQueue}>Print Queue</button>
              <button onClick={mergeQueues}>Merge Queues</button>
              <button onClick={convertToStack}>Convert to Stack</button>
              <button onClick={checkBalancedParentheses}>Balanced Parentheses Check</button>
              <button onClick={taskScheduling}>Task Scheduling</button>
              <button onClick={processQueueOperations}>Process Queue Ops</button>
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
                    <td>Enqueue</td>
                    <td>O(1)</td>
                    <td>O(1)</td>
                  </tr>
                  <tr>
                    <td>Dequeue</td>
                    <td>O(1)</td>
                    <td>O(1)</td>
                  </tr>
                  <tr>
                    <td>Front/Peek</td>
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
              <h3>High-Level Representation (Front on the Left)</h3>
              <div className={styles.queueVisual}>
                {selectedQueue.elements.map((element, idx) => {
                  const pointers = getElementPointers(idx);
                  return (
                    <div key={element.id} className={styles.node}>
                      <div className={styles.nodeInfo}>
                        <span><strong>Data:</strong> {element.value}</span>
                        {(selectedQueue.type === "Doubly Linked List Queue" ||
                          selectedQueue.type === "Double-Ended Queue (Deque)") ? (
                          <>
                            <span><strong>Prev:</strong> {pointers.prev}</span>
                            <span><strong>Next:</strong> {pointers.next}</span>
                          </>
                        ) : (
                          <span><strong>Next:</strong> {pointers.next}</span>
                        )}
                      </div>
                      {idx !== selectedQueue.elements.length - 1 && <span className={styles.pointer}>→</span>}
                    </div>
                  );
                })}
              </div>

              <h3>Low-Level Memory Grid</h3>
              <div className={styles.memoryGrid}>
                {selectedQueue.elements.map((element, idx) => {
                  const pointers = getElementPointers(idx);
                  return (
                    <div key={element.id} className={styles.memoryCell}>
                      <div><strong>Address:</strong> {generateAddress(element.id)}</div>
                      <div><strong>Data:</strong> {element.value}</div>
                      <div><strong>Binary:</strong> {element.binary}</div>
                      {(selectedQueue.type === "Doubly Linked List Queue" ||
                        selectedQueue.type === "Double-Ended Queue (Deque)") ? (
                        <>
                          <div><strong>Prev Pointer:</strong> {pointers.prev}</div>
                          <div><strong>Next Pointer:</strong> {pointers.next}</div>
                        </>
                      ) : (
                        <div><strong>Next Pointer:</strong> {pointers.next}</div>
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

export default QueueVisualizer;
