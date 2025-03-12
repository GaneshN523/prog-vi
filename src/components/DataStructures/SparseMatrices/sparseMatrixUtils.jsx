// src/utils/sparseMatrixUtils.js

// Convert a dense (2D) matrix into a COO (Coordinate List) representation.
export function denseToCOO(denseMatrix) {
    const coo = [];
    for (let i = 0; i < denseMatrix.length; i++) {
      for (let j = 0; j < denseMatrix[0].length; j++) {
        const value = Number(denseMatrix[i][j]);
        if (value !== 0) {
          coo.push({ i, j, value });
        }
      }
    }
    return coo;
  }
  
  // Convert a COO representation back into a dense matrix.
  export function cooToDense(coo, rows, cols) {
    const dense = Array.from({ length: rows }, () => Array(cols).fill(0));
    coo.forEach(({ i, j, value }) => {
      dense[i][j] = value;
    });
    return dense;
  }
  
  // Dummy conversion functions for simulation purposes.
  export function convertCOOToCSR(coo, rows, cols) {
    // In a real implementation, you would compute row pointers, etc.
    return coo;
  }
  
  export function convertCOOToCSC(coo, rows, cols) {
    return coo;
  }
  
  // Return a dummy binary representation of a number (assumed integer).
  export function getBinaryRepresentation(value) {
    const intValue = parseInt(value, 10) || 0;
    return (intValue >>> 0).toString(2).padStart(32, "0");
  }
  