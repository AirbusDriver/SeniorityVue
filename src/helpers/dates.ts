export const parseDate = (date: Date | string): string => {
  let dateStr: string;
  if (date instanceof Date) {
    if (isNaN(date.getFullYear())) {
      throw new TypeError(`can not parse invalid date: ${date}`);
    }
    dateStr = date.toISOString();
  } else {
    if (!date) return "";
    dateStr = date;
  }

  const [year, month, day] = dateStr.substr(0, 10).split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export const isValidDate = (date: Date): boolean => date instanceof Date && !isNaN(+date);