import { useState, useRef } from "react";
import styles from "./memoryvisualizer.module.css";
import MemoryCells from "./MemoryManager/MemoryCells";
import InstructionPanel from "./InstructionManager/InstructionPanel";

// Helper functions for conversion
const asciiToBinary = (char) =>
  char.charCodeAt(0).toString(2).padStart(8, "0");

const binaryToAscii = (bin) =>
  /^[01]{8}$/.test(bin) ? String.fromCharCode(parseInt(bin, 2)) : "";

const MemoryVisualizer = () => {
  // Shared state
  const [memorySize, setMemorySize] = useState(32);
  const [memory, setMemory] = useState(Array(memorySize).fill("00000000"));
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellEditValue, setCellEditValue] = useState("");
  const [registers, setRegisters] = useState({
    R1: "00000000",
    R2: "00000000",
    PC: "00000000",
    ZF: "0",
  });
  const [programCounter, setProgramCounter] = useState(0);
  const [instructionCount, setInstructionCount] = useState(0);
  const [pipelineStage, setPipelineStage] = useState("Idle");
  const [instructionRegister, setInstructionRegister] = useState("");
  const [aluOutput, setAluOutput] = useState("");
  const [stackPointer, setStackPointer] = useState(memorySize - 1);
  const [heapPointer, setHeapPointer] = useState(memorySize > 16 ? 16 : 0);
  const [loopStack, setLoopStack] = useState([]);
  const [currentProcess, setCurrentProcess] = useState(1);
  const runInterval = useRef(null);
  const [instructionInput, setInstructionInput] = useState("");

  // Update memory size (and reset memory, pointers, registers)
  const updateMemorySize = (newSize) => {
    setMemorySize(newSize);
    setMemory(Array(newSize).fill("00000000"));
    setStackPointer(newSize - 1);
    setHeapPointer(newSize > 16 ? 16 : 0);
    setRegisters({
      R1: "00000000",
      R2: "00000000",
      PC: "00000000",
      ZF: "0",
    });
    setProgramCounter(0);
    setLoopStack([]);
    setInstructionCount(0);
  };

  // Load instructions: store each nonempty line into memory cells 0–15.
  const handleLoadInstructions = () => {
    const lines = instructionInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    const newMemory = [...memory];
    lines.forEach((line, i) => {
      if (i < 16) {
        newMemory[i] = line;
      }
    });
    setMemory(newMemory);
    setInstructionCount(lines.length);
    setProgramCounter(0);
    // Also update the PC register (displayed as binary)
    setRegisters((prev) => ({
      ...prev,
      PC: "00000000",
    }));
  };

  // Execute next instruction with a four–stage pipeline:
  // Fetch → Decode → Execute → Write Back
  const executeNextInstruction = () => {
    if (programCounter >= instructionCount) return;

    setPipelineStage("Fetch");
    const fetchedInstruction = memory[programCounter];
    setTimeout(() => {
      setInstructionRegister(fetchedInstruction);
      setPipelineStage("Decode");
      setTimeout(() => {
        const tokens = fetchedInstruction.trim().split(" ");
        setPipelineStage("Execute");
        setTimeout(() => {
          let newRegisters = { ...registers };
          let newMemory = [...memory];
          let sp = stackPointer;
          let hp = heapPointer;
          let nextPC = programCounter + 1;
          let newLoopStack = [...loopStack];
          let aluResult = "";

          switch (tokens[0]) {
            case "LOAD":
              newRegisters[tokens[1]] = newMemory[parseInt(tokens[2])];
              break;
            case "STORE":
              newMemory[parseInt(tokens[1])] = newRegisters[tokens[2]];
              break;
            case "ADD": {
              const sum =
                parseInt(newRegisters[tokens[1]], 2) +
                parseInt(newRegisters[tokens[2]], 2);
              newRegisters[tokens[1]] = sum.toString(2).padStart(8, "0");
              aluResult = sum.toString(2).padStart(8, "0");
              break;
            }
            case "SUB": {
              const diff =
                parseInt(newRegisters[tokens[1]], 2) -
                parseInt(newRegisters[tokens[2]], 2);
              newRegisters[tokens[1]] = diff.toString(2).padStart(8, "0");
              aluResult = diff.toString(2).padStart(8, "0");
              break;
            }
            case "MOV":
              newRegisters[tokens[1]] = tokens[2];
              break;
            case "CMP":
              newRegisters.ZF =
                newRegisters[tokens[1]] === newRegisters[tokens[2]] ? "1" : "0";
              break;
            case "JE":
              if (newRegisters.ZF === "1") {
                nextPC = parseInt(tokens[1]);
              }
              break;
            case "JNE":
              if (newRegisters.ZF === "0") {
                nextPC = parseInt(tokens[1]);
              }
              break;
            case "AND": {
              const result =
                parseInt(newRegisters[tokens[1]], 2) &
                parseInt(newRegisters[tokens[2]], 2);
              newRegisters[tokens[1]] = result.toString(2).padStart(8, "0");
              aluResult = result.toString(2).padStart(8, "0");
              break;
            }
            case "OR": {
              const result =
                parseInt(newRegisters[tokens[1]], 2) |
                parseInt(newRegisters[tokens[2]], 2);
              newRegisters[tokens[1]] = result.toString(2).padStart(8, "0");
              aluResult = result.toString(2).padStart(8, "0");
              break;
            }
            case "XOR": {
              const result =
                parseInt(newRegisters[tokens[1]], 2) ^
                parseInt(newRegisters[tokens[2]], 2);
              newRegisters[tokens[1]] = result.toString(2).padStart(8, "0");
              aluResult = result.toString(2).padStart(8, "0");
              break;
            }
            case "PUSH":
              newMemory[sp] = newRegisters[tokens[1]];
              sp = sp - 1;
              break;
            case "POP":
              sp = sp + 1;
              newRegisters[tokens[1]] = newMemory[sp];
              break;
            case "CALL":
              newMemory[sp] = (programCounter + 1).toString();
              sp = sp - 1;
              nextPC = parseInt(tokens[1]);
              break;
            case "RET":
              sp = sp + 1;
              nextPC = parseInt(newMemory[sp]);
              break;
            case "ALLOC":
              newRegisters[tokens[1]] = hp.toString(2).padStart(8, "0");
              hp = hp + parseInt(tokens[2]);
              break;
            case "FOR":
              newRegisters[tokens[1]] = parseInt(tokens[2], 10)
                .toString(2)
                .padStart(8, "0");
              newLoopStack.push({ start: programCounter, reg: tokens[1] });
              break;
            case "ENDFOR":
              if (newLoopStack.length > 0) {
                const currentLoop = newLoopStack[newLoopStack.length - 1];
                let counter = parseInt(newRegisters[currentLoop.reg], 2);
                counter = counter - 1;
                if (counter > 0) {
                  newRegisters[currentLoop.reg] = counter
                    .toString(2)
                    .padStart(8, "0");
                  nextPC = currentLoop.start + 1;
                } else {
                  newLoopStack.pop();
                }
              } else {
                console.log("ENDFOR without matching FOR");
              }
              break;
            default:
              console.log("Invalid Instruction:", tokens[0]);
          }

          newRegisters.PC = nextPC.toString(2).padStart(8, "0");

          setPipelineStage("Write Back");
          setTimeout(() => {
            setRegisters(newRegisters);
            setMemory(newMemory);
            setStackPointer(sp);
            setHeapPointer(hp);
            setProgramCounter(nextPC);
            setLoopStack(newLoopStack);
            setAluOutput(aluResult);
            setPipelineStage("Idle");
          }, 300);
        }, 300);
      }, 300);
    }, 300);
  };

  const runAllInstructions = () => {
    if (runInterval.current) return;
    runInterval.current = setInterval(() => {
      if (programCounter >= instructionCount) {
        clearInterval(runInterval.current);
        runInterval.current = null;
        return;
      }
      executeNextInstruction();
    }, 500);
  };

  const stopExecution = () => {
    if (runInterval.current) {
      clearInterval(runInterval.current);
      runInterval.current = null;
    }
  };

  // Determine the CSS class for memory cells based on their section
  const getCellBackgroundClass = (index) => {
    if (index < 16) return styles.codeData;
    if (index >= 16 && index < heapPointer) return styles.heap;
    if (index > stackPointer) return styles.stack;
    return styles.defaultCell;
  };

  // Update a memory cell directly via UI.
  const updateMemoryCell = () => {
    let newMemory = [...memory];
    if (selectedCell !== null) {
      let newValue = "";
      if (cellEditValue.length === 1) {
        newValue = asciiToBinary(cellEditValue);
      } else if (/^[01]{8}$/.test(cellEditValue)) {
        newValue = cellEditValue;
      } else {
        alert(
          "Please enter a single ASCII character or a valid 8-bit binary value."
        );
        return;
      }
      newMemory[selectedCell] = newValue;
      setMemory(newMemory);
      setSelectedCell(null);
      setCellEditValue("");
    }
  };

  let asciiEquivalent = "";
  if (cellEditValue.length === 1) {
    asciiEquivalent = cellEditValue;
  } else if (/^[01]{8}$/.test(cellEditValue)) {
    asciiEquivalent = binaryToAscii(cellEditValue);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>
        Advanced Memory & Execution Simulator
      </h1>
      <MemoryCells
        memory={memory}
        memorySize={memorySize}
        updateMemorySize={updateMemorySize}
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
        cellEditValue={cellEditValue}
        setCellEditValue={setCellEditValue}
        updateMemoryCell={updateMemoryCell}
        getCellBackgroundClass={getCellBackgroundClass}
        asciiEquivalent={asciiEquivalent}
      />
      <InstructionPanel
        registers={registers}
        stackPointer={stackPointer}
        heapPointer={heapPointer}
        pipelineStage={pipelineStage}
        instructionRegister={instructionRegister}
        aluOutput={aluOutput}
        currentProcess={currentProcess}
        instructionInput={instructionInput}
        setInstructionInput={setInstructionInput}
        handleLoadInstructions={handleLoadInstructions}
        executeNextInstruction={executeNextInstruction}
        runAllInstructions={runAllInstructions}
        stopExecution={stopExecution}
        programCounter={programCounter}
      />
    </div>
  );
};

export default MemoryVisualizer;
