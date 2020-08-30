import { rollingAvg } from '@/seniority/statistics';

describe('rollingAvg', () => {
  const TEST_DATA = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9
  ];

  it('returns null below n', () => {
    expect(rollingAvg(TEST_DATA, 2, 0)).toBeNull();
    expect(rollingAvg(TEST_DATA, 2, 1)).not.toBeNull();
  });

  it('returns a number above n', () => {
    expect(rollingAvg(TEST_DATA, 2, 2)).not.toBeNaN();
  })

  it('throws error outside of array bounds', () => {
    expect(() => rollingAvg(TEST_DATA, 5, 10)).toThrowError(RangeError);
  });

  it('returns correct avg', () => {
    expect(rollingAvg(TEST_DATA, 2, 1)).toEqual(0.5);
    expect(rollingAvg(TEST_DATA, 2, 2)).toEqual(1.5);
    expect(rollingAvg(TEST_DATA, 4, 8)).toEqual(6.5);
  });

  it('uses getter to transform objects', () => {
    const newData = TEST_DATA.map(n => ({ val: n }));
    const getter = (item: { val: number }) => item.val;
    expect(rollingAvg(newData, 4, 8, getter)).toEqual(6.5);
  });
});