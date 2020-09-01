import { EmployeeID } from './types'

type IdFormatter = (id: EmployeeID) => string;

type IdFormatterOptions = { length: number; padPosition?: "start" | "end"; char?: string };

type IdFormatterFactory = (options: IdFormatterOptions) => IdFormatter;

const createIdFormatter: IdFormatterFactory = options => id => {
  const { length, padPosition, char: optChar } = options;
  const str = `${id}`;
  const char = optChar || "0";
  const padFunc = padPosition ? padPosition === 'start' ? String.prototype.padStart : String.prototype.padEnd : null;
  if (padFunc != null && length == null) {
    throw new Error('if padding location is provided, a length must also be provided');
  }
  if (typeof padFunc === "function") {
    return padFunc.bind(str)(length, char);
  }
  return str;
}

export const employeeIdFormatter = createIdFormatter({ length: 5, char: "0", padPosition: "start" });

export const employeeIdEqual: (a: EmployeeID, b: EmployeeID) => boolean = (a, b) => {
  return employeeIdFormatter(a) === employeeIdFormatter(b);
}
