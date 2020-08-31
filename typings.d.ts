import { PilotRecord } from './src/seniority/types';

declare module "*dummyData.json" {
  const value: ({ retireDate: string } & Omit<PilotRecord, 'retireDate'>)[]
  export default value;
}