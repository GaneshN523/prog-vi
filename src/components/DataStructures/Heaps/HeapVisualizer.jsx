import React, { useState } from 'react';
import styles from './HeapVisualizer.module.css';

// Helper to generate a simulated memory address.
const generateAddress = (id) => `0x${id.toString(16)}`;

// List of available heap types.
const heapTypes = [
  "Binary Heap (Min)",
  "Binary Heap (Max)",
  "Binomial Heap",
  "Fibonacci Heap",
  "Pairing Heap",
  "Skew Heap",
  "Ternary Heap",
  "D-ary Heap",
  "Soft Heap",
  "Leftist Heap",
  "Interval Heap",
  "B-Heap",
  "K-Heap",
  "Quaternary Heap",
  "Rank-Pairing Heap",
  "Strict Fibonacci Heap",
  "Van Emde Boas Heap"
];

const dataTypes = ["Number", "String"];

/**
 * For our simulation we focus on binary heaps.
 * We represent the heap as an array in state.
 * The tree diagram is built using the standard formula:
 * left child at 2*i+1, right child at 2*i+2.
 */
function arrayToTree(arr, index = 0) {
  if (index >= arr.length) return null;
  return {
    id: index,
    value: arr[index],
    left: arrayToTree(arr, 2 * index + 1),
    right: arrayToTree(arr, 2 * index + 2)
  };
}

/* Binary Heap Helper Functions for Min/Max Heaps */

// Heapify-up: after insertion.
function heapifyUp(arr, index, heapType, logCallback) {
  while (index > 0) {
    let parentIndex = Math.floor((index - 1) / 2);
    let shouldSwap = false;
    if (heapType.includes("Min")) {
      if (arr[index] < arr[parentIndex]) shouldSwap = true;
    } else if (heapType.includes("Max")) {
      if (arr[index] > arr[parentIndex]) shouldSwap = true;
    }
    if (!shouldSwap) break;
    logCallback(`Swapping ${arr[index]} and ${arr[parentIndex]}`);
    [arr[index], arr[parentIndex]] = [arr[parentIndex], arr[index]];
    index = parentIndex;
  }
  return arr;
}

// Heapify-down: after extraction or replacement.
function heapifyDown(arr, index, heapType, logCallback) {
  const n = arr.length;
  while (index < n) {
    let left = 2 * index + 1;
    let right = 2 * index + 2;
    let swapIndex = index;
    if (heapType.includes("Min")) {
      if (left < n && arr[left] < arr[swapIndex]) swapIndex = left;
      if (right < n && arr[right] < arr[swapIndex]) swapIndex = right;
    } else if (heapType.includes("Max")) {
      if (left < n && arr[left] > arr[swapIndex]) swapIndex = left;
      if (right < n && arr[right] > arr[swapIndex]) swapIndex = right;
    }
    if (swapIndex === index) break;
    logCallback(`Swapping ${arr[index]} and ${arr[swapIndex]}`);
    [arr[index], arr[swapIndex]] = [arr[swapIndex], arr[index]];
    index = swapIndex;
  }
  return arr;
}

