import { cloneDeep, zip } from 'lodash';


type YearMonthKey = { year: number; month: number };

type MonthCounterData = { key: YearMonthKey; count: number };

export class MonthCounter {
  private _data: Map<number, Map<number, number>> = new Map();

  constructor() {
    this._data = new Map();
  }

  get data() {
    return cloneDeep(this._data)
  }

  get size(): number {
    return this.data.size;
  }

  /**
   * Return the earliest key with corresponding data. If the map has not had data 
   * pushed to it, throw an Error. 
   */
  get earliestKey(): YearMonthKey {
    if (this.size === 0) {
      throw new Error('can not retrieve earliest key when no data has been added')
    }
    const earliestYear = Math.min(...this._data.keys())
    const yearData = [...this.getYear(earliestYear).entries()].reduce((acc: number[], item) => {
      if (item[1] > 0) {
        return [...acc, item[0]];
      }
      return acc;
    }, []);
    const earliestMonth = Math.min(...yearData);
    return { year: earliestYear, month: earliestMonth };
  }

  get latestKey(): YearMonthKey {
    if (this.size === 0) {
      throw new Error('can not retrieve earliest key when no data has been added')
    }
    const latestYear = Math.max(...this._data.keys())
    const yearData = [...this.getYear(latestYear).entries()].reduce((acc: number[], item) => {
      if (item[1] > 0) {
        return [...acc, item[0]];
      }
      return acc;
    }, []);
    const latestMonth = Math.max(...yearData);
    return { year: latestYear, month: latestMonth };
  }


  private _makeEmptyYearMap(): Map<number, number> {
    const keys = [...Array(12).fill(null).map((_, i) => i + 1)];
    const values: number[] = [...Array(12).fill(0)];
    const items = zip(keys, values) as [number, number][];
    return new Map(items);
  }

  set(date: Date, val: number) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const yearMap = this._data.get(year) || this._makeEmptyYearMap();
    yearMap.set(month, val);
    this._data.set(year, yearMap);
  }

  incrementDate(date: Date) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const val = this.get(year, month);
    this.set(date, val + 1);
  }

  get(year: number, month: number): number {
    const yearMap = this._data.get(year) || this._makeEmptyYearMap();
    const monthVal = yearMap.get(month) || 0;
    return monthVal;
  }


  getYear(year: number): Map<number, number> {
    return this._data.get(year) || this._makeEmptyYearMap();
  }


  *iterData(options: { begin?: YearMonthKey; end?: YearMonthKey } = {}): Generator<MonthCounterData> {
    let start, stop;
    try {
      start = options.begin ? options.begin : this.earliestKey;
      stop = options.end ? options.end : this.latestKey;
    } catch (err) {
      throw new Error('start and stop must be provided if size === 0');
    }

    let { year: yIdx, month: mIdx } = start;
    const { year: yStop, month: mStop } = stop;

    if (yIdx > yStop || (yIdx === yStop && mIdx >= mStop)) {
      throw new RangeError(`start [${start}] must not be equal or greater than stop [${stop}]`)
    }

    while (yIdx < yStop || (yIdx === yStop && mIdx <= mStop)) {
      yield {
        key: { year: yIdx, month: mIdx },
        count: this.get(yIdx, mIdx),
      };
      mIdx++
      if (mIdx > 12) {
        yIdx++;
        mIdx = 1;
      }
    }
  }
}

export function countInstancesPerMonth(data: Date[]): MonthCounter {
  const map = new MonthCounter();
  for (const date of data) {
    map.incrementDate(date);
  }
  return map;
}