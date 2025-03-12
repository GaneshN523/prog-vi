import React, { useState, useEffect } from "react";
import styles from "./FunctionSimulator.module.css";

const FunctionSimulator = () => {
  // --- States for function definition ---
  const [returnType, setReturnType] = useState("void");
  const [numParams, setNumParams] = useState(0);
  const [params, setParams] = useState([]); // each: { name, type }
  const [isRecursive, setIsRecursive] = useState(false);

  // --- States for function call ---
  const [callArgs, setCallArgs] = useState([]); // strings that will be converted per param type
  const [returnVariable, setReturnVariable] = useState({ name: "result", type: "number" });

  // --- States for simulation output ---
  const [generatedCode, setGeneratedCode] = useState("");
  const [simulationOutput, setSimulationOutput] = useState("");
  const [memoryGrid, setMemoryGrid] = useState([]); // simulated call frames
  const [pipelineSteps, setPipelineSteps] = useState([]); // simulated CPU pipeline steps
  const [rawBitsRepresentation, setRawBitsRepresentation] = useState({ assembly: "", rawBits: "" });

  // --- Adjust parameters array when number changes ---
  useEffect(() => {
    let newParams = [...params];
    if (numParams > newParams.length) {
      for (let i = newParams.length; i < numParams; i++) {
        newParams.push({ name: `param${i + 1}`, type: "number" });
      }
    } else if (numParams < newParams.length) {
      newParams = newParams.slice(0, numParams);
    }
    setParams(newParams);
  }, [numParams]);

  // --- Adjust callArgs array to match number of parameters ---
  useEffect(() => {
    let newCallArgs = [...callArgs];
    if (numParams > newCallArgs.length) {
      for (let i = newCallArgs.length; i < numParams; i++) {
        newCallArgs.push("");
      }
    } else if (numParams < newCallArgs.length) {
      newCallArgs = newCallArgs.slice(0, numParams);
    }
    setCallArgs(newCallArgs);
  }, [numParams]);

  // --- Update return variable when returnType changes ---
  useEffect(() => {
    setReturnVariable((prev) => ({
      ...prev,
      type: returnType,
      name: returnType !== "void" ? prev.name || "result" : "",
    }));
  }, [returnType]);

  // --- Generate the function code based on user selections ---
  const generateFunctionCode = () => {
    const paramList = params.map((p) => p.name || "param").join(", ");
    let body = "";
    // For a recursive function with one numeric parameter, use a factorial‑like example.
    if (isRecursive && numParams === 1 && params[0].type === "number") {
      body = `
  if (${params[0].name} <= 1) {
    return 1;
  } else {
    return ${params[0].name} * simulatedFunction(${params[0].name} - 1);
  }`.trim();
    } else {
      // Otherwise, use a default implementation based on the return type.
      if (returnType === "number") {
        body = "return 42;";
      } else if (returnType === "string") {
        body = `return "Hello World";`;
      } else if (returnType === "boolean") {
        body = "return true;";
      } else {
        body = "console.log('Function executed');";
      }
    }
    // Create a function expression (wrapped later via eval) with a name so recursion works.
    return `function simulatedFunction(${paramList}) {
  ${body}
}`;
  };

  // --- Simulate raw bits and assembly-level breakdown ---
  const simulateRawBitsRepresentation = (codeStr) => {
    // Build a dummy assembly-level breakdown.
    const assemblyLines = [];
    assemblyLines.push("; Assembly-level breakdown for simulatedFunction");
    assemblyLines.push("push ebp");
    assemblyLines.push("mov ebp, esp");
    assemblyLines.push("; Function body simulation:");
    const codeLines = codeStr.split("\n").map(line => line.trim()).filter(line => line !== "");
    let address = 0x1000;
    codeLines.forEach(line => {
      // Each line gets a fake address and instruction listing.
      assemblyLines.push(`${address.toString(16)}: ${line}`);
      address += 4;
    });
    assemblyLines.push("pop ebp");
    assemblyLines.push("ret");

    // Build raw bits (binary representation of each character).
    let rawBits = "";
    for (let i = 0; i < codeStr.length; i++) {
      let binary = codeStr.charCodeAt(i).toString(2);
      // Pad binary to 8 bits.
      binary = "00000000".slice(binary.length) + binary;
      rawBits += binary + " ";
    }
    return { assembly: assemblyLines.join("\n"), rawBits: rawBits.trim() };
  };

  // --- Run the simulation ---
  const runSimulation = () => {
    const codeStr = generateFunctionCode();
    setGeneratedCode(codeStr);
    // Update Raw Bits Representation.
    setRawBitsRepresentation(simulateRawBitsRepresentation(codeStr));

    let output = "Generated Function:\n" + codeStr + "\n\n";
    try {
      // Evaluate the function code as an expression by wrapping it in parentheses.
      const func = eval(`(${codeStr})`);
      // Convert callArgs into proper types based on each parameter's type.
      const convertedArgs = callArgs.map((arg, index) => {
        const type = params[index].type;
        if (type === "number") return parseFloat(arg) || 0;
        if (type === "boolean") return arg.toLowerCase() === "true";
        return arg;
      });

      // Build pipeline simulation steps.
      const pipeline = [];
      pipeline.push("Fetch: Retrieved function code from memory.");
      pipeline.push("Decode: Parsed function code into tokens.");
      pipeline.push(
        `Execute: Calling simulatedFunction with arguments: ${JSON.stringify(
          convertedArgs
        )}.`
      );

      // Call the function.
      const result = func(...convertedArgs);
      if (returnType !== "void") {
        pipeline.push(`Write Back: Stored returned value in variable "${returnVariable.name}".`);
      }
      setPipelineSteps(pipeline);

      // Build a simple memory grid simulation.
      let memory;
      if (isRecursive && numParams === 1 && params[0].type === "number") {
        // For recursion, simulate a call stack with depth equal to the input value.
        const depth = convertedArgs[0];
        memory = [];
        for (let i = 1; i <= depth; i++) {
          memory.push({
            frame: `Frame ${i}`,
            variables: {
              [params[0].name]: i,
            },
          });
        }
      } else {
        // Otherwise, just one frame with parameters and (if applicable) the return variable.
        memory = [
          {
            frame: "Frame 1",
            variables: {
              ...params.reduce((acc, p, i) => {
                acc[p.name] = convertedArgs[i];
                return acc;
              }, {}),
              ...(returnType !== "void" ? { [returnVariable.name]: result } : {}),
            },
          },
        ];
      }
      setMemoryGrid(memory);

      output +=
        "Function call result: " +
        (returnType !== "void" ? result : "Function executed (void).");
    } catch (err) {
      output += "\nError during simulation: " + err.message;
    }
    setSimulationOutput(output);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Function Visualizer and Simulator</h2>

      {/* --- Function Definition Section --- */}
      <div className={`${styles.section}`}>
        <h3>Function Definition</h3>
        <div className={styles.inputRow}>
          <label className={styles.label}>Return Type:</label>
          <select
            value={returnType}
            onChange={(e) => setReturnType(e.target.value)}
            className={styles.select}
          >
            <option value="void">void</option>
            <option value="number">number</option>
            <option value="string">string</option>
            <option value="boolean">boolean</option>
          </select>
        </div>
        <div className={styles.inputRow}>
          <label className={styles.label}>Number of Parameters:</label>
          <input
            type="number"
            value={numParams}
            min="0"
            onChange={(e) => setNumParams(parseInt(e.target.value, 10) || 0)}
            className={styles.input}
          />
        </div>
        {params.map((param, index) => (
          <div key={index} className={styles.inputRow}>
            <label>Param {index + 1} Name:</label>
            <input
              type="text"
              value={param.name}
              onChange={(e) => {
                const newParams = [...params];
                newParams[index].name = e.target.value;
                setParams(newParams);
              }}
              className={styles.input}
            />
            <label>Type:</label>
            <select
              value={param.type}
              onChange={(e) => {
                const newParams = [...params];
                newParams[index].type = e.target.value;
                setParams(newParams);
              }}
              className={styles.select}
            >
              <option value="number">number</option>
              <option value="string">string</option>
              <option value="boolean">boolean</option>
            </select>
          </div>
        ))}
        <div className={styles.inputRow}>
          <label className={styles.label}>Is Recursive?</label>
          <input
            type="checkbox"
            checked={isRecursive}
            onChange={(e) => setIsRecursive(e.target.checked)}
          />
        </div>
      </div>

      {/* --- Function Call Arguments Section --- */}
      <div className={`${styles.section}`}>
        <h3>Function Call Arguments</h3>
        {params.map((param, index) => (
          <div key={index} className={styles.inputRow}>
            <label>
              {param.name} ({param.type}):
            </label>
            <input
              type="text"
              value={callArgs[index] || ""}
              onChange={(e) => {
                const newArgs = [...callArgs];
                newArgs[index] = e.target.value;
                setCallArgs(newArgs);
              }}
              className={styles.input}
            />
          </div>
        ))}
        {returnType !== "void" && (
          <div className={styles.inputRow}>
            <h4>Return Variable</h4>
            <label className={styles.label}>Variable Name:</label>
            <input
              type="text"
              value={returnVariable.name}
              onChange={(e) =>
                setReturnVariable({ ...returnVariable, name: e.target.value })
              }
              className={styles.input}
            />
            <label>Type:</label>
            <select
              value={returnVariable.type}
              onChange={(e) =>
                setReturnVariable({ ...returnVariable, type: e.target.value })
              }
              className={styles.select}
            >
              <option value="number">number</option>
              <option value="string">string</option>
              <option value="boolean">boolean</option>
            </select>
          </div>
        )}
      </div>

      {/* --- Run Simulation Button --- */}
      <button onClick={runSimulation} className={styles.button}>
        Run Simulation
      </button>

      {/* --- Simulation Output Section --- */}
      <div className={styles.outputBlock}>
        <h3>Simulation Output:</h3>
        <code>{simulationOutput}</code>
      </div>

      {/* --- Generated Function Code Display --- */}
      {generatedCode && (
        <div className={styles.codeBlock}>
          <h3>Generated Function Code:</h3>
          <code>{generatedCode}</code>
        </div>
      )}

      {/* --- Pipeline Visualization --- */}
      {pipelineSteps.length > 0 && (
        <div className={styles.pipelineList}>
          <h3>Pipeline Steps:</h3>
          <ul>
            {pipelineSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Memory Grid --- */}
      {memoryGrid.length > 0 && (
        <div className={styles.section}>
          <h3>Memory Grid:</h3>
          <table className={styles.memoryTable}>
            <thead>
              <tr>
                <th>Frame</th>
                <th>Variables</th>
              </tr>
            </thead>
            <tbody>
              {memoryGrid.map((frame, index) => (
                <tr key={index}>
                  <td>{frame.frame}</td>
                  <td>
                    {Object.entries(frame.variables).map(([varName, value]) => (
                      <div key={varName}>
                        <strong>{varName}</strong>: {value.toString()}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Raw Bits & Assembly-Level Breakdown --- */}
      {rawBitsRepresentation.assembly && (
        <div className={styles.section}>
          <h3>Assembly-Level Breakdown:</h3>
          <pre className={styles.preformatted}>{rawBitsRepresentation.assembly}</pre>
          <h3>Raw Bits Representation:</h3>
          <pre className={styles.preformatted}>{rawBitsRepresentation.rawBits}</pre>
        </div>
      )}
    </div>
  );
};

export default FunctionSimulator;
