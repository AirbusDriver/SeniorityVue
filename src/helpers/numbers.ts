/**
 * Round a number to n decimal places
 * 
 * @param x number to round
 * @param n number of decimal places
 */
export function round(x: number, n = 1): number {
  const mult = 10 ** n;
  return Math.round(x * mult) / mult;
}