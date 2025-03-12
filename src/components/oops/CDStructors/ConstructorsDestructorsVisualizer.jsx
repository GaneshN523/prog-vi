import React, { useState } from 'react';
import styles from './ConstructorsDestructorsVisualizer.module.css';

// Helper: Generate a simulated memory address based on object id and property index
const generateAddress = (objectId, index) => {
  return `0x${(objectId + index).toString(16)}`;
};

// Helper: Convert a string value to binary representation
const convertToBinary = (str) => {
  return str
    .split('')
    .map((char) => char.charCodeAt(0).toString(2))
    .join(' ');
};

const ConstructorsDestructorsVisualizer = () => {
  // State for defined classes: each class has { id, name, properties: string[], objects: [] }
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassProperties, setNewClassProperties] = useState('');

  // State to track the currently selected class (by index in classes array)
  const [selectedClassIndex, setSelectedClassIndex] = useState(null);

  // For object creation within a selected class:
  const [selectedConstructorType, setSelectedConstructorType] = useState('default');
  const [parameterValues, setParameterValues] = useState({}); // property -> value mapping
  const [selectedCopyObjectId, setSelectedCopyObjectId] = useState('');

  // Simulation log state (to show step-by-step messages)
  const [simLog, setSimLog] = useState([]);
  // Currently selected object for detailed visualization
  const [selectedObject, setSelectedObject] = useState(null);

  // Utility: Append a message to simulation log
  const addLog = (message) => {
    setSimLog((prev) => [...prev, message]);
  };

  // Utility: Clear the simulation log
  const clearLog = () => {
    setSimLog([]);
  };

  // ---------- CLASS DEFINITION FUNCTIONS ----------

  // Handler to add a new class
  const handleAddClass = () => {
    if (!newClassName.trim()) return;
    const properties = newClassProperties
      .split(',')
      .map((prop) => prop.trim())
      .filter((prop) => prop);
    const newClass = {
      id: Date.now(),
      name: newClassName.trim(),
      properties,
      objects: []
    };
    setClasses([...classes, newClass]);
    // Reset input fields
    setNewClassName('');
    setNewClassProperties('');
  };

  // Handler to delete a class entirely
  const handleDeleteClass = (classId) => {
    setClasses(classes.filter((cls) => cls.id !== classId));
    if (selectedClassIndex !== null && classes[selectedClassIndex].id === classId) {
      setSelectedClassIndex(null);
      setSelectedObject(null);
    }
  };

  // ---------- OBJECT CREATION FUNCTIONS ----------

  // When a class is selected from the classes table, prepare for object creation
  const handleSelectClass = (index) => {
    setSelectedClassIndex(index);
    setSelectedObject(null);
    setSelectedConstructorType('default');
    setParameterValues({});
    setSelectedCopyObjectId('');
  };

  // Handler to update parameter values for parameterized constructor
  const handleParameterChange = (prop, value) => {
    setParameterValues({ ...parameterValues, [prop]: value });
  };

  // Create an object using the selected constructor type for the chosen class
  const handleCreateObject = () => {
    if (selectedClassIndex === null) return;
    clearLog();
    const currentClass = classes[selectedClassIndex];
    const newId = Date.now();
    let newObject = null;
    addLog(`Step 1: Allocating memory for new object (id: ${newId}) for class "${currentClass.name}".`);

    if (selectedConstructorType === 'default') {
      addLog(`Step 2: Calling Default Constructor.`);
      // For default, assign a generic default value for each property
      const defaultProps = {};
      currentClass.properties.forEach((prop) => {
        defaultProps[prop] = 'Default' + prop;
      });
      newObject = {
        id: newId,
        constructorType: 'Default Constructor',
        properties: defaultProps,
        alive: true
      };
      addLog(`Step 3: Initializing properties with default values.`);
    } else if (selectedConstructorType === 'parameterized') {
      addLog(`Step 2: Calling Parameterized Constructor.`);
      const paramProps = {};
      currentClass.properties.forEach((prop) => {
        paramProps[prop] = parameterValues[prop] || 'Param' + prop;
      });
      newObject = {
        id: newId,
        constructorType: 'Parameterized Constructor',
        properties: paramProps,
        alive: true
      };
      addLog(`Step 3: Setting properties based on provided parameters.`);
    } else if (selectedConstructorType === 'copy') {
      addLog(`Step 2: Calling Copy Constructor.`);
      const original = currentClass.objects.find(
        (obj) => obj.id.toString() === selectedCopyObjectId && obj.alive
      );
      if (!original) {
        alert('Please select a valid, alive object to copy!');
        addLog(`Error: No valid object selected for copying.`);
        return;
      }
      newObject = {
        id: newId,
        constructorType: 'Copy Constructor',
        properties: { ...original.properties },
        alive: true
      };
      addLog(`Step 3: Copying properties from object id ${original.id}.`);
    }
    addLog(`Step 4: Object created successfully. Memory initialized.`);
    // Add new object to the selected class
    const updatedClasses = [...classes];
    updatedClasses[selectedClassIndex].objects.push(newObject);
    setClasses(updatedClasses);
    setSelectedObject(newObject);
    // Reset parameter inputs and copy selection
    setParameterValues({});
    setSelectedCopyObjectId('');
  };

  // ---------- OBJECT OPERATIONS ----------

  // Simulate reinitializing (re-calling the constructor) on an existing object
  const handleReinitializeObject = (obj) => {
    clearLog();
    if (!obj.alive) {
      alert('Cannot reinitialize a destroyed object.');
      return;
    }
    addLog(`Reinitializing object id ${obj.id} using its ${obj.constructorType}.`);
    let newProps = {};
    const currentClass = classes[selectedClassIndex];
    if (obj.constructorType === 'Default Constructor') {
      currentClass.properties.forEach((prop) => {
        newProps[prop] = 'Default' + prop;
      });
      addLog(`Reset properties to default values.`);
    } else if (obj.constructorType === 'Parameterized Constructor') {
      newProps = { ...obj.properties };
      addLog(`Reapplying parameterized values.`);
    } else if (obj.constructorType === 'Copy Constructor') {
      newProps = { ...obj.properties };
      addLog(`Copying properties (remains same).`);
    }
    const updatedObject = { ...obj, properties: newProps };
    // Update the object in the class's objects list
    const updatedClasses = [...classes];
    updatedClasses[selectedClassIndex].objects = updatedClasses[selectedClassIndex].objects.map((o) =>
      o.id === obj.id ? updatedObject : o
    );
    setClasses(updatedClasses);
    setSelectedObject(updatedObject);
    addLog(`Reinitialization complete. Memory updated.`);
  };

  // Simulate destructor call to destroy an object
  const handleDestroyObject = () => {
    clearLog();
    if (selectedObject) {
      addLog(`Step 1: Invoking Destructor for object id ${selectedObject.id}.`);
      const updatedObject = { ...selectedObject, alive: false };
      const updatedClasses = [...classes];
      updatedClasses[selectedClassIndex].objects = updatedClasses[selectedClassIndex].objects.map((obj) =>
        obj.id === updatedObject.id ? updatedObject : obj
      );
      setClasses(updatedClasses);
      setSelectedObject(updatedObject);
      addLog(`Step 2: Cleaning up resources and freeing memory.`);
      addLog(`Step 3: Object marked as destroyed.`);
    }
  };

  // Delete an object entirely from the class
  const handleDeleteObject = (objId) => {
    clearLog();
    addLog(`Deleting object id ${objId} from memory.`);
    const updatedClasses = [...classes];
    updatedClasses[selectedClassIndex].objects = updatedClasses[selectedClassIndex].objects.filter(
      (obj) => obj.id !== objId
    );
    setClasses(updatedClasses);
    if (selectedObject && selectedObject.id === objId) {
      setSelectedObject(null);
    }
    addLog(`Memory for object id ${objId} has been freed.`);
  };

  return (
    <div className={styles.container}>
      <h1>OOP Visualizer: Classes, Constructors &amp; Destructors</h1>

      {/* CLASS DEFINITION SECTION */}
      <div className={styles.creationSection}>
        <h2>Define a New Class</h2>
        <input
          type="text"
          placeholder="Class Name"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          className={styles.inputField}
        />
        <input
          type="text"
          placeholder="Properties (comma separated)"
          value={newClassProperties}
          onChange={(e) => setNewClassProperties(e.target.value)}
          className={styles.inputField}
        />
        <button onClick={handleAddClass} className={styles.button}>
          Add Class
        </button>
      </div>

      {/* CLASSES TABLE */}
      <div className={styles.objectsTableSection}>
        <h2>Defined Classes</h2>
        <table className={styles.objectsTable}>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Properties</th>
              <th>Object Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, index) => (
              <tr key={cls.id}>
                <td>{cls.name}</td>
                <td>{cls.properties.join(', ')}</td>
                <td>{cls.objects.length}</td>
                <td>
                  <button onClick={() => handleSelectClass(index)} className={styles.button}>
                    Manage
                  </button>
                  <button onClick={() => handleDeleteClass(cls.id)} className={styles.button}>
                    Delete Class
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* OBJECT CREATION SECTION (only if a class is selected) */}
      {selectedClassIndex !== null && (
        <div className={styles.creationSection}>
          <h2>Create Object for Class: {classes[selectedClassIndex].name}</h2>
          <div className={styles.selector}>
            <label>Constructor Type: </label>
            <select
              value={selectedConstructorType}
              onChange={(e) => setSelectedConstructorType(e.target.value)}
            >
              <option value="default">Default Constructor</option>
              <option value="parameterized">Parameterized Constructor</option>
              <option value="copy">Copy Constructor</option>
            </select>
          </div>
          {selectedConstructorType === 'parameterized' && (
            <div className={styles.parameterInputs}>
              {classes[selectedClassIndex].properties.map((prop) => (
                <div key={prop} className={styles.propertyInput}>
                  <label>{prop}: </label>
                  <input
                    type="text"
                    placeholder={prop}
                    value={parameterValues[prop] || ''}
                    onChange={(e) => handleParameterChange(prop, e.target.value)}
                    className={styles.inputField}
                  />
                </div>
              ))}
            </div>
          )}
          {selectedConstructorType === 'copy' && (
            <div className={styles.copySection}>
              <label>Select Object to Copy: </label>
              <select
                value={selectedCopyObjectId}
                onChange={(e) => setSelectedCopyObjectId(e.target.value)}
              >
                <option value="">Select Object</option>
                {classes[selectedClassIndex].objects
                  .filter((obj) => obj.alive)
                  .map((obj) => (
                    <option key={obj.id} value={obj.id}>
                      {`Object ${obj.id} (${obj.properties[classes[selectedClassIndex].properties[0]]})`}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <button onClick={handleCreateObject} className={styles.button}>
            Create Object
          </button>
        </div>
      )}

      {/* OBJECTS LIST TABLE for selected class */}
      {selectedClassIndex !== null && (
        <div className={styles.objectsTableSection}>
          <h2>Objects for Class: {classes[selectedClassIndex].name}</h2>
          <table className={styles.objectsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Constructor Type</th>
                <th>Properties</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes[selectedClassIndex].objects.map((obj) => (
                <tr key={obj.id} className={obj.alive ? '' : styles.destroyedRow}>
                  <td>{obj.id}</td>
                  <td>{obj.constructorType}</td>
                  <td>
                    {Object.entries(obj.properties)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')}
                  </td>
                  <td>{obj.alive ? 'Alive' : 'Destroyed'}</td>
                  <td>
                    <button onClick={() => setSelectedObject(obj)} className={styles.button}>
                      Select
                    </button>
                    {obj.alive && (
                      <button onClick={() => handleReinitializeObject(obj)} className={styles.button}>
                        Reinitialize
                      </button>
                    )}
                    <button onClick={() => handleDeleteObject(obj.id)} className={styles.button}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* OBJECT VISUALIZATION PANEL */}
      {selectedObject && (
        <div className={styles.visualizationSection}>
          <h2>Visualization for Object {selectedObject.id}</h2>
          <div className={styles.highLevel}>
            <h3>High-Level Representation</h3>
            <div className={styles.objectDetails}>
              <div>
                <strong>Constructor:</strong> {selectedObject.constructorType}
              </div>
              {Object.entries(selectedObject.properties).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {value}
                </div>
              ))}
              <div>
                <strong>Status:</strong> {selectedObject.alive ? 'Alive' : 'Destroyed'}
              </div>
            </div>
          </div>
          <div className={styles.lowLevel}>
            <h3>Low-Level Memory Grid</h3>
            <div className={styles.memoryGrid}>
              {Object.entries(selectedObject.properties).map(([key, value], idx) => (
                <div key={key} className={styles.memoryCell}>
                  <div>
                    <strong>Address:</strong> {generateAddress(selectedObject.id, idx)}
                  </div>
                  <div>
                    <strong>Field:</strong> {key}
                  </div>
                  <div>
                    <strong>Value:</strong> {value}
                  </div>
                  <div>
                    <strong>Binary:</strong> {convertToBinary(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {selectedObject.alive && (
            <button onClick={handleDestroyObject} className={styles.button}>
              Destroy Object (Call Destructor)
            </button>
          )}
        </div>
      )}

      {/* SIMULATION LOG PANEL */}
      <div className={styles.logSection}>
        <h2>Simulation Log</h2>
        <div className={styles.logContainer}>
          {simLog.map((msg, index) => (
            <div key={index} className={styles.logMessage}>
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConstructorsDestructorsVisualizer;
