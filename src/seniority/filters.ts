import { PilotRecord, PilotRecordReducer } from "./types";

type PilotFilter = (pilot: PilotRecord) => boolean;

type OnTest<T> = (test: T) => PilotFilter;

type OnReducer<T> = (test: T) => PilotRecordReducer;

type MultiFilter = (...filters: PilotFilter[]) => PilotFilter;

export const isActiveOn: OnTest<Date> = date => pilot => pilot.retireDate > date;

export const isRetiredOn: OnTest<Date> = date => pilot => !isActiveOn(date)(pilot);

export const hasFieldEqual: <K extends keyof PilotRecord, V extends PilotRecord[K]>(field: K, value: V) => PilotFilter = (field, value) => record => record[field] === value

export const multiFilter: MultiFilter = (...filters) => record => {
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
