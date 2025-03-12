// src/utils/arrayUtils.js

export const typeSizes = {
  int: 4,
  float: 4,
  char: 1,
  bool: 1,
};

export function getBinaryRepresentation(value, dataType) {
  if (value === null || value === undefined || value === "") {
    return "Empty";
  }
  if (dataType === "int") {
    const intValue = parseInt(value, 10) || 0;
    return (intValue >>> 0).toString(2).padStart(32, "0");
  } else if (dataType === "float") {
    const floatValue = parseFloat(value) || 0;
    const floatArray = new Float32Array(1);
    floatArray[0] = floatValue;
    const uintArray = new Uint32Array(floatArray.buffer);
    return uintArray[0].toString(2).padStart(32, "0");
  } else if (dataType === "char") {
    const char = value.toString().charAt(0) || " ";
    return char.charCodeAt(0).toString(2).padStart(8, "0");
  } else if (dataType === "bool") {
    return value === "true" || value === true ? "1" : "0";
  }
  return "";
}
