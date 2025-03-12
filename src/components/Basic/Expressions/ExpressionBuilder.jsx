import React, { useState } from 'react';
import styles from './ExpressionBuilder.module.css';

const ExpressionBuilder = ({ variables, onEvaluateExpression }) => {
  const [tokens, setTokens] = useState([]);
  const [tokenType, setTokenType] = useState('variable'); // Options: variable, value, operator, parenthesis
  const [tokenValue, setTokenValue] = useState('');

  const operators = ['=', '+', '-', '*', '/', '%', '==', '!=', '>', '<', '>=', '<=', '&&', '||'];
  const parentheses = ['(', ')'];

  // Add a new token based on the selected type and value.
  const addToken = () => {
    if (tokenType === 'variable') {
      if (!tokenValue) {
        alert('Please select a variable.');
        return;
      }
      setTokens([...tokens, tokenValue]);
    } else if (tokenType === 'value') {
      if (!tokenValue.trim()) {
        alert('Please enter a literal value.');
        return;
      }
      // If not numeric, wrap in quotes.
      let val = tokenValue;
      if (isNaN(val)) {
        val = `"${val}"`;
      }
      setTokens([...tokens, val]);
    } else if (tokenType === 'operator') {
      if (!tokenValue) {
        alert('Please select an operator.');
        return;
      }
      setTokens([...tokens, tokenValue]);
    } else if (tokenType === 'parenthesis') {
      if (!tokenValue) {
        alert('Please select a parenthesis.');
        return;
      }
      setTokens([...tokens, tokenValue]);
    }
    setTokenValue('');
  };

  const clearExpression = () => {
    setTokens([]);
  };

  const evaluateExpr = () => {
    // Basic validation: at least three tokens and the second token must be "=".
    if (tokens.length < 3) {
      alert("Expression must be at least: variable = expression");
      return;
    }
    if (tokens[1] !== '=') {
      alert("The second token must be '=' for assignment.");
      return;
    }
    const expr = tokens.join(' ');
    onEvaluateExpression(expr);
    clearExpression();
  };

  return (
    <div className={styles.expressionBuilder}>
      <div className={styles.tokenList}>
        <h3>Expression Tokens:</h3>
        <div className={styles.tokens}>
          {tokens.map((token, index) => (
            <span key={index} className={styles.token}>
              {token}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.tokenControls}>
        <div className={styles.controlGroup}>
          <label>Token Type:</label>
          <select value={tokenType} onChange={(e) => setTokenType(e.target.value)}>
            <option value="variable">Variable</option>
            <option value="value">Literal Value</option>
            <option value="operator">Operator</option>
            <option value="parenthesis">Parenthesis</option>
          </select>
        </div>
        <div className={styles.controlGroup}>
          <label>
            {tokenType === 'variable'
              ? 'Select Variable:'
              : tokenType === 'operator'
              ? 'Select Operator:'
              : tokenType === 'parenthesis'
              ? 'Select Parenthesis:'
              : 'Enter Value:'}
          </label>
          {tokenType === 'variable' ? (
            <select value={tokenValue} onChange={(e) => setTokenValue(e.target.value)}>
              <option value="">--Select--</option>
              {variables.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          ) : tokenType === 'operator' ? (
            <select value={tokenValue} onChange={(e) => setTokenValue(e.target.value)}>
              <option value="">--Select--</option>
              {operators.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          ) : tokenType === 'parenthesis' ? (
            <select value={tokenValue} onChange={(e) => setTokenValue(e.target.value)}>
              <option value="">--Select--</option>
              {parentheses.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={tokenValue}
              onChange={(e) => setTokenValue(e.target.value)}
              placeholder="Enter literal value"
            />
          )}
        </div>
        <div className={styles.buttons}>
          <button onClick={addToken}>Add Token</button>
          <button onClick={clearExpression}>Clear Expression</button>
          <button onClick={evaluateExpr}>Evaluate Expression</button>
        </div>
      </div>
    </div>
  );
};

export default ExpressionBuilder;
