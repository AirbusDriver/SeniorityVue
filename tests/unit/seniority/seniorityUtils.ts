import dummyData from '@/seniority/dummyData.json';
import { PilotRecord } from '@/seniority/types';


export const makeTestData: () => PilotRecord[] = () => dummyData.map(rec => ({ ...rec, retireDate: new Date(Date.parse(rec.retireDate)) } as PilotRecord));