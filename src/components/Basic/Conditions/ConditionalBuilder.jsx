import React, { useState } from 'react';
import styles from './ConditionalBuilder.module.css';

const ConditionalBuilder = ({ variables, onEvaluateConditional }) => {
  const [condType, setCondType] = useState('if'); // Options: if, ifElseIf, ternary, switch

  // For "if" and "ifElseIf"
  const [ifCondition, setIfCondition] = useState('');
  const [ifBlock, setIfBlock] = useState('');

  // For "ifElseIf"
  const [elseIfBlocks, setElseIfBlocks] = useState([]); // Array of { condition, block }
  const [elseBlock, setElseBlock] = useState('');

  // For "ternary"
  const [ternaryCondition, setTernaryCondition] = useState('');
  const [trueExpr, setTrueExpr] = useState('');
  const [falseExpr, setFalseExpr] = useState('');

  // For "switch"
  const [switchExpression, setSwitchExpression] = useState('');
  const [switchCases, setSwitchCases] = useState([]); // Array of { caseValue, code }
  const [defaultCase, setDefaultCase] = useState('');

  // Functions to add or remove else-if blocks.
  const addElseIfBlock = () => {
    setElseIfBlocks([...elseIfBlocks, { condition: '', block: '' }]);
  };

  const removeElseIfBlock = (index) => {
    const newBlocks = elseIfBlocks.filter((_, i) => i !== index);
    setElseIfBlocks(newBlocks);
  };

  // Functions to add or remove switch cases.
  const addSwitchCase = () => {
    setSwitchCases([...switchCases, { caseValue: '', code: '' }]);
  };

  const removeSwitchCase = (index) => {
    const newCases = switchCases.filter((_, i) => i !== index);
    setSwitchCases(newCases);
  };

  // Build the complete conditional code string.
  const buildConditionalCode = () => {
    let codeStr = '';
    if (condType === 'if') {
      codeStr = `if (${ifCondition}) {\n  ${ifBlock}\n}`;
    } else if (condType === 'ifElseIf') {
      codeStr = `if (${ifCondition}) {\n  ${ifBlock}\n}`;
      elseIfBlocks.forEach((block) => {
        codeStr += ` else if (${block.condition}) {\n  ${block.block}\n}`;
      });
      if (elseBlock.trim() !== '') {
        codeStr += ` else {\n  ${elseBlock}\n}`;
      }
    } else if (condType === 'ternary') {
      codeStr = `result = (${ternaryCondition}) ? (${trueExpr}) : (${falseExpr});`;
    } else if (condType === 'switch') {
      codeStr = `switch (${switchExpression}) {\n`;
      switchCases.forEach((c) => {
        codeStr += `  case ${c.caseValue}:\n    ${c.code}\n    break;\n`;
      });
      if (defaultCase.trim() !== '') {
        codeStr += `  default:\n    ${defaultCase}\n    break;\n`;
      }
      codeStr += `}`;
    }
    return codeStr;
  };

  const handleEvaluate = (e) => {
    e.preventDefault();
    const codeStr = buildConditionalCode();
    if (!codeStr.trim()) {
      alert("Please build a valid conditional statement.");
      return;
    }
    onEvaluateConditional(codeStr);
  };

  return (
    <div className={styles.conditionalBuilder}>
      <form onSubmit={handleEvaluate}>
        <div className={styles.formGroup}>
          <label>Conditional Type:</label>
          <select value={condType} onChange={(e) => setCondType(e.target.value)}>
            <option value="if">if</option>
            <option value="ifElseIf">if – else if – else</option>
            <option value="ternary">Ternary Operator</option>
            <option value="switch">Switch Statement</option>
          </select>
        </div>

        { (condType === 'if' || condType === 'ifElseIf') && (
          <>
            <div className={styles.formGroup}>
              <label>if Condition (e.g., a &gt; 5):</label>
              <input 
                type="text"
                value={ifCondition}
                onChange={(e) => setIfCondition(e.target.value)}
                placeholder="Enter if condition"
              />
            </div>
            <div className={styles.formGroup}>
              <label>if Block (multi-line):</label>
              <textarea
                value={ifBlock}
                onChange={(e) => setIfBlock(e.target.value)}
                placeholder="Code to execute if condition is true"
                rows={3}
              />
            </div>
          </>
        )}

        { condType === 'ifElseIf' && (
          <>
            <div className={styles.formGroup}>
              <label>Else If Blocks:</label>
              {elseIfBlocks.map((block, index) => (
                <div key={index} className={styles.elseIfBlock}>
                  <input
                    type="text"
                    value={block.condition}
                    onChange={(e) => {
                      const newBlocks = [...elseIfBlocks];
                      newBlocks[index].condition = e.target.value;
                      setElseIfBlocks(newBlocks);
                    }}
                    placeholder="Else if condition"
                  />
                  <textarea
                    value={block.block}
                    onChange={(e) => {
                      const newBlocks = [...elseIfBlocks];
                      newBlocks[index].block = e.target.value;
                      setElseIfBlocks(newBlocks);
                    }}
                    placeholder="Code to execute"
                    rows={2}
                  />
                  <button type="button" onClick={() => removeElseIfBlock(index)}>
                    Delete
                  </button>
                </div>
              ))}
              <button type="button" onClick={addElseIfBlock}>
                Add Else If
              </button>
            </div>
            <div className={styles.formGroup}>
              <label>Else Block (optional):</label>
              <textarea
                value={elseBlock}
                onChange={(e) => setElseBlock(e.target.value)}
                placeholder="Code to execute if no condition is true"
                rows={3}
              />
            </div>
          </>
        )}

        { condType === 'ternary' && (
          <>
            <div className={styles.formGroup}>
              <label>Ternary Condition (e.g., a &gt; 5):</label>
              <input 
                type="text"
                value={ternaryCondition}
                onChange={(e) => setTernaryCondition(e.target.value)}
                placeholder="Enter condition"
              />
            </div>
            <div className={styles.formGroup}>
              <label>True Expression (e.g., 10):</label>
              <input 
                type="text"
                value={trueExpr}
                onChange={(e) => setTrueExpr(e.target.value)}
                placeholder="Value if true"
              />
            </div>
            <div className={styles.formGroup}>
              <label>False Expression (e.g., 0):</label>
              <input 
                type="text"
                value={falseExpr}
                onChange={(e) => setFalseExpr(e.target.value)}
                placeholder="Value if false"
              />
            </div>
          </>
        )}

        { condType === 'switch' && (
          <>
            <div className={styles.formGroup}>
              <label>Switch Expression (e.g., a):</label>
              <input 
                type="text"
                value={switchExpression}
                onChange={(e) => setSwitchExpression(e.target.value)}
                placeholder="Enter switch expression"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Case Blocks:</label>
              {switchCases.map((c, index) => (
                <div key={index} className={styles.caseBlock}>
                  <input
                    type="text"
                    value={c.caseValue}
                    onChange={(e) => {
                      const newCases = [...switchCases];
                      newCases[index].caseValue = e.target.value;
                      setSwitchCases(newCases);
                    }}
                    placeholder="Case value"
                  />
                  <textarea
                    value={c.code}
                    onChange={(e) => {
                      const newCases = [...switchCases];
                      newCases[index].code = e.target.value;
                      setSwitchCases(newCases);
                    }}
                    placeholder="Code to execute for this case"
                    rows={2}
                  />
                  <button type="button" onClick={() => removeSwitchCase(index)}>
                    Delete
                  </button>
                </div>
              ))}
              <button type="button" onClick={addSwitchCase}>
                Add Case
              </button>
            </div>
            <div className={styles.formGroup}>
              <label>Default Case (optional):</label>
              <textarea
                value={defaultCase}
                onChange={(e) => setDefaultCase(e.target.value)}
                placeholder="Code to execute if no case matches"
                rows={3}
              />
            </div>
          </>
        )}

        <button type="submit" className={styles.button}>
          Evaluate Conditional
        </button>
      </form>
    </div>
  );
};

export default ConditionalBuilder;
