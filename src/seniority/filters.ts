import { PilotRecord, PilotRecordReducer, Seat, FilterBuilderOptions, ActiveFilterStatus } from "./types";

export type PilotFilter = (pilot: PilotRecord) => boolean;

type OnTest<T> = (test: T) => PilotFilter;

type OnReducer<T> = (test: T) => PilotRecordReducer;

type MultiFilter = (...filters: PilotFilter[]) => PilotFilter;

export const isActiveOn: OnTest<Date> = date => pilot => pilot.retireDate > date;

export const isRetiredOn: OnTest<Date> = date => pilot => !isActiveOn(date)(pilot);

export const hasFieldEqual: <K extends keyof PilotRecord, V extends PilotRecord[K]>(field: K, value: V, ignoreCase?: boolean) => PilotFilter = (field, value, ignoreCase = true) => {
  return record => ignoreCase ? record[field].toString().toUpperCase() === value.toString().toUpperCase() : record[field] === value
}

export const multiFilter: MultiFilter = (...filters) => record => {
  if (filters.length === 0) {
    return true;
  }
  return filters.every(filter => filter(record))
}

export const FilterActiveOnPilots: OnReducer<Date> = date => records => {
  const filter = isActiveOn(date);
  return records.filter(filter);
}

export const FilterRetiredOnPilots: OnReducer<Date> = date => records => {
  const filter = isRetiredOn(date);
  return records.filter(filter);
}

export const buildPilotFilter: (options: FilterBuilderOptions) => PilotFilter = (options) => {
  const filters: PilotFilter[] = [];

  if (options.activeFilter) {
    const { status, value } = options.activeFilter;
    if (!Object.values(ActiveFilterStatus).includes(status)) {
      throw new Error(`'${status}' is not a valid ActiveFilterStatus`);
    }
    const activeFilterValue = value != null ? value : new Date(Date.now());
    const activeFilter = status === 'ACTIVE' ? isActiveOn : isRetiredOn;
    filters.push(activeFilter(activeFilterValue));
  }

  if (options.seatFilter) {
    const { value } = options.seatFilter;
    if (!Object.values(Seat).includes(value)) {
      throw new Error(`'${value}' is not a valid Seat`);
    }
    const seatFilter = hasFieldEqual("seat", value);
    filters.push(seatFilter);
  }

  if (options.baseFilter) {
    const { value } = options.baseFilter;
    const baseFilter = hasFieldEqual("base", value);
    filters.push(baseFilter);
  }

  if (options.fleetFilter) {
    const { value } = options.fleetFilter;
    const fleetFilter = hasFieldEqual("fleet", value);
    filters.push(fleetFilter);
  }

  return multiFilter(...filters);
}