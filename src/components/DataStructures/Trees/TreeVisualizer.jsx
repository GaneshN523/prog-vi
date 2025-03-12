import React, { useState } from 'react';
import styles from './TreeVisualizer.module.css';

// Helper to generate a pseudo-memory address.
const generateAddress = (id) => `0x${id.toString(16)}`;

// Create a new tree node.
function createNode(value) {
  return {
    id: Date.now() + Math.random(),
    value,
    children: []
  };
}

// Recursively compute the height of the tree.
function getHeight(node) {
  if (!node) return 0;
  if (node.children.length === 0) return 1;
  return 1 + Math.max(...node.children.map(getHeight));
}

// Recursively count nodes.
function countNodes(node) {
  if (!node) return 0;
  return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0);
}

// Flatten the tree into an array for the memory grid.
function flattenTree(node, nodes = []) {
  if (!node) return nodes;
  nodes.push(node);
  node.children.forEach(child => flattenTree(child, nodes));
  return nodes;
}

/* TRAVERSAL SIMULATION FUNCTIONS */

// Preorder Traversal: Visit, then children.
function generatePreorderSteps(node) {
  const steps = [];
  function traverse(n) {
    if (!n) return;
    steps.push({
      type: 'call',
      frame: { id: n.id, value: n.value, address: generateAddress(n.id) },
      message: `Visit node ${n.value} (Preorder)`
    });
    n.children.forEach(child => traverse(child));
    steps.push({
      type: 'return',
      frame: { id: n.id, value: n.value, address: generateAddress(n.id) },
      message: `Backtrack from node ${n.value} (Preorder)`
    });
  }
  traverse(node);
  return steps;
}

// Inorder Traversal (for binary trees): Left, Visit, Right.
function generateInorderSteps(node) {
  const steps = [];
  function traverse(n) {
    if (!n) return;
    // For binary trees, assume children[0] is left and children[1] is right.
    if (n.children[0]) traverse(n.children[0]);
    steps.push({
      type: 'call',
      frame: { id: n.id, value: n.value, address: generateAddress(n.id) },
      message: `Visit node ${n.value} (Inorder)`
    });
    if (n.children[1]) traverse(n.children[1]);
    steps.push({
      type: 'return',
      frame: { id: n.id, value: n.value, address: generateAddress(n.id) },
      message: `Backtrack from node ${n.value} (Inorder)`
    });
  }
  traverse(node);
  return steps;
}

// Postorder Traversal (for binary trees): Left, Right, Visit.
function generatePostorderSteps(node) {
  const steps = [];
  function traverse(n) {
    if (!n) return;
    if (n.children[0]) traverse(n.children[0]);
    if (n.children[1]) traverse(n.children[1]);
    steps.push({
      type: 'call',
      frame: { id: n.id, value: n.value, address: generateAddress(n.id) },
      message: `Visit node ${n.value} (Postorder)`
    });
    steps.push({
      type: 'return',
      frame: { id: n.id, value: n.value, address: generateAddress(n.id) },
      message: `Backtrack from node ${n.value} (Postorder)`
    });
  }
  traverse(node);
  return steps;
}

// Level Order Traversal (BFS): Visit nodes level by level.
function generateLevelOrderSteps(node) {
  const steps = [];
  if (!node) return steps;
  const queue = [node];
  while (queue.length) {
    const current = queue.shift();
    steps.push({
      type: 'call',
      frame: { id: current.id, value: current.value, address: generateAddress(current.id) },
      message: `Visit node ${current.value} (Level Order)`
    });
    current.children.forEach(child => queue.push(child));
  }
  return steps;
}

/* AUTO INSERTION FUNCTION */
// Automatically insert node based on tree type.
// For Binary Tree types, use level order insertion (first node with less than 2 children).
// For others, simply attach to the first node found (or to root if no children exist).
function autoInsertNode(tree, newNode) {
  if (!tree.root) {
    return newNode;
  }
  // For Binary-like trees, ensure at most 2 children.
  if (tree.type.includes("Binary") || tree.type.includes("Complete") || tree.type.includes("Perfect") || tree.type.includes("Balanced") || tree.type === "AVL Tree" || tree.type === "Red-Black Tree") {
    const queue = [tree.root];
    while (queue.length) {
      const current = queue.shift();
      if (current.children.length < 2) {
        current.children.push(newNode);
        return tree.root;
      }
      current.children.forEach(child => queue.push(child));
    }
  }
  // For N-ary or General Trees, attach as a child of the first node found.
  const queue = [tree.root];
  while (queue.length) {
    const current = queue.shift();
    // No max children restriction for a general tree.
    current.children.push(newNode);
    return tree.root;
  }
  return tree.root;
}

