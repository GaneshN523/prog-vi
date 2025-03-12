import React, { useState } from 'react';
import styles from './GraphVisualizer.module.css';

// Helper to generate a simulated memory address.
const generateAddress = (id) => `0x${id.toString(16)}`;

const graphTypes = [
  "Undirected Unweighted",
  "Directed Unweighted",
  "Undirected Weighted",
  "Directed Weighted"
];

const GraphVisualizer = () => {
  // State for storing multiple graphs.
  const [graphs, setGraphs] = useState([]);
  const [selectedGraph, setSelectedGraph] = useState(null);

  // Graph creation inputs.
  const [graphName, setGraphName] = useState("");
  const [selectedGraphType, setSelectedGraphType] = useState(graphTypes[0]);

  // For vertex and edge creation (these apply to the selected graph).
  const [newVertexLabel, setNewVertexLabel] = useState("");
  const [edgeSource, setEdgeSource] = useState("");
  const [edgeTarget, setEdgeTarget] = useState("");
  const [edgeWeight, setEdgeWeight] = useState("");

  // For shortest path search.
  const [spSource, setSpSource] = useState("");
  const [spTarget, setSpTarget] = useState("");

  // Traversal results (for DFS, BFS, etc.).
  const [dfsResult, setDfsResult] = useState([]);
  const [bfsResult, setBfsResult] = useState([]);

  // Operation log to capture every step.
  const [operationLog, setOperationLog] = useState([]);

  /* GRAPH CREATION & MANAGEMENT */
  const createGraph = () => {
    if (!graphName.trim()) return;
    const newGraph = {
      name: graphName.trim(),
      type: selectedGraphType,
      vertices: [],
      edges: []
    };
    setGraphs([...graphs, newGraph]);
    setOperationLog((prev) => [...prev, `Created graph "${newGraph.name}" of type ${newGraph.type}`]);
    setGraphName("");
  };

  const deleteGraph = (name) => {
    setGraphs(graphs.filter((g) => g.name !== name));
    if (selectedGraph && selectedGraph.name === name) setSelectedGraph(null);
    setOperationLog((prev) => [...prev, `Deleted graph "${name}"`]);
  };

  const selectGraph = (graph) => {
    setSelectedGraph(graph);
    setOperationLog((prev) => [...prev, `Selected graph "${graph.name}"`]);
  };

  const updateSelectedGraph = (updatedGraph) => {
    setSelectedGraph(updatedGraph);
    setGraphs(graphs.map((g) => (g.name === updatedGraph.name ? updatedGraph : g)));
  };

  /* VERTEX & EDGE OPERATIONS */
  const addVertex = () => {
    if (!selectedGraph || !newVertexLabel.trim()) return;
    const newVertex = { id: Date.now() + Math.random(), label: newVertexLabel.trim() };
    const updatedGraph = {
      ...selectedGraph,
      vertices: [...selectedGraph.vertices, newVertex]
    };
    updateSelectedGraph(updatedGraph);
    setOperationLog((prev) => [...prev, `Added vertex "${newVertex.label}" (Addr: ${generateAddress(newVertex.id)})`]);
    setNewVertexLabel("");
  };

  const removeVertex = (id) => {
    if (!selectedGraph) return;
    const vertex = selectedGraph.vertices.find((v) => v.id === id);
    if (!vertex) return;
    const updatedVertices = selectedGraph.vertices.filter((v) => v.id !== id);
    // Remove any edge that touches this vertex.
    const updatedEdges = selectedGraph.edges.filter((e) => e.source !== id && e.target !== id);
    const updatedGraph = { ...selectedGraph, vertices: updatedVertices, edges: updatedEdges };
    updateSelectedGraph(updatedGraph);
    setOperationLog((prev) => [...prev, `Removed vertex "${vertex.label}"`]);
  };

  const addEdge = () => {
    if (!selectedGraph || !edgeSource || !edgeTarget) return;
    if (edgeSource === edgeTarget) {
      alert("Self-loops are not allowed.");
      return;
    }
    const sourceVertex = selectedGraph.vertices.find((v) => v.id.toString() === edgeSource);
    const targetVertex = selectedGraph.vertices.find((v) => v.id.toString() === edgeTarget);
    if (!sourceVertex || !targetVertex) {
      alert("Invalid vertices selected.");
      return;
    }
    const newEdge = {
      id: Date.now() + Math.random(),
      source: sourceVertex.id,
      target: targetVertex.id,
      weight: selectedGraphType.includes("Weighted") ? (edgeWeight.trim() ? Number(edgeWeight) : 1) : undefined
    };
    const updatedGraph = { ...selectedGraph, edges: [...selectedGraph.edges, newEdge] };
    updateSelectedGraph(updatedGraph);
    setOperationLog((prev) => [
      ...prev,
      `Added edge from "${sourceVertex.label}" ${selectedGraphType.includes("Directed") ? "→" : "↔"} "${targetVertex.label}"${newEdge.weight !== undefined ? " (Weight: " + newEdge.weight + ")" : ""}`
    ]);
    setEdgeSource("");
    setEdgeTarget("");
    setEdgeWeight("");
  };

  const removeEdge = (id) => {
    if (!selectedGraph) return;
    const edge = selectedGraph.edges.find((e) => e.id === id);
    if (!edge) return;
    const updatedGraph = { ...selectedGraph, edges: selectedGraph.edges.filter((e) => e.id !== id) };
    updateSelectedGraph(updatedGraph);
    const source = selectedGraph.vertices.find((v) => v.id === edge.source);
    const target = selectedGraph.vertices.find((v) => v.id === edge.target);
    setOperationLog((prev) => [...prev, `Removed edge from "${source?.label}" to "${target?.label}"`]);
  };

  /* BASIC GRAPH OPERATIONS */
  const checkAdjacency = (v1, v2) => {
    const exists = selectedGraph.edges.some((e) => {
      if (selectedGraphType.includes("Directed"))
        return e.source === v1 && e.target === v2;
      return (e.source === v1 && e.target === v2) || (e.source === v2 && e.target === v1);
    });
    setOperationLog((prev) => [...prev, `Vertices ${v1} and ${v2} are ${exists ? "" : "not "}adjacent.`]);
    alert(`Vertices are ${exists ? "" : "not "}adjacent.`);
  };

  const getDegree = (vertexId) => {
    if (selectedGraphType.includes("Directed")) {
      const inDegree = selectedGraph.edges.filter((e) => e.target === vertexId).length;
      const outDegree = selectedGraph.edges.filter((e) => e.source === vertexId).length;
      setOperationLog((prev) => [...prev, `In-Degree: ${inDegree}, Out-Degree: ${outDegree}`]);
      alert(`In-Degree: ${inDegree}, Out-Degree: ${outDegree}`);
    } else {
      const degree = selectedGraph.edges.filter((e) => e.source === vertexId || e.target === vertexId).length;
      setOperationLog((prev) => [...prev, `Degree: ${degree}`]);
      alert(`Degree: ${degree}`);
    }
  };

  /* TRAVERSAL OPERATIONS */
  // DFS Traversal (starting from first vertex in graph)
  const dfsTraversal = (startId) => {
    const visited = new Set();
    const result = [];
    const steps = [];
    function dfs(id) {
      visited.add(id);
      const vertex = selectedGraph.vertices.find((v) => v.id === id);
      if (!vertex) return;
      result.push(vertex.label);
      steps.push(`Visited ${vertex.label}`);
      // For directed graphs, consider outgoing edges; for undirected, both.
      let neighbors = selectedGraph.edges.filter((e) => {
        if (selectedGraphType.includes("Directed"))
          return e.source === id;
        return e.source === id || e.target === id;
      }).map((e) => (e.source === id ? e.target : e.source));
      for (let neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      }
    }
    dfs(startId);
    steps.forEach((s) => setOperationLog((prev) => [...prev, s]));
    alert(`DFS Order: ${result.join(" -> ")}`);
  };

  // BFS Traversal.
  const bfsTraversal = (startId) => {
    const visited = new Set();
    const queue = [startId];
    const result = [];
    const steps = [];
    while (queue.length) {
      const id = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      const vertex = selectedGraph.vertices.find((v) => v.id === id);
      if (!vertex) continue;
      result.push(vertex.label);
      steps.push(`Visited ${vertex.label}`);
      let neighbors = selectedGraph.edges.filter((e) => {
        if (selectedGraphType.includes("Directed"))
          return e.source === id;
        return e.source === id || e.target === id;
      }).map((e) => (e.source === id ? e.target : e.source));
      queue.push(...neighbors);
    }
    steps.forEach((s) => setOperationLog((prev) => [...prev, s]));
    alert(`BFS Order: ${result.join(" -> ")}`);
  };

  // Topological Sort (Kahn's Algorithm) for directed graphs.
  const topologicalSort = () => {
    if (!selectedGraphType.includes("Directed")) {
      alert("Topological sort applies only to directed graphs.");
      return;
    }
    const inDegree = {};
    selectedGraph.vertices.forEach(v => inDegree[v.id] = 0);
    selectedGraph.edges.forEach(e => { inDegree[e.target] = (inDegree[e.target] || 0) + 1; });
    const queue = [];
    for (let id in inDegree) {
      if (inDegree[id] === 0) queue.push(id);
    }
    const result = [];
    while (queue.length) {
      const id = queue.shift();
      const vertex = selectedGraph.vertices.find(v => v.id.toString() === id);
      if (vertex) result.push(vertex.label);
      selectedGraph.edges.forEach(e => {
        if (e.source.toString() === id) {
          inDegree[e.target]--;
          if (inDegree[e.target] === 0) queue.push(e.target.toString());
        }
      });
    }
    setOperationLog((prev) => [...prev, `Topological Order: ${result.join(" -> ")}`]);
    alert(`Topological Order: ${result.join(" -> ")}`);
  };

  // Shortest Path using BFS for unweighted graphs.
  const shortestPath = () => {
    if (!spSource || !spTarget) {
      alert("Please select both source and target vertices for shortest path.");
      return;
    }
    const startId = spSource;
    const targetId = spTarget;
    const visited = new Set();
    const queue = [[startId, [startId]]];
    let path = null;
    while (queue.length) {
      const [id, pathSoFar] = queue.shift();
      if (id === targetId) {
        path = pathSoFar;
        break;
      }
      if (visited.has(id)) continue;
      visited.add(id);
      let neighbors = selectedGraph.edges.filter((e) => {
        if (selectedGraphType.includes("Directed"))
          return e.source === id;
        return e.source === id || e.target === id;
      }).map(e => (e.source === id ? e.target : e.target));
      for (let neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push([neighbor, [...pathSoFar, neighbor]]);
        }
      }
    }
    if (path) {
      const labels = path.map(id => selectedGraph.vertices.find(v => v.id === id)?.label);
      setOperationLog((prev) => [...prev, `Shortest Path: ${labels.join(" -> ")}`]);
      alert(`Shortest Path: ${labels.join(" -> ")}`);
    } else {
      setOperationLog((prev) => [...prev, `No path found between selected vertices.`]);
      alert("No path found.");
    }
  };

  /* VISUALIZATION */

  // High-level graph diagram.
  const renderGraphDiagram = () => {
    return (
      <div className={styles.graphDiagram}>
        <div className={styles.vertices}>
          {selectedGraph.vertices.map(v => (
            <div key={v.id} className={styles.vertex}>
              <div className={styles.circle}>
                {v.label}
                <div className={styles.address}>Addr: {generateAddress(v.id)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.edgeList}>
          {selectedGraph.edges.map(e => {
            const source = selectedGraph.vertices.find(v => v.id === e.source);
            const target = selectedGraph.vertices.find(v => v.id === e.target);
            return (
              <div key={e.id} className={styles.edge}>
                {source?.label} {selectedGraphType.includes("Directed") ? "→" : "↔"} {target?.label} {e.weight !== undefined ? `(Weight: ${e.weight})` : ""}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Low-level adjacency list view.
  const renderAdjacencyList = () => {
    const adj = {};
    selectedGraph.vertices.forEach(v => (adj[v.id] = []));
    selectedGraph.edges.forEach(e => {
      adj[e.source].push(e.target);
      if (!selectedGraphType.includes("Directed")) {
        adj[e.target].push(e.source);
      }
    });
    return (
      <div className={styles.adjacencyList}>
        <h3>Adjacency List</h3>
        {selectedGraph.vertices.map(v => (
          <div key={v.id}>
            <strong>{v.label}:</strong> {adj[v.id].map(id => selectedGraph.vertices.find(x => x.id === id)?.label).join(", ")}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1>Graph Visualizer</h1>
      
      {/* Graph List Panel */}
      <div className={styles.graphList}>
        <h2>Existing Graphs</h2>
        {graphs.length ? (
          <table className={styles.graphTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {graphs.map((g) => (
                <tr key={g.name}>
                  <td>{g.name}</td>
                  <td>{g.type}</td>
                  <td>
                    <button onClick={() => selectGraph(g)}>Select</button>
                    <button onClick={() => deleteGraph(g.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No graphs created yet.</p>
        )}
      </div>
      
      {/* Graph Creation Panel */}
      <div className={styles.createGraph}>
        <h2>Create Graph</h2>
        <input
          type="text"
          placeholder="Graph Name"
          value={graphName}
          onChange={(e) => setGraphName(e.target.value)}
        />
        <select value={selectedGraphType} onChange={(e) => setSelectedGraphType(e.target.value)}>
          {graphTypes.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>
        <button onClick={createGraph}>Create Graph</button>
      </div>
      
      {/* If a graph is selected, show its operations */}
      {selectedGraph && (
        <>
          <div className={styles.vertexEdgeOps}>
            <h2>Manage Vertices & Edges</h2>
            <div className={styles.opControls}>
              <input
                type="text"
                placeholder="Vertex Label"
                value={newVertexLabel}
                onChange={(e) => setNewVertexLabel(e.target.value)}
              />
              <button onClick={addVertex}>Add Vertex</button>
            </div>
            <div className={styles.opControls}>
              <select value={edgeSource} onChange={(e) => setEdgeSource(e.target.value)}>
                <option value="">Select Source</option>
                {selectedGraph.vertices.map(v => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
              <select value={edgeTarget} onChange={(e) => setEdgeTarget(e.target.value)}>
                <option value="">Select Target</option>
                {selectedGraph.vertices.map(v => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
              {selectedGraphType.includes("Weighted") && (
                <input
                  type="text"
                  placeholder="Weight"
                  value={edgeWeight}
                  onChange={(e) => setEdgeWeight(e.target.value)}
                />
              )}
              <button onClick={addEdge}>Add Edge</button>
            </div>
            <div className={styles.opControls}>
              <h3>Vertices List</h3>
              <ul>
                {selectedGraph.vertices.map(v => (
                  <li key={v.id}>
                    {v.label} (Addr: {generateAddress(v.id)}){" "}
                    <button onClick={() => getDegree(v.id)}>Degree</button>{" "}
                    <button onClick={() => removeVertex(v.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.opControls}>
              <h3>Edges List</h3>
              <ul>
                {selectedGraph.edges.map(e => {
                  const source = selectedGraph.vertices.find(v => v.id === e.source);
                  const target = selectedGraph.vertices.find(v => v.id === e.target);
                  return (
                    <li key={e.id}>
                      {source?.label} {selectedGraphType.includes("Directed") ? "→" : "↔"} {target?.label} {e.weight !== undefined ? `(Weight: ${e.weight})` : ""}{" "}
                      <button onClick={() => removeEdge(e.id)}>Remove</button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Graph Operations Panel */}
          <div className={styles.operations}>
            <h2>Graph Operations</h2>
            <div className={styles.opControls}>
              <button onClick={() => { if (selectedGraph.vertices.length) dfsTraversal(selectedGraph.vertices[0].id); }}>DFS Traversal</button>
              <button onClick={() => { if (selectedGraph.vertices.length) bfsTraversal(selectedGraph.vertices[0].id); }}>BFS Traversal</button>
              <button onClick={topologicalSort}>Topological Sort</button>
              <button onClick={shortestPath}>Shortest Path</button>
            </div>
            <div className={styles.opControls}>
              <select value={spSource} onChange={(e) => setSpSource(e.target.value)}>
                <option value="">Select Source</option>
                {selectedGraph.vertices.map(v => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
              <select value={spTarget} onChange={(e) => setSpTarget(e.target.value)}>
                <option value="">Select Target</option>
                {selectedGraph.vertices.map(v => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
              <button onClick={shortestPath}>Find Shortest Path</button>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className={styles.visualizationPanel}>
            <h2>Graph Visualization</h2>
            {renderGraphDiagram()}
            {renderAdjacencyList()}
          </div>
        </>
      )}

      {/* Operation Log Panel */}
      <div className={styles.operationLog}>
        <h2>Operation Log</h2>
        <ul>
          {operationLog.map((entry, idx) => (
            <li key={idx}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GraphVisualizer;
