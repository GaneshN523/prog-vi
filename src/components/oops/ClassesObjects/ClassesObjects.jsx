import React, { useState } from 'react';
import styles from './ClassesObjects.module.css';

// Helper function to simulate a memory address.
const generateAddress = (id) => `0x${id.toString(16)}`;

const propertyTypes = ["String", "Number", "Boolean"];

const ClassesObjects = () => {
  // List of classes (blueprints)
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  
  // List of instantiated objects
  const [objects, setObjects] = useState([]);
  
  // For creating a new class
  const [newClassName, setNewClassName] = useState("");
  
  // For adding properties to a class
  const [newPropName, setNewPropName] = useState("");
  const [newPropType, setNewPropType] = useState(propertyTypes[0]);
  const [newPropValue, setNewPropValue] = useState("");
  
  // For creating object instances from a class
  // Holds any user-overrides for property values when creating an object
  const [objectOverrides, setObjectOverrides] = useState({});
  
  // Operation log to track steps
  const [opLog, setOpLog] = useState([]);
  
  const logOperation = (msg) => {
    setOpLog(prev => [...prev, msg]);
  };

  // Create a new class (only name is typed; properties are added via dropdowns)
  const createClass = () => {
    if (!newClassName.trim()) return;
    const newClass = {
      name: newClassName.trim(),
      properties: [] // Each property: { name, type, defaultValue }
    };
    setClasses([...classes, newClass]);
    logOperation(`Created class "${newClass.name}"`);
    setNewClassName("");
  };

  // Delete an existing class
  const deleteClass = (className) => {
    setClasses(classes.filter(c => c.name !== className));
    if (selectedClass && selectedClass.name === className) setSelectedClass(null);
    logOperation(`Deleted class "${className}"`);
  };

  // Select a class to work on
  const selectClass = (cls) => {
    setSelectedClass(cls);
    setObjectOverrides({}); // Reset any existing overrides
    logOperation(`Selected class "${cls.name}"`);
  };

  // Add a property to the selected class
  const addProperty = () => {
    if (!selectedClass || !newPropName.trim()) return;
    const property = {
      name: newPropName.trim(),
      type: newPropType,
      defaultValue: newPropValue
    };
    const updatedClass = { 
      ...selectedClass, 
      properties: [...selectedClass.properties, property] 
    };
    setSelectedClass(updatedClass);
    setClasses(classes.map(c => c.name === updatedClass.name ? updatedClass : c));
    logOperation(`Added property "${property.name}" (${property.type}) to class "${selectedClass.name}"`);
    setNewPropName("");
    setNewPropType(propertyTypes[0]);
    setNewPropValue("");
  };

  // Create an object instance from the selected class
  const createObject = () => {
    if (!selectedClass) return;
    // For each property, use override if provided, otherwise the class's default value.
    const objProps = {};
    selectedClass.properties.forEach(prop => {
      objProps[prop.name] = (objectOverrides[prop.name] !== undefined && objectOverrides[prop.name] !== "")
        ? objectOverrides[prop.name]
        : prop.defaultValue;
    });
    const newObject = {
      className: selectedClass.name,
      properties: objProps
    };
    setObjects([...objects, newObject]);
    logOperation(`Created object from class "${selectedClass.name}"`);
    setObjectOverrides({});
  };

  // Handle changes in object property override inputs.
  const handleOverrideChange = (propName, value) => {
    setObjectOverrides(prev => ({ ...prev, [propName]: value }));
  };

  /* MEMORY VISUALIZATION FUNCTIONS */

  // Render the blueprint (class definition) as a memory grid.
  const renderClassBlueprintMemory = () => {
    if (!selectedClass) return <div>No class selected.</div>;
    const properties = selectedClass.properties;
    if (!properties.length) return <div>No properties defined in class.</div>;
    return (
      <div className={styles.memoryGrid}>
        {properties.map((prop, index) => {
          const addr = generateAddress(index);
          let binary = "";
          if (prop.defaultValue) {
            if (prop.type === "Number") {
              binary = Number(prop.defaultValue).toString(2);
            } else if (prop.type === "String") {
              binary = prop.defaultValue.split("").map(c => c.charCodeAt(0).toString(2)).join(" ");
            } else {
              binary = "N/A";
            }
          } else {
            binary = "N/A";
          }
          return (
            <div key={index} className={styles.memoryCell}>
              <div><strong>Addr:</strong> {addr}</div>
              <div><strong>Prop:</strong> {prop.name}</div>
              <div><strong>Type:</strong> {prop.type}</div>
              <div><strong>Default:</strong> {prop.defaultValue || "None"}</div>
              <div><strong>Binary:</strong> {binary}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render object instances in a memory grid view.
  const renderObjectsMemory = () => {
    if (!selectedClass) return <div>No class selected.</div>;
    const relatedObjects = objects.filter(obj => obj.className === selectedClass.name);
    if (!relatedObjects.length) return <div>No objects created for this class.</div>;
    return (
      <div>
        {relatedObjects.map((obj, objIndex) => (
          <div key={objIndex} className={styles.objectMemory}>
            <h3>Object {objIndex + 1}</h3>
            <div className={styles.memoryGrid}>
              {Object.entries(obj.properties).map(([key, value], index) => {
                const addr = generateAddress(index);
                let binary = "";
                const prop = selectedClass.properties.find(p => p.name === key);
                if (prop) {
                  if (prop.type === "Number") {
                    binary = Number(value).toString(2);
                  } else if (prop.type === "String") {
                    binary = value.toString().split("").map(c => c.charCodeAt(0).toString(2)).join(" ");
                  } else {
                    binary = "N/A";
                  }
                } else {
                  binary = "N/A";
                }
                return (
                  <div key={index} className={styles.memoryCell}>
                    <div><strong>Addr:</strong> {addr}</div>
                    <div><strong>{key}:</strong> {value}</div>
                    <div><strong>Binary:</strong> {binary}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1>Classes & Objects Visualizer</h1>
      
      {/* Create New Class Panel */}
      <div className={styles.createClass}>
        <h2>Create New Class</h2>
        <input 
          type="text" 
          placeholder="Class Name" 
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
        />
        <button onClick={createClass}>Create Class</button>
      </div>
      
      {/* Existing Classes List */}
      <div className={styles.classList}>
        <h2>Existing Classes</h2>
        {classes.length ? (
          <table className={styles.classTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Properties</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map(cls => (
                <tr key={cls.name}>
                  <td>{cls.name}</td>
                  <td>{cls.properties.map(p => p.name).join(", ") || "None"}</td>
                  <td>
                    <button onClick={() => selectClass(cls)}>Select</button>
                    <button onClick={() => deleteClass(cls.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No classes created yet.</p>
        )}
      </div>
      
      {/* Operations on Selected Class */}
      {selectedClass && (
        <div className={styles.classOperations}>
          <h2>Operations on Class "{selectedClass.name}"</h2>
          
          {/* Add Property Panel */}
          <div className={styles.addProperty}>
            <h3>Add Property</h3>
            <input 
              type="text" 
              placeholder="Property Name" 
              value={newPropName}
              onChange={(e) => setNewPropName(e.target.value)}
            />
            <select 
              value={newPropType}
              onChange={(e) => setNewPropType(e.target.value)}
            >
              {propertyTypes.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="Default Value (optional)" 
              value={newPropValue}
              onChange={(e) => setNewPropValue(e.target.value)}
            />
            <button onClick={addProperty}>Add Property</button>
          </div>
          
          {/* List Class Properties */}
          <div className={styles.propertyList}>
            <h3>Properties of "{selectedClass.name}"</h3>
            {selectedClass.properties.length ? (
              <ul>
                {selectedClass.properties.map((prop, idx) => (
                  <li key={idx}>
                    <strong>{prop.name}</strong> ({prop.type}) {prop.defaultValue && `= ${prop.defaultValue}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No properties defined.</p>
            )}
          </div>
          
          {/* Create Object Panel */}
          <div className={styles.createObject}>
            <h3>Create Object from "{selectedClass.name}"</h3>
            {selectedClass.properties.length ? (
              <div className={styles.overrideInputs}>
                {selectedClass.properties.map((prop, idx) => (
                  <div key={idx} className={styles.overrideField}>
                    <label>{prop.name} ({prop.type}): </label>
                    <input 
                      type="text" 
                      placeholder={prop.defaultValue || "default"}
                      value={objectOverrides[prop.name] || ""}
                      onChange={(e) => handleOverrideChange(prop.name, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No properties to set.</p>
            )}
            <button onClick={createObject}>Create Object</button>
          </div>
        </div>
      )}
      
      {/* Object Instances List */}
      <div className={styles.objectList}>
        <h2>Created Objects</h2>
        {objects.length ? (
          <table className={styles.objectTable}>
            <thead>
              <tr>
                <th>Class</th>
                <th>Properties</th>
              </tr>
            </thead>
            <tbody>
              {objects.map((obj, idx) => (
                <tr key={idx}>
                  <td>{obj.className}</td>
                  <td>
                    {Object.entries(obj.properties).map(([key, value]) => (
                      <span key={key}><strong>{key}</strong>: {value}; </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No objects created yet.</p>
        )}
      </div>
      
      {/* Memory Visualization Panels */}
      {selectedClass && (
        <div className={styles.memoryVisualization}>
          <h2>Class Blueprint Memory</h2>
          {renderClassBlueprintMemory()}
          <h2>Object Memory Representation</h2>
          {renderObjectsMemory()}
        </div>
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

export default ClassesObjects;
