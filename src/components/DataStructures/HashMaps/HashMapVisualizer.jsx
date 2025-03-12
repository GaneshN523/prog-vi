import React, { useState } from 'react';
import styles from './HashMapVisualizer.module.css';

// A simple hash function: sums character codes and mods by capacity.
const simpleHash = (key, capacity) => {
  let hash = 0;
  const str = key.toString();
  for (let char of str) {
    hash += char.charCodeAt(0);
  }
  return hash % capacity;
};

// Default starting capacity and load factor threshold.
const INITIAL_CAPACITY = 8;
const LOAD_FACTOR_THRESHOLD = 0.7;

// Create a new empty hash map instance based on type.
const createEmptyHashMap = (name, type, dataType) => {
  const capacity = INITIAL_CAPACITY;
  let table;
  if (type === "Open Addressing (Linear Probing)") {
    // An array of length capacity with nulls.
    table = Array(capacity).fill(null);
  } else {
    // Separate Chaining: array of buckets (empty arrays).
    table = Array(capacity).fill(null).map(() => []);
  }
  return {
    name,
    type,
    dataType,
    capacity,
    size: 0,
    table
  };
};

const HashMapVisualizer = () => {
  const hashMapTypes = ["Open Addressing (Linear Probing)", "Separate Chaining"];
  const dataTypes = ["String", "Number"];

  // List of created hash maps.
  const [hashMaps, setHashMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);

  // Inputs for creating a new hash map.
  const [newMapName, setNewMapName] = useState("");
  const [selectedMapType, setSelectedMapType] = useState(hashMapTypes[0]);
  const [selectedDataType, setSelectedDataType] = useState(dataTypes[0]);

  // Inputs for key-value operations.
  const [inputKey, setInputKey] = useState("");
  const [inputValue, setInputValue] = useState("");

  // For search operations.
  const [searchKey, setSearchKey] = useState("");

  // Operation log.
  const [opLog, setOpLog] = useState([]);

  const logOperation = (msg) => {
    setOpLog(prev => [...prev, msg]);
  };

  /* Dynamic resizing: When load factor > threshold, double capacity and rehash */
  const resizeMap = (map) => {
    const oldTable = map.table;
    const newCapacity = map.capacity * 2;
    let newTable;
    if (map.type === "Open Addressing (Linear Probing)") {
      newTable = Array(newCapacity).fill(null);
    } else {
      newTable = Array(newCapacity).fill(null).map(() => []);
    }
    // Reinsert all existing entries.
    let newSize = 0;
    const reinsert = (key, value) => {
      const hash = simpleHash(key, newCapacity);
      if (map.type === "Open Addressing (Linear Probing)") {
        let idx = hash;
        while (newTable[idx] !== null) {
          idx = (idx + 1) % newCapacity;
        }
        newTable[idx] = { key, value, hash };
      } else {
        newTable[hash].push({ key, value });
      }
      newSize++;
    };
    if (map.type === "Open Addressing (Linear Probing)") {
      oldTable.forEach(slot => {
        if (slot !== null) {
          reinsert(slot.key, slot.value);
        }
      });
    } else {
      oldTable.forEach(bucket => {
        bucket.forEach(entry => {
          reinsert(entry.key, entry.value);
        });
      });
    }
    logOperation(`Resized "${map.name}" to new capacity ${newCapacity}`);
    return { ...map, capacity: newCapacity, table: newTable, size: newSize };
  };

  /* Create a new hash map instance */
  const createHashMap = () => {
    if (!newMapName.trim()) return;
    const newMap = createEmptyHashMap(newMapName.trim(), selectedMapType, selectedDataType);
    setHashMaps([...hashMaps, newMap]);
    logOperation(`Created hash map "${newMap.name}" (${newMap.type}, ${newMap.dataType})`);
    setNewMapName("");
  };

  /* Delete a hash map by name */
  const deleteHashMap = (name) => {
    setHashMaps(hashMaps.filter(m => m.name !== name));
    if (selectedMap && selectedMap.name === name) setSelectedMap(null);
    logOperation(`Deleted hash map "${name}"`);
  };

  /* Select a hash map */
  const selectHashMap = (map) => {
    setSelectedMap(map);
    logOperation(`Selected hash map "${map.name}"`);
  };

  /* Update the selected hash map and overall list */
  const updateSelectedMap = (updatedMap) => {
    setSelectedMap(updatedMap);
    setHashMaps(hashMaps.map(m => m.name === updatedMap.name ? updatedMap : m));
  };

  /* Insert a key-value pair */
  const insertKeyValue = () => {
    if (!selectedMap || !inputKey.trim()) return;
    const key = inputKey.trim();
    const value = inputValue.trim();
    let map = { ...selectedMap };
    const hash = simpleHash(key, map.capacity);
    if (map.type === "Open Addressing (Linear Probing)") {
      let idx = hash;
      while (map.table[idx] !== null && map.table[idx].key !== key) {
        idx = (idx + 1) % map.capacity;
      }
      // If key exists, update; otherwise, insert.
      if (map.table[idx] === null) {
        map.size++;
        logOperation(`Inserted key "${key}" at index ${idx}`);
      } else {
        logOperation(`Updated key "${key}" at index ${idx}`);
      }
      map.table[idx] = { key, value, hash };
    } else { // Separate Chaining
      const bucket = map.table[hash];
      const existingIndex = bucket.findIndex(entry => entry.key === key);
      if (existingIndex === -1) {
        bucket.push({ key, value });
        map.size++;
        logOperation(`Inserted key "${key}" in bucket ${hash}`);
      } else {
        bucket[existingIndex] = { key, value };
        logOperation(`Updated key "${key}" in bucket ${hash}`);
      }
    }
    // Check load factor.
    const loadFactor = map.size / map.capacity;
    if (loadFactor > LOAD_FACTOR_THRESHOLD) {
      map = resizeMap(map);
    }
    updateSelectedMap(map);
    setInputKey("");
    setInputValue("");
  };

  /* Search for a key */
  const searchKeyValue = () => {
    if (!selectedMap || !searchKey.trim()) return;
    const key = searchKey.trim();
    const hash = simpleHash(key, selectedMap.capacity);
    let found = null;
    if (selectedMap.type === "Open Addressing (Linear Probing)") {
      let idx = hash;
      while (selectedMap.table[idx] !== null) {
        if (selectedMap.table[idx].key === key) {
          found = selectedMap.table[idx];
          break;
        }
        idx = (idx + 1) % selectedMap.capacity;
      }
    } else {
      const bucket = selectedMap.table[hash];
      found = bucket.find(entry => entry.key === key);
    }
    if (found) {
      logOperation(`Found key "${key}" with value "${found.value}"`);
      alert(`Key "${key}" found with value "${found.value}"`);
    } else {
      logOperation(`Key "${key}" not found.`);
      alert(`Key "${key}" not found.`);
    }
    setSearchKey("");
  };

  /* Delete a key-value pair */
  const deleteKeyValue = () => {
    if (!selectedMap || !inputKey.trim()) return;
    const key = inputKey.trim();
    const hash = simpleHash(key, selectedMap.capacity);
    let map = { ...selectedMap };
    let deleted = false;
    if (map.type === "Open Addressing (Linear Probing)") {
      let idx = hash;
      while (map.table[idx] !== null) {
        if (map.table[idx].key === key) {
          map.table[idx] = null;
          deleted = true;
          map.size--;
          logOperation(`Deleted key "${key}" from index ${idx}`);
          break;
        }
        idx = (idx + 1) % map.capacity;
      }
      // To maintain proper probing, rehash subsequent entries.
      if (deleted) {
        let nextIdx = (idx + 1) % map.capacity;
        while (map.table[nextIdx] !== null) {
          const entry = map.table[nextIdx];
          map.table[nextIdx] = null;
          map.size--;
          insertKeyValueForRehash(map, entry);
          nextIdx = (nextIdx + 1) % map.capacity;
        }
      }
    } else {
      const bucket = map.table[hash];
      const initialLength = bucket.length;
      map.table[hash] = bucket.filter(entry => entry.key !== key);
      if (bucket.length !== map.table[hash].length) {
        deleted = true;
        map.size -= (initialLength - map.table[hash].length);
        logOperation(`Deleted key "${key}" from bucket ${hash}`);
      }
    }
    if (deleted) {
      updateSelectedMap(map);
    } else {
      alert(`Key "${key}" not found.`);
      logOperation(`Attempted deletion: key "${key}" not found.`);
    }
    setInputKey("");
  };

  // Helper to rehash a removed entry (for open addressing deletion).
  const insertKeyValueForRehash = (map, entry) => {
    const hash = simpleHash(entry.key, map.capacity);
    let idx = hash;
    while (map.table[idx] !== null) {
      idx = (idx + 1) % map.capacity;
    }
    map.table[idx] = entry;
    map.size++;
  };

  /* Iteration: Get all keys */
  const iterateKeys = () => {
    if (!selectedMap) return;
    let keys = [];
    if (selectedMap.type === "Open Addressing (Linear Probing)") {
      selectedMap.table.forEach(slot => {
        if (slot !== null) keys.push(slot.key);
      });
    } else {
      selectedMap.table.forEach(bucket => {
        bucket.forEach(entry => keys.push(entry.key));
      });
    }
    logOperation(`Keys: ${keys.join(", ")}`);
    alert(`Keys: ${keys.join(", ")}`);
  };

  /* High-Level Visualization: Bucket View */
  const renderHighLevel = () => {
    if (!selectedMap) return <div>No hash map selected.</div>;
    if (selectedMap.type === "Open Addressing (Linear Probing)") {
      return (
        <div className={styles.bucketGrid}>
          {selectedMap.table.map((slot, idx) => (
            <div key={idx} className={styles.bucketCell}>
              <div className={styles.index}>Index {idx}</div>
              {slot ? (
                <div className={styles.entry}>
                  <div><strong>Key:</strong> {slot.key}</div>
                  <div><strong>Val:</strong> {slot.value}</div>
                </div>
              ) : (
                <div className={styles.empty}>Empty</div>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      // Separate chaining: each bucket is a list.
      return (
        <div className={styles.bucketGrid}>
          {selectedMap.table.map((bucket, idx) => (
            <div key={idx} className={styles.bucketCell}>
              <div className={styles.index}>Bucket {idx}</div>
              {bucket.length ? (
                bucket.map((entry, i) => (
                  <div key={i} className={styles.entry}>
                    <div><strong>Key:</strong> {entry.key}</div>
                    <div><strong>Val:</strong> {entry.value}</div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>Empty</div>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  /* Low-Level Memory Grid: Detailed view */
  const renderLowLevel = () => {
    if (!selectedMap) return <div>No hash map selected.</div>;
    if (selectedMap.type === "Open Addressing (Linear Probing)") {
      return (
        <div className={styles.memoryGrid}>
          {selectedMap.table.map((slot, idx) => (
            <div key={idx} className={styles.memoryCell}>
              <div><strong>Index:</strong> {idx}</div>
              {slot ? (
                <>
                  <div><strong>Key:</strong> {slot.key}</div>
                  <div><strong>Val:</strong> {slot.value}</div>
                  <div><strong>Hash:</strong> {slot.hash}</div>
                  <div><strong>Addr:</strong> {generateAddress(idx)}</div>
                </>
              ) : (
                <div>Empty</div>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className={styles.memoryGrid}>
          {selectedMap.table.map((bucket, idx) => (
            <div key={idx} className={styles.memoryCell}>
              <div><strong>Bucket:</strong> {idx}</div>
              {bucket.length ? bucket.map((entry, i) => (
                <div key={i}>
                  <div><strong>Key:</strong> {entry.key}</div>
                  <div><strong>Val:</strong> {entry.value}</div>
                  <div><strong>Addr:</strong> {generateAddress(i)}</div>
                </div>
              )) : <div>Empty</div>}
            </div>
          ))}
        </div>
      );
    }
  };

  /* Display load factor and manual resizing */
  const displayLoadFactor = () => {
    if (!selectedMap) return;
    const loadFactor = (selectedMap.size / selectedMap.capacity).toFixed(2);
    alert(`Load Factor: ${loadFactor}`);
  };

  const manualResize = () => {
    if (!selectedMap) return;
    let map = resizeMap(selectedMap);
    updateSelectedMap(map);
  };

  return (
    <div className={styles.container}>
      <h1>Hash Map Visualizer</h1>
      
      {/* Hash Map List Panel */}
      <div className={styles.hashMapList}>
        <h2>Existing Hash Maps</h2>
        {hashMaps.length ? (
          <table className={styles.hashMapTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hashMaps.map(map => (
                <tr key={map.name}>
                  <td>{map.name}</td>
                  <td>{map.type}</td>
                  <td>{map.capacity}</td>
                  <td>{map.size}</td>
                  <td>
                    <button onClick={() => selectHashMap(map)}>Select</button>
                    <button onClick={() => deleteHashMap(map.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hash maps created yet.</p>
        )}
      </div>
      
      {/* Create Hash Map Panel */}
      <div className={styles.createHashMap}>
        <h2>Create New Hash Map</h2>
        <input
          type="text"
          placeholder="Hash Map Name"
          value={newMapName}
          onChange={(e) => setNewMapName(e.target.value)}
        />
        <select value={selectedMapType} onChange={(e) => setSelectedMapType(e.target.value)}>
          {hashMapTypes.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>
        <select value={selectedDataType} onChange={(e) => setSelectedDataType(e.target.value)}>
          {dataTypes.map((dt, idx) => (
            <option key={idx} value={dt}>{dt}</option>
          ))}
        </select>
        <button onClick={createHashMap}>Create</button>
      </div>
      
      {/* Operations Panel for Selected Hash Map */}
      {selectedMap && (
        <>
          <div className={styles.operations}>
            <h2>Operations on "{selectedMap.name}"</h2>
            <div className={styles.opControls}>
              <input
                type="text"
                placeholder="Key"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button onClick={insertKeyValue}>Insert / Update</button>
              <button onClick={deleteKeyValue}>Delete</button>
              <button onClick={searchKeyValue}>Search</button>
              <button onClick={iterateKeys}>Iterate Keys</button>
            </div>
            <div className={styles.opControls}>
              <button onClick={displayLoadFactor}>Show Load Factor</button>
              <button onClick={manualResize}>Resize</button>
            </div>
          </div>
          
          {/* Visualization Panel */}
          <div className={styles.visualization}>
            <h2>High-Level Bucket View</h2>
            {renderHighLevel()}
            <h2>Low-Level Memory Grid</h2>
            {renderLowLevel()}
          </div>
        </>
      )}
      
      {/* Operation Log Panel */}
      <div className={styles.operationLog}>
        <h2>Operation Log</h2>
        <ul>
          {opLog.map((entry, idx) => (
            <li key={idx}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HashMapVisualizer;
