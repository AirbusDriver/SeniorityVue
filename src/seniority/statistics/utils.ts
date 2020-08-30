


/**
 * Return the rolling average of a the last 'n' items in an array,
 * inclusive of the current value 'idx'. 
 * 
 * @param arr array of numbers
 * @param n avg of last 'n' numbers, value at idx included
 * @param idx item of array to end with
 * @param getter callable that transforms value to number if needed
 * @returns null if there are too few items to average, or the rolling average at index 'idx'
 * @throws RangeError - if idx not an index on the array
 */
function rollingAvg<T>(arr: T[], n: number, idx: number, getter?: (item: T) => number): number | null {
  if (idx + 1 - n < 0) {
    return null;
  }
  if (n >= arr.length || idx >= arr.length) {
    throw new RangeError(`'idx' and 'n' must not be greater than arr.length`);
  }

  const data = arr.slice(idx - n + 1, idx + 1);
  let unpacked: number[];

  if (typeof getter === 'function') {
    unpacked = data.map(getter);
  } else {
    unpacked = data as unknown as number[];
  }

  const sum = unpacked.reduce((a, b) => a + b, 0);
  const avg = sum / n;
  if (isNaN(avg)) {
    throw TypeError(`got NaN. Make sure you are passing an array of numbers or a getter to transform the items to numbers`);
  }
  return avg;
}

export { rollingAvg }