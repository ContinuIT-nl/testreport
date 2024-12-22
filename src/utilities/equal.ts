type Obj = { [key: string]: unknown };

/**
 * Checks equality of two values.
 *
 * @param {unknown} value1 - The first value to compare.
 * @param {unknown} value2 - The second value to compare.
 * @returns {boolean} Whether the two values are equal. Deep comparison is done for objects and arrays.
 */
export function equal(value1: unknown, value2: unknown): boolean {
  // Simple types
  if (value1 === value2) return true;

  // Arrays
  if (Array.isArray(value1)) {
    if (!Array.isArray(value2)) return false;
    if (value1.length !== value2.length) return false;
    return value1.every((elem, index) => equal(elem, value2[index]));
  }

  // Objects. We know value1 is not an array here.
  if (typeof value1 === 'object' && value1 !== null) {
    // Both need to be objects
    if (typeof value2 !== 'object' || value2 === null || Array.isArray(value2)) return false;

    // Date's are special
    if (value1 instanceof Date) return value2 instanceof Date && value1.getTime() === value2.getTime();

    // Make sure we have the same keys and that they are all equal
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);
    if (keys1.length !== keys2.length) return false;
    const keys2Set = new Set(keys2);
    return keys1.every((name) => keys2Set.has(name) && equal((value1 as Obj)[name], (value2 as Obj)[name]));
  }

  // Not equal
  return false;
}
