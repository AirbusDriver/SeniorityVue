import { PilotRecord } from './src/seniority/types';

declare module "*dummyData.json" {
  const value: PilotRecord[];
  export default value;
}