import { localService } from '@/seniority';
import "jest";
import { sum } from 'lodash';

describe("localService", () => {
  const service = localService();

  test("has 1 seniority list", () => {
    expect(service.seniorityRecordSummaries.length).toBe(1)
  });

  test("getAllSeniorityRecordSummaries returns promise with array or summaries", async () => {
    const summaries = await service.getAllSeniorityRecordSummaries();
    expect(summaries.length).toBe(1);
  });

  test('returns a good summary', async () => {
    const summaries = await service.getAllSeniorityRecordSummaries();
    const { id, recordCount, publishedDate } = summaries[0];
    expect(id).toEqual("1");
    expect(recordCount).toEqual(4056);
    expect(isNaN(publishedDate.getDate())).toBeFalsy();
  })
});


