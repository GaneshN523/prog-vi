import React, { useState } from 'react';
import styles from './EncapsulationVisualizer.module.css';

const EncapsulationVisualizer = () => {
  // State for attribute creation
  const [attributes, setAttributes] = useState([]);
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrType, setNewAttrType] = useState("public");
  const [newAttrValue, setNewAttrValue] = useState("");

  // Simulation state
  const [objectCreated, setObjectCreated] = useState(false);
  const [accessAttr, setAccessAttr] = useState("");
  const [accessMethod, setAccessMethod] = useState("direct"); // "direct" or "getter"
  const [accessResult, setAccessResult] = useState("");
  const [consoleLog, setConsoleLog] = useState([]);
  const [subclassCreated, setSubclassCreated] = useState(false);
  const [language, setLanguage] = useState("JavaScript");

  // Helper: Append a log message
  const addLog = (message) => {
    setConsoleLog(prev => [...prev, message]);
  };

  // Helper: Convert value to binary (raw bits) for low-level view.
  const convertToBinary = (value) => {
    if (!value) return "";
    if (!isNaN(value)) {
      return parseInt(value, 10).toString(2).padStart(8, '0');
    }
    return value.split("").map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(" ");
  };

  // Handler: Add a new attribute
  const handleAddAttribute = () => {
    if(newAttrName.trim() === "") {
      alert("Attribute name cannot be empty.");
      return;
    }
    const newAttribute = {
      id: Date.now(),
      name: newAttrName,
      type: newAttrType,
      value: newAttrValue,
      hasGetter: false
    };
    setAttributes([...attributes, newAttribute]);
    setNewAttrName("");
    setNewAttrValue("");
  };

  // Handler: Toggle getter generation for a private attribute
  const toggleGetter = (attrId) => {
    setAttributes(prev =>
      prev.map(attr => {
        if(attr.id === attrId) {
          return { ...attr, hasGetter: !attr.hasGetter };
        }
        return attr;
      })
    );
  };

  // Handler: Finalize object creation (simulate instantiation)
  const handleCreateObject = () => {
    if(attributes.length === 0) {
      alert("Please add at least one attribute before creating the object.");
      return;
    }
    setObjectCreated(true);
    addLog("Object created with defined attributes.");
  };

  // Handler: Simulate attribute access
  const handleAccessAttribute = () => {
    const attr = attributes.find(a => a.name === accessAttr);
    if (!attr) {
      alert("Select a valid attribute.");
      return;
    }
    addLog(`Attempting ${accessMethod} access for ${attr.name} (${attr.type}).`);
    if(attr.type === "public" || attr.type === "protected") {
      setAccessResult(`Access Granted: Value = ${attr.value}`);
      addLog(`Success: ${attr.name} is ${attr.value}`);
    } else if(attr.type === "private") {
      if (accessMethod === "getter" && attr.hasGetter) {
        setAccessResult(`Access Granted via Getter: Value = ${attr.value}`);
        addLog(`Success: Getter retrieved value of ${attr.name}`);
      } else {
        setAccessResult(`Access Denied: Cannot access private attribute '${attr.name}' directly.`);
        addLog(`Error: Direct access denied for private attribute '${attr.name}'. Consider using a getter.`);
      }
    }
  };

  // Handler: Simulate subclass creation to demonstrate inheritance issues
  const handleCreateSubclass = () => {
    setSubclassCreated(true);
    addLog("Subclass created. Note: Protected attributes are accessible in subclasses, but private ones are not.");
  };

  // Generate high-level class code based on language selection
  const generateClassCode = () => {
    if(language === "JavaScript") {
      let code = `class MyClass {\n  constructor() {\n`;
      attributes.forEach(attr => {
        if(attr.type === "public") {
          code += `    this.${attr.name} = "${attr.value}"; // 🟢 Public\n`;
        } else if(attr.type === "private") {
          code += `    this.#${attr.name} = "${attr.value}"; // 🔴 Private\n`;
        } else if(attr.type === "protected") {
          code += `    this._${attr.name} = "${attr.value}"; // 🟡 Protected\n`;
        }
      });
      code += "  }\n\n  // Public method to access attributes\n  getAttribute(attr) {\n    return this[attr] || 'Access Denied';\n  }\n}";
      return code;
    } else if(language === "Python") {
      let code = `class MyClass:\n    def __init__(self):\n`;
      attributes.forEach(attr => {
        if(attr.type === "public") {
          code += `        self.${attr.name} = "${attr.value}"  # Public 🟢\n`;
        } else if(attr.type === "protected") {
          code += `        self._${attr.name} = "${attr.value}"  # Protected 🟡\n`;
        } else if(attr.type === "private") {
          code += `        self.__${attr.name} = "${attr.value}"  # Private 🔴\n`;
        }
      });
      code += "\n    def get_attribute(self, attr):\n        # Use getters for private attributes\n        return getattr(self, attr, 'Access Denied')";
      return code;
    } else if(language === "Java") {
      let code = "public class MyClass {\n";
      attributes.forEach(attr => {
        if(attr.type === "public") {
          code += `    public String ${attr.name} = "${attr.value}"; // 🟢 Public\n`;
        } else if(attr.type === "protected") {
          code += `    protected String ${attr.name} = "${attr.value}"; // 🟡 Protected\n`;
        } else if(attr.type === "private") {
          code += `    private String ${attr.name} = "${attr.value}"; // 🔴 Private\n`;
        }
      });
      code += "\n    public String getAttribute(String attr) {\n        // Use getters for private attributes\n        return \"Access via getter required\";\n    }\n}";
      return code;
    } else if(language === "C++") {
      let code = "class MyClass {\npublic:\n";
      attributes.forEach(attr => {
        if(attr.type === "public") {
          code += `    std::string ${attr.name} = "${attr.value}"; // 🟢 Public\n`;
        }
      });
      code += "\nprotected:\n";
      attributes.forEach(attr => {
        if(attr.type === "protected") {
          code += `    std::string ${attr.name} = "${attr.value}"; // 🟡 Protected\n`;
        }
      });
      code += "\nprivate:\n";
      attributes.forEach(attr => {
        if(attr.type === "private") {
          code += `    std::string ${attr.name} = "${attr.value}"; // 🔴 Private\n`;
        }
      });
      code += "\npublic:\n    std::string getAttribute(std::string attr) { return \"Use getter for private attributes\"; }\n};";
      return code;
    }
  };

  // Generate subclass code to illustrate inheritance behavior
  const generateSubclassCode = () => {
    if(language === "JavaScript") {
      return `class SubClass extends MyClass {\n  constructor() {\n    super();\n    // Accessing protected attribute (if exists)\n    console.log(this._example);\n    // Direct access to private attribute (e.g., this.#secret) is not allowed\n  }\n}`;
    } else if(language === "Python") {
      return `class SubClass(MyClass):\n    def __init__(self):\n        super().__init__()\n        # Protected attributes (e.g., self._example) are accessible\n        print(self._example)\n        # Private attributes (e.g., self.__secret) are not accessible`;
    } else if(language === "Java") {
      return `public class SubClass extends MyClass {\n  public SubClass() {\n    super();\n    // Protected attributes are accessible: this.example\n    // Private attributes are not directly accessible\n  }\n}`;
    } else if(language === "C++") {
      return `class SubClass : public MyClass {\npublic:\n    SubClass() {\n        // Protected members are accessible, private members are not\n    }\n};`;
    }
  };

  // Reset the entire simulation
  const handleReset = () => {
    setAttributes([]);
    setNewAttrName("");
    setNewAttrValue("");
    setNewAttrType("public");
    setObjectCreated(false);
    setAccessAttr("");
    setAccessResult("");
    setConsoleLog([]);
    setSubclassCreated(false);
    setLanguage("JavaScript");
  };

  return (
    <div className={styles.container}>
      <h1>Encapsulation Visualizer</h1>

      {/* Language Selection */}
      <div className={styles.languageSelection}>
        <label>Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={styles.select}
        >
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="C++">C++</option>
        </select>
      </div>

      {/* Step 1: Define Attributes */}
      {!objectCreated && (
        <div className={styles.attributeCreator}>
          <h2>Step 1: Define Class Attributes</h2>
          <div className={styles.formGroup}>
            <label>Attribute Name:</label>
            <input
              type="text"
              value={newAttrName}
              onChange={(e) => setNewAttrName(e.target.value)}
              placeholder="e.g., username"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Attribute Type:</label>
            <select
              value={newAttrType}
              onChange={(e) => setNewAttrType(e.target.value)}
              className={styles.select}
            >
              <option value="public">Public</option>
              <option value="protected">Protected</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Attribute Value:</label>
            <input
              type="text"
              value={newAttrValue}
              onChange={(e) => setNewAttrValue(e.target.value)}
              placeholder="e.g., JohnDoe"
              className={styles.input}
            />
          </div>
          <button className={styles.button} onClick={handleAddAttribute}>
            Add Attribute
          </button>

          {attributes.length > 0 && (
            <div className={styles.attributeList}>
              <h3>Defined Attributes:</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Getter</th>
                  </tr>
                </thead>
                <tbody>
                  {attributes.map(attr => (
                    <tr key={attr.id}>
                      <td>{attr.name}</td>
                      <td title={
                        attr.type === "public"
                          ? "Public: Accessible from anywhere. 🟢"
                          : attr.type === "protected"
                          ? "Protected: Accessible within class and subclass. 🟡"
                          : "Private: Accessible only within class (use getter for external access). 🔴"
                      }>
                        {attr.type === "public" && "🟢 Public"}
                        {attr.type === "protected" && "🟡 Protected"}
                        {attr.type === "private" && "🔴 Private"}
                      </td>
                      <td>{attr.value}</td>
                      <td>
                        {attr.type === "private" ? (
                          <label>
                            <input
                              type="checkbox"
                              checked={attr.hasGetter}
                              onChange={() => toggleGetter(attr.id)}
                            />
                            Use Getter
                          </label>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {attributes.length > 0 && (
            <button className={styles.button} onClick={handleCreateObject}>
              Create Object
            </button>
          )}
        </div>
      )}

      {/* Step 2: Object Visualization */}
      {objectCreated && (
        <div className={styles.objectVisualization}>
          <h2>Step 2: Object Created & Visualization</h2>
          <div className={styles.visualizationSection}>
            <div className={styles.highLevel}>
              <h3>High-Level Class Code</h3>
              <pre className={styles.codeBlock}>
                {generateClassCode()}
              </pre>
              <h3>Object State</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>Type</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {attributes.map(attr => (
                    <tr key={attr.id}>
                      <td>{attr.name}</td>
                      <td>{attr.type}</td>
                      <td>{attr.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.lowLevel}>
              <h3>Low-Level Memory (Binary)</h3>
              {attributes.map(attr => (
                <div key={attr.id} className={styles.memoryBlock}>
                  <strong>
                    {attr.type === "public"
                      ? "🟢 Public"
                      : attr.type === "protected"
                      ? "🟡 Protected"
                      : "🔴 Private"}{" "}
                    - {attr.name}
                  </strong>
                  <pre className={styles.codeBlock}>
                    {convertToBinary(attr.value)}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Attribute Access Simulation */}
          <div className={styles.accessSection}>
            <h2>Step 3: Attribute Access</h2>
            <div className={styles.formGroup}>
              <label>Select Attribute:</label>
              <select
                value={accessAttr}
                onChange={(e) => setAccessAttr(e.target.value)}
                className={styles.select}
              >
                <option value="">--Select--</option>
                {attributes.map(attr => (
                  <option key={attr.id} value={attr.name}>
                    {attr.name} ({attr.type})
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Access Method:</label>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    name="accessMethod"
                    value="direct"
                    checked={accessMethod === "direct"}
                    onChange={() => setAccessMethod("direct")}
                  />
                  Direct Access
                </label>
                <label>
                  <input
                    type="radio"
                    name="accessMethod"
                    value="getter"
                    checked={accessMethod === "getter"}
                    onChange={() => setAccessMethod("getter")}
                  />
                  Access via Getter
                </label>
              </div>
            </div>
            <button className={styles.button} onClick={handleAccessAttribute}>
              Access Attribute
            </button>
            {accessResult && (
              <div className={styles.result}>
                <strong>{accessResult}</strong>
              </div>
            )}
          </div>

          {/* Interactive Console Log */}
          <div className={styles.consoleLog}>
            <h3>Interactive Console Log</h3>
            <div className={styles.logArea}>
              {consoleLog.map((log, index) => (
                <div key={index} className={styles.logLine}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Inheritance Simulation */}
          <div className={styles.inheritanceSection}>
            <h2>Step 4: Inheritance Simulation</h2>
            <button className={styles.button} onClick={handleCreateSubclass}>
              Create Subclass
            </button>
            {subclassCreated && (
              <div className={styles.subclassView}>
                <h3>Subclass Code</h3>
                <pre className={styles.codeBlock}>
                  {generateSubclassCode()}
                </pre>
                <p>
                  In the subclass, note that protected attributes are accessible while private attributes remain inaccessible.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debugging Suggestions */}
      <div className={styles.debugSection}>
        <h2>Debugging Encapsulation Issues</h2>
        <ul>
          <li>
            If a private attribute is accessed directly, consider generating a getter.
          </li>
          <li>
            Use the "Access via Getter" option to safely retrieve private data.
          </li>
          <li>
            Ensure that protected attributes are accessed only within the class or subclass.
          </li>
          <li>
            Watch the console log for real-time feedback on access attempts.
          </li>
        </ul>
      </div>

      <button className={styles.button} onClick={handleReset}>
        Reset Simulation
      </button>
    </div>
  );
};

export default EncapsulationVisualizer;