const HeapVisualizer = () => {
  // Heap state: each heap is stored as { name, type, dataType, elements: [] }
  const [heaps, setHeaps] = useState([]);
  const [selectedHeap, setSelectedHeap] = useState(null);
  const [newHeapName, setNewHeapName] = useState("");
  const [selectedHeapType, setSelectedHeapType] = useState(heapTypes[0]);
  const [selectedDataType, setSelectedDataType] = useState(dataTypes[0]);
  const [newElementValue, setNewElementValue] = useState("");
  const [operationLog, setOperationLog] = useState([]);

  // Log an operation step.
  const logOperation = (msg) => {
    setOperationLog((prev) => [...prev, msg]);
  };

  // Create a new heap.
  const createHeap = () => {
    if (!newHeapName.trim()) return;
    const newHeap = {
      name: newHeapName.trim(),
      type: selectedHeapType,
      dataType: selectedDataType,
      elements: []
    };
    setHeaps([...heaps, newHeap]);
    logOperation(`Created heap "${newHeap.name}" of type ${newHeap.type} (${newHeap.dataType})`);
    setNewHeapName("");
  };

  // Delete a heap.
  const deleteHeap = (name) => {
    setHeaps(heaps.filter((h) => h.name !== name));
    if (selectedHeap && selectedHeap.name === name) setSelectedHeap(null);
    logOperation(`Deleted heap "${name}"`);
  };

  // Update the selected heap.
  const updateSelectedHeap = (updatedHeap) => {
    setSelectedHeap(updatedHeap);
    setHeaps(heaps.map((h) => (h.name === updatedHeap.name ? updatedHeap : h)));
  };

  /* HEAP OPERATIONS (for Binary Heap types) */

  // Insert operation.
  const insertNode = () => {
    if (!selectedHeap || !newElementValue.trim()) return;
    let val = selectedDataType === "Number" ? Number(newElementValue) : newElementValue;
    let arr = [...selectedHeap.elements];
    arr.push(val);
    logOperation(`Inserted ${val} at end of heap array.`);
    // If it's a binary heap (Min/Max), perform heapify-up.
    if (selectedHeap.type.includes("Binary")) {
      arr = heapifyUp(arr, arr.length - 1, selectedHeap.type, logOperation);
    }
    const updatedHeap = { ...selectedHeap, elements: arr };
    updateSelectedHeap(updatedHeap);
    setNewElementValue("");
  };

  // Extract Root operation.
  const extractRoot = () => {
    if (!selectedHeap || selectedHeap.elements.length === 0) return;
    let arr = [...selectedHeap.elements];
    const root = arr[0];
    logOperation(`Extracting root ${root}.`);
    arr[0] = arr[arr.length - 1];
    arr.pop();
    if (selectedHeap.type.includes("Binary")) {
      arr = heapifyDown(arr, 0, selectedHeap.type, logOperation);
    }
    const updatedHeap = { ...selectedHeap, elements: arr };
    updateSelectedHeap(updatedHeap);
    alert(`Extracted Root: ${root}`);
  };

  // Peek Root.
  const peekRoot = () => {
    if (!selectedHeap || selectedHeap.elements.length === 0) return;
    alert(`Root: ${selectedHeap.elements[0]}`);
    logOperation(`Peeked at root: ${selectedHeap.elements[0]}`);
  };

  // Replace Root: prompt for a new value.
  const replaceRoot = () => {
    if (!selectedHeap || selectedHeap.elements.length === 0) return;
    let newVal = prompt("Enter new value for root:");
    if (newVal === null) return;
    newVal = selectedDataType === "Number" ? Number(newVal) : newVal;
    let arr = [...selectedHeap.elements];
    logOperation(`Replacing root ${arr[0]} with ${newVal}.`);
    arr[0] = newVal;
    if (selectedHeap.type.includes("Binary")) {
      arr = heapifyDown(arr, 0, selectedHeap.type, logOperation);
    }
    const updatedHeap = { ...selectedHeap, elements: arr };
    updateSelectedHeap(updatedHeap);
  };

  // Build Heap from array input.
  const buildHeap = () => {
    if (!selectedHeap) return;
    let input = prompt("Enter comma-separated values:");
    if (!input) return;
    let values = input.split(",").map(v => v.trim()).filter(v => v !== "");
    if (selectedDataType === "Number") {
      values = values.map(Number);
    }
    // For binary heaps, perform heap construction.
    let arr = [...values];
    // Heapify from the last non-leaf node.
    let start = Math.floor(arr.length / 2) - 1;
    for (let i = start; i >= 0; i--) {
      arr = heapifyDown(arr, i, selectedHeap.type, logOperation);
    }
    const updatedHeap = { ...selectedHeap, elements: arr };
    updateSelectedHeap(updatedHeap);
    logOperation(`Built heap from array: [${arr.join(", ")}]`);
  };

  // Delete Node by value.
  const deleteNode = () => {
    if (!selectedHeap || selectedHeap.elements.length === 0) return;
    let val = prompt("Enter value to delete:");
    if (val === null) return;
    val = selectedDataType === "Number" ? Number(val) : val;
    let arr = [...selectedHeap.elements];
    const index = arr.indexOf(val);
    if (index === -1) {
      alert(`Value ${val} not found.`);
      logOperation(`Value ${val} not found in heap.`);
      return;
    }
    logOperation(`Deleting value ${val} at index ${index}.`);
    // Replace with last element and remove last.
    arr[index] = arr[arr.length - 1];
    arr.pop();
    // Rebuild heap.
    if (selectedHeap.type.includes("Binary")) {
      arr = heapifyDown(arr, index, selectedHeap.type, logOperation);
      arr = heapifyUp(arr, index, selectedHeap.type, logOperation);
    }
    const updatedHeap = { ...selectedHeap, elements: arr };
    updateSelectedHeap(updatedHeap);
  };

  // Heap Sort simulation.
  const heapSort = () => {
    if (!selectedHeap || selectedHeap.elements.length === 0) return;
    let arr = [...selectedHeap.elements];
    let sorted = [];
    // For simulation, repeatedly extract root.
    while (arr.length) {
      sorted.push(arr[0]);
      arr[0] = arr[arr.length - 1];
      arr.pop();
      arr = heapifyDown(arr, 0, selectedHeap.type, () => {}); // Suppress logging for sort.
    }
    logOperation(`Heap sort result: [${sorted.join(", ")}]`);
    alert(`Sorted: [${sorted.join(", ")}]`);
  };

  // Search for a value in the heap.
  const searchHeap = () => {
    if (!selectedHeap || selectedHeap.elements.length === 0) return;
    let val = prompt("Enter value to search:");
    if (val === null) return;
    val = selectedDataType === "Number" ? Number(val) : val;
    const arr = selectedHeap.elements;
    const index = arr.indexOf(val);
    if (index !== -1) {
      logOperation(`Found value ${val} at index ${index} (Address: ${generateAddress(index)})`);
      alert(`Value ${val} found at index ${index}`);
    } else {
      logOperation(`Value ${val} not found in heap.`);
      alert(`Value ${val} not found.`);
    }
  };

  /* RENDERING FUNCTIONS */

  // Convert the heap array to a tree for high-level visualization.
  const renderHeapTree = () => {
    if (!selectedHeap || selectedHeap.elements.length === 0) return <div>No elements in heap.</div>;
    const tree = arrayToTree(selectedHeap.elements);
    const renderNode = (node) => {
      if (!node) return null;
      return (
        <div key={node.id} className={styles.treeNode}>
          <div className={styles.nodeBox}>
            {node.value}
            <div className={styles.nodeAddress}>Addr: {generateAddress(node.id)}</div>
          </div>
          <div className={styles.children}>
            {renderNode(node.left)}
            {renderNode(node.right)}
          </div>
        </div>
      );
    };
    return renderNode(tree);
  };

  // Render the low-level memory grid (array representation).
  const renderMemoryGrid = () => {
    if (!selectedHeap || selectedHeap.elements.length === 0)
      return <div>No elements in heap.</div>;
    return (
      <div className={styles.memoryGrid}>
        {selectedHeap.elements.map((elem, idx) => (
          <div key={idx} className={styles.memoryCell}>
            <div><strong>Index:</strong> {idx}</div>
            <div><strong>Data:</strong> {elem}</div>
            <div><strong>Binary:</strong> {typeof elem === "string" ? elem.split("").map(c => c.charCodeAt(0).toString(2)).join(" ") : parseInt(elem).toString(2)}</div>
            <div><strong>Addr:</strong> {generateAddress(idx)}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1>Heap Visualizer</h1>
      <div className={styles.controls}>
        {/* Create Heap Panel */}
        <div className={styles.createHeap}>
          <h2>Create Heap</h2>
          <input
            type="text"
            placeholder="Heap Name"
            value={newHeapName}
            onChange={(e) => setNewHeapName(e.target.value)}
          />
          <select value={selectedHeapType} onChange={(e) => setSelectedHeapType(e.target.value)}>
            {heapTypes.map((type, idx) => (
              <option key={idx} value={type}>{type}</option>
            ))}
          </select>
          <select value={selectedDataType} onChange={(e) => setSelectedDataType(e.target.value)}>
            {dataTypes.map((dt, idx) => (
              <option key={idx} value={dt}>{dt}</option>
            ))}
          </select>
          <button onClick={createHeap}>Create</button>
        </div>

        {/* Heap Selection Panel */}
        <div className={styles.heapSelection}>
          <h2>Existing Heaps</h2>
          <table className={styles.heapTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Data Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {heaps.map((heap) => (
                <tr key={heap.name}>
                  <td>{heap.name}</td>
                  <td>{heap.type}</td>
                  <td>{heap.dataType}</td>
                  <td>
                    <button onClick={() => setSelectedHeap(heap)}>Select</button>
                    <button onClick={() => deleteHeap(heap.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operations Panel for Selected Heap */}
      {selectedHeap && (
        <div className={styles.operations}>
          <h2>Operations on "{selectedHeap.name}"</h2>
          <div className={styles.opControls}>
            <input
              type="text"
              placeholder="New Element Value"
              value={newElementValue}
              onChange={(e) => setNewElementValue(e.target.value)}
            />
            <button onClick={insertNode}>Insert</button>
            <button onClick={extractRoot}>Extract Root</button>
            <button onClick={peekRoot}>Peek Root</button>
            <button onClick={replaceRoot}>Replace Root</button>
            <button onClick={buildHeap}>Build Heap</button>
            <button onClick={deleteNode}>Delete Node</button>
            <button onClick={heapSort}>Heap Sort</button>
            <button onClick={searchHeap}>Search</button>
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
                  <td>Insert</td>
                  <td>O(log n)</td>
                  <td>O(1)</td>
                </tr>
                <tr>
                  <td>Extract Root</td>
                  <td>O(log n)</td>
                  <td>O(1)</td>
                </tr>
                <tr>
                  <td>Peek Root</td>
                  <td>O(1)</td>
                  <td>O(1)</td>
                </tr>
                <tr>
                  <td>Replace Root</td>
                  <td>O(log n)</td>
                  <td>O(1)</td>
                </tr>
                <tr>
                  <td>Build Heap</td>
                  <td>O(n)</td>
                  <td>O(1)</td>
                </tr>
                <tr>
                  <td>Delete Node</td>
                  <td>O(n)</td>
                  <td>O(1)</td>
                </tr>
                <tr>
                  <td>Heap Sort</td>
                  <td>O(n log n)</td>
                  <td>O(n)</td>
                </tr>
                <tr>
                  <td>Search</td>
                  <td>O(n)</td>
                  <td>O(1)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* High-Level Visualization */}
          <div className={styles.visualization}>
            <h3>Heap Diagram (Tree View)</h3>
            {renderHeapTree()}
            <h3>Memory Grid (Array View)</h3>
            {renderMemoryGrid()}
          </div>

          {/* Operation Log Panel */}
          <div className={styles.operationLog}>
            <h3>Operation Log</h3>
            <ul>
              {operationLog.map((entry, idx) => (
                <li key={idx}>{entry}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeapVisualizer;
