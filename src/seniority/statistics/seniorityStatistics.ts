import { countInstancesPerMonth, MonthCounter } from './monthCounter';
import { PilotRecord } from '../types';

export function calcRetirementsPerMonth(pilotRecords: PilotRecord[]): MonthCounter {
  return countInstancesPerMonth(pilotRecords.map(p => p.retireDate));
}