const TreeVisualizer = () => {
  const treeTypes = [
    "General Tree", "Binary Tree", "Ternary Tree", "Quaternary Tree", "N-ary Tree",
    "Full Binary Tree", "Complete Binary Tree", "Perfect Binary Tree", "Balanced Binary Tree",
    "Degenerate Tree", "Trie", "Ternary Search Tree", "Radix Tree", "Suffix Tree",
    "Segment Tree", "Fenwick Tree", "K-D Tree", "Octree", "R-Tree", "B-Tree", "B+ Tree",
    "B Tree*", "AVL Tree", "Red-Black Tree", "Splay Tree", "Treap", "Cartesian Tree",
    "AA Tree", "2-3 Tree", "2-3-4 Tree", "Patricia Tree", "Suffix Array + LCP Array"
  ];
  const dataTypes = ["String", "Number", "Boolean"];
  const traversalOptions = ["Preorder", "Inorder", "Postorder", "Level Order"];

  const [trees, setTrees] = useState([]);
  const [selectedTree, setSelectedTree] = useState(null);
  const [newTreeName, setNewTreeName] = useState("");
  const [selectedTreeType, setSelectedTreeType] = useState(treeTypes[0]);
  const [selectedDataType, setSelectedDataType] = useState(dataTypes[0]);
  const [newNodeValue, setNewNodeValue] = useState("");
  const [log, setLog] = useState([]);
  const [traversalSteps, setTraversalSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [callStack, setCallStack] = useState([]);
  const [selectedTraversal, setSelectedTraversal] = useState(traversalOptions[0]);
  const [searchValue, setSearchValue] = useState("");

  // Create a new tree.
  const createTree = () => {
    if (!newTreeName.trim()) return;
    const newTree = {
      name: newTreeName.trim(),
      type: selectedTreeType,
      dataType: selectedDataType,
      root: null
    };
    setTrees([...trees, newTree]);
    setLog(prev => [...prev, `Created tree "${newTree.name}" [${newTree.type}, ${newTree.dataType}]`]);
    setNewTreeName("");
  };

  // Delete a tree.
  const deleteTree = (name) => {
    setTrees(trees.filter(tree => tree.name !== name));
    if (selectedTree && selectedTree.name === name) setSelectedTree(null);
    setLog(prev => [...prev, `Deleted tree "${name}"`]);
  };

  // Update the selected tree.
  const updateSelectedTree = (updatedTree) => {
    setSelectedTree(updatedTree);
    setTrees(trees.map(tree => tree.name === updatedTree.name ? updatedTree : tree));
  };

  // Auto-insert a node based on tree type.
  const insertNode = () => {
    if (!selectedTree || !newNodeValue.trim()) return;
    const newNode = createNode(newNodeValue.trim());
    let updatedTree = { ...selectedTree };
    updatedTree.root = autoInsertNode(updatedTree, newNode);
    setLog(prev => [...prev, `Inserted node "${newNode.value}" into tree "${updatedTree.name}"`]);
    updateSelectedTree(updatedTree);
    setNewNodeValue("");
  };

  // Delete a node by value (removes first occurrence found via BFS).
  const deleteNode = () => {
    if (!selectedTree || !selectedTree.root) return;
    const valueToDelete = prompt("Enter value of node to delete:");
    if (!valueToDelete) return;
    let deleted = false;
    function removeNode(node, value) {
      if (!node) return;
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].value === value && !deleted) {
          node.children.splice(i, 1);
          deleted = true;
          return;
        } else {
          removeNode(node.children[i], value);
          if (deleted) return;
        }
      }
    }
    let updatedTree = { ...selectedTree };
    if (updatedTree.root.value === valueToDelete) {
      updatedTree.root = null;
      deleted = true;
    } else {
      removeNode(updatedTree.root, valueToDelete);
    }
    if (deleted) {
      setLog(prev => [...prev, `Deleted node with value "${valueToDelete}" from tree "${updatedTree.name}"`]);
      updateSelectedTree(updatedTree);
    } else {
      alert(`Node with value "${valueToDelete}" not found.`);
    }
  };

  // Operation: Get Height.
  const getTreeHeight = () => {
    if (!selectedTree || !selectedTree.root) return;
    const height = getHeight(selectedTree.root);
    setLog(prev => [...prev, `Height of tree "${selectedTree.name}" is ${height}`]);
    alert(`Height: ${height}`);
  };

  // Operation: Count Nodes.
  const countTreeNodes = () => {
    if (!selectedTree || !selectedTree.root) return;
    const count = countNodes(selectedTree.root);
    setLog(prev => [...prev, `Total nodes in tree "${selectedTree.name}" is ${count}`]);
    alert(`Total Nodes: ${count}`);
  };

  /* TRAVERSAL OPERATIONS */

  // Start a traversal simulation based on selected type.
  const startTraversal = () => {
    if (!selectedTree || !selectedTree.root) return;
    let steps = [];
    if (selectedTraversal === "Preorder") {
      steps = generatePreorderSteps(selectedTree.root);
    } else if (selectedTraversal === "Inorder") {
      // Only valid for binary trees.
      if (!selectedTree.type.includes("Binary")) {
        alert("Inorder traversal is only valid for binary trees.");
        return;
      }
      steps = generateInorderSteps(selectedTree.root);
    } else if (selectedTraversal === "Postorder") {
      if (!selectedTree.type.includes("Binary")) {
        alert("Postorder traversal is only valid for binary trees.");
        return;
      }
      steps = generatePostorderSteps(selectedTree.root);
    } else if (selectedTraversal === "Level Order") {
      steps = generateLevelOrderSteps(selectedTree.root);
    }
    setTraversalSteps(steps);
    setCurrentStepIndex(0);
    setCallStack([]);
    setLog(prev => [...prev, `Started ${selectedTraversal} Traversal on tree "${selectedTree.name}"`]);
  };

  // Advance one step in the traversal simulation.
  const nextTraversalStep = () => {
    if (currentStepIndex >= traversalSteps.length) {
      alert("Traversal complete.");
      return;
    }
    const step = traversalSteps[currentStepIndex];
    if (step.type === "call") {
      setCallStack(prev => [...prev, step.frame]);
    } else if (step.type === "return") {
      setCallStack(prev => prev.slice(0, -1));
    }
    setLog(prev => [...prev, step.message]);
    setCurrentStepIndex(prev => prev + 1);
  };

  /* SEARCH OPERATION (Level Order Search) */
  const searchTree = () => {
    if (!selectedTree || !selectedTree.root || !searchValue.trim()) return;
    const target = searchValue.trim();
    const queue = [selectedTree.root];
    let found = null;
    while (queue.length) {
      const current = queue.shift();
      setLog(prev => [...prev, `Checking node "${current.value}"`]);
      if (current.value === target) {
        found = current;
        break;
      }
      current.children.forEach(child => queue.push(child));
    }
    if (found) {
      setLog(prev => [...prev, `Found node with value "${target}" at address ${generateAddress(found.id)}`]);
      alert(`Node "${target}" found!`);
    } else {
      setLog(prev => [...prev, `Node "${target}" not found in tree "${selectedTree.name}"`]);
      alert(`Node "${target}" not found.`);
    }
    setSearchValue("");
  };

  /* RENDERING FUNCTIONS */

  // Render the tree recursively for high-level view.
  const renderTree = (node) => {
    if (!node) return null;
    return (
      <div className={styles.treeNode} key={node.id}>
        <div className={styles.nodeBox}>
          {node.value}
          <div className={styles.nodeAddress}>Address: {generateAddress(node.id)}</div>
        </div>
        {node.children.length > 0 && (
          <div className={styles.children}>
            {node.children.map(child => renderTree(child))}
          </div>
        )}
      </div>
    );
  };

  // Render the low-level memory grid.
  const renderMemoryGrid = () => {
    if (!selectedTree || !selectedTree.root) return <div>No nodes</div>;
    const nodes = flattenTree(selectedTree.root, []);
    return (
      <div className={styles.memoryGrid}>
        {nodes.map(node => (
          <div key={node.id} className={styles.memoryCell}>
            <div><strong>Address:</strong> {generateAddress(node.id)}</div>
            <div><strong>Data:</strong> {node.value}</div>
            <div><strong>Binary:</strong> {typeof node.value === 'string' ? node.value.split('').map(c => c.charCodeAt(0).toString(2)).join(' ') : parseInt(node.value).toString(2) || 'N/A'}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1>Tree Visualizer</h1>
      <div className={styles.controls}>
        {/* Create Tree Panel */}
        <div className={styles.createTree}>
          <h2>Create Tree</h2>
          <input
            type="text"
            placeholder="Tree Name"
            value={newTreeName}
            onChange={(e) => setNewTreeName(e.target.value)}
          />
          <select value={selectedTreeType} onChange={(e) => setSelectedTreeType(e.target.value)}>
            {treeTypes.map((type, idx) => (
              <option key={idx} value={type}>{type}</option>
            ))}
          </select>
          <select value={selectedDataType} onChange={(e) => setSelectedDataType(e.target.value)}>
            {dataTypes.map((dt, idx) => (
              <option key={idx} value={dt}>{dt}</option>
            ))}
          </select>
          <button onClick={createTree}>Create</button>
        </div>

        {/* Tree Selection Panel */}
        <div className={styles.treeSelection}>
          <h2>Existing Trees</h2>
          <table className={styles.treeTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Data Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trees.map(tree => (
                <tr key={tree.name}>
                  <td>{tree.name}</td>
                  <td>{tree.type}</td>
                  <td>{tree.dataType}</td>
                  <td>
                    <button onClick={() => setSelectedTree(tree)}>Select</button>
                    <button onClick={() => deleteTree(tree.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operations Panel for Selected Tree */}
      {selectedTree && (
        <div className={styles.operations}>
          <h2>Operations on "{selectedTree.name}"</h2>
          <div className={styles.opControls}>
            <input
              type="text"
              placeholder="New Node Value"
              value={newNodeValue}
              onChange={(e) => setNewNodeValue(e.target.value)}
            />
            <button onClick={insertNode}>Insert Node</button>
            <button onClick={deleteNode}>Delete Node</button>
            <button onClick={getTreeHeight}>Get Height</button>
            <button onClick={countTreeNodes}>Count Nodes</button>
          </div>

          {/* Traversal Operations Panel */}
          <div className={styles.opControls}>
            <select value={selectedTraversal} onChange={(e) => setSelectedTraversal(e.target.value)}>
              {traversalOptions.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
            <button onClick={startTraversal}>Start Traversal</button>
            <button onClick={nextTraversalStep} disabled={traversalSteps.length === 0}>Next Traversal Step</button>
          </div>

          {/* Search Operation Panel */}
          <div className={styles.opControls}>
            <input
              type="text"
              placeholder="Search Value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button onClick={searchTree}>Search Tree</button>
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
                  <td>Insert Node</td>
                  <td>O(n) (BFS insertion)</td>
                  <td>O(1)</td>
                </tr>
                <tr>
                  <td>Delete Node</td>
                  <td>O(n)</td>
                  <td>O(1)</td>
                </tr>
                <tr>
                  <td>Get Height</td>
                  <td>O(n)</td>
                  <td>O(h)</td>
                </tr>
                <tr>
                  <td>Count Nodes</td>
                  <td>O(n)</td>
                  <td>O(1)</td>
                </tr>
                <tr>
                  <td>Preorder Traversal</td>
                  <td>O(n)</td>
                  <td>O(n)</td>
                </tr>
                <tr>
                  <td>Inorder/Postorder Traversal</td>
                  <td>O(n)</td>
                  <td>O(n)</td>
                </tr>
                <tr>
                  <td>Level Order Traversal</td>
                  <td>O(n)</td>
                  <td>O(n)</td>
                </tr>
                <tr>
                  <td>Search</td>
                  <td>O(n)</td>
                  <td>O(n)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* High-Level Visualization */}
          <div className={styles.visualization}>
            <h3>High-Level Tree Structure</h3>
            {selectedTree.root ? renderTree(selectedTree.root) : <div>No nodes in tree.</div>}
            <h3>Low-Level Memory Grid</h3>
            {renderMemoryGrid()}
          </div>

          {/* Call Stack Panel for Traversal Simulation */}
          <div className={styles.callStackPanel}>
            <h3>Call Stack (Traversal Simulation)</h3>
            {callStack.length > 0 ? callStack.map(frame => (
              <div key={frame.id} className={styles.frame}>
                <div><strong>Function:</strong> Node({frame.value})</div>
                <div><strong>Address:</strong> {frame.address}</div>
              </div>
            )) : <div className={styles.emptyStack}>Call stack is empty.</div>}
          </div>

          {/* Operation Log Panel */}
          <div className={styles.operationLog}>
            <h3>Operation Log</h3>
            <ul>
              {log.map((entry, idx) => (
                <li key={idx}>{entry}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeVisualizer;
