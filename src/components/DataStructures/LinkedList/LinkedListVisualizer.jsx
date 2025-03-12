import React, { useState } from 'react';
import styles from './LinkedListVisualizer.module.css';

// A helper to generate a pseudo-memory address for each node
const generateAddress = (id) => `0x${id.toString(16)}`;

const LinkedListVisualizer = () => {
  // State to hold all created linked lists
  const [linkedLists, setLinkedLists] = useState([]);
  // Currently selected linked list to operate on
  const [selectedList, setSelectedList] = useState(null);
  // For creating a new list
  const [newListName, setNewListName] = useState('');
  const [selectedType, setSelectedType] = useState('SLL'); // Default type
  const [selectedDataType, setSelectedDataType] = useState('String'); // Default data type
  // For node operations (e.g., inserting a node)
  const [newNodeValue, setNewNodeValue] = useState('');
  // Operation log to display step-by-step actions
  const [operationLog, setOperationLog] = useState([]);

  // Log operation step by step
  const logOperation = (message) => {
    setOperationLog(prevLog => [...prevLog, message]);
  };

  // Create a new linked list object with data type
  const createLinkedList = (name, type, dataType) => {
    const newList = {
      name,
      type,
      dataType,
      nodes: [] // Nodes will be stored as an array; each node can include a value and simulated pointers
    };
    setLinkedLists([...linkedLists, newList]);
    logOperation(`Created a new ${type} with data type ${dataType} named "${name}"`);
  };

  // Delete a linked list by name
  const deleteLinkedList = (name) => {
    setLinkedLists(linkedLists.filter(list => list.name !== name));
    logOperation(`Deleted linked list "${name}"`);
    if (selectedList && selectedList.name === name) {
      setSelectedList(null);
    }
  };

  // Helper to update the selected list in both local state and the overall list collection
  const updateSelectedList = (updatedList) => {
    setSelectedList(updatedList);
    setLinkedLists(linkedLists.map(list => list.name === updatedList.name ? updatedList : list));
  };

  // Create a new node object with proper pointer simulation
  const createNode = (value) => {
    const newNode = { 
      id: Date.now(), 
      value,
      // Simulated binary representation based on data type
      binary: (typeof value === 'string' 
        ? value.split('').map(c => c.charCodeAt(0).toString(2)).join(' ') 
        : parseInt(value).toString(2))
    };
    return newNode;
  };

  // Insert a node at the head of the selected linked list
  const insertAtHead = (value) => {
    if (!selectedList) return;
    const newNode = createNode(value);
    const updatedList = { ...selectedList, nodes: [newNode, ...selectedList.nodes] };
    updateSelectedList(updatedList);
    logOperation(`Inserted node with value "${value}" at head`);
  };

  // Insert a node at the tail of the selected linked list
  const insertAtTail = (value) => {
    if (!selectedList) return;
    const newNode = createNode(value);
    const updatedList = { ...selectedList, nodes: [...selectedList.nodes, newNode] };
    updateSelectedList(updatedList);
    logOperation(`Inserted node with value "${value}" at tail`);
  };

  // Delete the head node
  const deleteHead = () => {
    if (!selectedList || selectedList.nodes.length === 0) return;
    const removedNode = selectedList.nodes[0];
    const updatedList = { ...selectedList, nodes: selectedList.nodes.slice(1) };
    updateSelectedList(updatedList);
    logOperation(`Deleted head node with value "${removedNode.value}"`);
  };

  // Delete the tail node
  const deleteTail = () => {
    if (!selectedList || selectedList.nodes.length === 0) return;
    const removedNode = selectedList.nodes[selectedList.nodes.length - 1];
    const updatedList = { ...selectedList, nodes: selectedList.nodes.slice(0, -1) };
    updateSelectedList(updatedList);
    logOperation(`Deleted tail node with value "${removedNode.value}"`);
  };

  // Reverse the linked list (a sample modification operation)
  const reverseList = () => {
    if (!selectedList) return;
    const updatedList = { ...selectedList, nodes: [...selectedList.nodes].reverse() };
    updateSelectedList(updatedList);
    logOperation(`Reversed the linked list "${selectedList.name}"`);
  };

  // Compute pointer addresses for visualization based on list type
  const getNodePointers = (index) => {
    if (!selectedList) return {};
    const nodes = selectedList.nodes;
    let pointers = {};
    // For Singly Linked List (SLL) and Circular Singly Linked List (CSLL)
    if (selectedList.type === 'SLL' || selectedList.type === 'CSLL') {
      // Next pointer: if last node, then for CSLL, point to head, else null
      if (index < nodes.length - 1) {
        pointers.next = generateAddress(nodes[index + 1].id);
      } else {
        pointers.next = selectedList.type === 'CSLL' && nodes.length > 0 ? generateAddress(nodes[0].id) : 'null';
      }
    }
    // For Doubly Linked List (DLL) and Circular Doubly Linked List (CDLL)
    if (selectedList.type === 'DLL' || selectedList.type === 'CDLL') {
      // Next pointer
      if (index < nodes.length - 1) {
        pointers.next = generateAddress(nodes[index + 1].id);
      } else {
        pointers.next = selectedList.type === 'CDLL' && nodes.length > 0 ? generateAddress(nodes[0].id) : 'null';
      }
      // Previous pointer
      if (index > 0) {
        pointers.prev = generateAddress(nodes[index - 1].id);
      } else {
        pointers.prev = selectedList.type === 'CDLL' && nodes.length > 0 ? generateAddress(nodes[nodes.length - 1].id) : 'null';
      }
    }
    return pointers;
  };

  return (
    <div className={styles.container}>
      <h1>Linked List Visualizer</h1>
      <div className={styles.controls}>
        {/* Create a new linked list */}
        <div className={styles.createList}>
          <h2>Create Linked List</h2>
          <input 
            type="text" 
            placeholder="List Name" 
            value={newListName} 
            onChange={(e) => setNewListName(e.target.value)} 
          />
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="SLL">Singly Linked List (SLL)</option>
            <option value="DLL">Doubly Linked List (DLL)</option>
            <option value="CSLL">Circular Singly Linked List (CSLL)</option>
            <option value="CDLL">Circular Doubly Linked List (CDLL)</option>
            {/* Add additional types as needed */}
          </select>
          {/* Data Type selection for nodes */}
          <select value={selectedDataType} onChange={(e) => setSelectedDataType(e.target.value)}>
            <option value="String">String</option>
            <option value="Number">Number</option>
            <option value="Boolean">Boolean</option>
          </select>
          <button onClick={() => { 
            if(newListName.trim()){
              createLinkedList(newListName.trim(), selectedType, selectedDataType);
              setNewListName('');
            }
          }}>Create</button>
        </div>

        {/* List of created linked lists */}
        <div className={styles.listSelection}>
          <h2>Existing Linked Lists</h2>
          <table className={styles.listTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Data Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {linkedLists.map(list => (
                <tr key={list.name}>
                  <td>{list.name}</td>
                  <td>{list.type}</td>
                  <td>{list.dataType}</td>
                  <td>
                    <button onClick={() => setSelectedList(list)}>Select</button>
                    <button onClick={() => deleteLinkedList(list.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Operations panel for the selected linked list */}
        {selectedList && (
          <div className={styles.operations}>
            <h2>Operations on "{selectedList.name}"</h2>
            <div className={styles.opControls}>
              <input 
                type="text" 
                placeholder="Node Value" 
                value={newNodeValue} 
                onChange={(e) => setNewNodeValue(e.target.value)} 
              />
              <button onClick={() => { 
                if(newNodeValue.trim()){
                  insertAtHead(newNodeValue.trim());
                  setNewNodeValue('');
                }
              }}>
                Insert at Head<br/><small>(O(1) time, O(1) space)</small>
              </button>
              <button onClick={() => { 
                if(newNodeValue.trim()){
                  insertAtTail(newNodeValue.trim());
                  setNewNodeValue('');
                }
              }}>
                Insert at Tail<br/><small>(O(1) time, O(1) space)</small>
              </button>
              <button onClick={deleteHead}>
                Delete Head<br/><small>(O(1) time)</small>
              </button>
              <button onClick={deleteTail}>
                Delete Tail<br/><small>(O(n) time in worst case)</small>
              </button>
              <button onClick={reverseList}>
                Reverse List<br/><small>(O(n) time, O(1) space)</small>
              </button>
              {/* Additional operation buttons can be added here */}
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
                    <td>Insert at Head</td>
                    <td>O(1)</td>
                    <td>O(1)</td>
                  </tr>
                  <tr>
                    <td>Insert at Tail</td>
                    <td>O(1)</td>
                    <td>O(1)</td>
                  </tr>
                  <tr>
                    <td>Delete Head</td>
                    <td>O(1)</td>
                    <td>O(1)</td>
                  </tr>
                  <tr>
                    <td>Delete Tail</td>
                    <td>O(n)</td>
                    <td>O(1)</td>
                  </tr>
                  <tr>
                    <td>Reverse List</td>
                    <td>O(n)</td>
                    <td>O(1)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Visualization Panel */}
            <div className={styles.visualization}>
              <h3>High-Level Representation</h3>
              <div className={styles.listVisual}>
                {selectedList.nodes.map((node, index) => {
                  const pointers = getNodePointers(index);
                  return (
                    <div key={node.id} className={styles.node}>
                      <div className={styles.nodeInfo}>
                        <span><strong>Data:</strong> {node.value}</span>
                        {selectedList.type === 'DLL' || selectedList.type === 'CDLL' ? (
                          <>
                            <span><strong>Prev:</strong> {pointers.prev}</span>
                            <span><strong>Next:</strong> {pointers.next}</span>
                          </>
                        ) : (
                          <span><strong>Next:</strong> {pointers.next}</span>
                        )}
                      </div>
                      {index < selectedList.nodes.length - 1 && <span className={styles.pointer}>→</span>}
                    </div>
                  );
                })}
              </div>

              <h3>Low-Level Memory Grid</h3>
              <div className={styles.memoryGrid}>
                {selectedList.nodes.map((node, index) => {
                  const pointers = getNodePointers(index);
                  return (
                    <div key={node.id} className={styles.memoryCell}>
                      <div><strong>Address:</strong> {generateAddress(node.id)}</div>
                      <div><strong>Data:</strong> {node.value}</div>
                      <div><strong>Binary:</strong> {node.binary}</div>
                      {(selectedList.type === 'DLL' || selectedList.type === 'CDLL') && (
                        <>
                          <div><strong>Prev Pointer:</strong> {pointers.prev}</div>
                          <div><strong>Next Pointer:</strong> {pointers.next}</div>
                        </>
                      )}
                      {(selectedList.type === 'SLL' || selectedList.type === 'CSLL') && (
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

export default LinkedListVisualizer;
