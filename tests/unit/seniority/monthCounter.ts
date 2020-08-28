import { MonthCounter, countInstancesPerMonth } from '@/seniority/statistics/monthCounter';


describe('countInstancesPerMonth', () => {
  const TEST_DATA = [
    new Date('2020-01-01'),
    new Date('2022-01-15'),
    new Date('2020-01-15'),
    new Date('2022-02-01')
  ]

  test('returns correct data', () => {
    const results = countInstancesPerMonth(TEST_DATA);

    expect(results.get(2020, 1)).toEqual(2);
    expect(results.get(2022, 1)).toEqual(1);
    expect(results.get(2022, 2)).toEqual(1);
  });
});

describe('MonthCounter', () => {
  it('sets/gets data', () => {
    const map = new MonthCounter();
    map.set(new Date('2020-01'), 5);

    expect(map.get(2020, 1)).toEqual(5);
  })

  it('returns 0 for empty month', () => {
    const map = new MonthCounter();
    expect(map.get(2020, 1)).toEqual(0);
  })

  it('gets all month data when omitting month', () => {
    const map = new MonthCounter();

    map.set(new Date('2020-06-01'), 1);
    map.set(new Date('2020-05-01'), 2);

    const yearMap = map.getYear(2020);

    expect(yearMap.get(5)).toEqual(2);
    expect(yearMap.get(6)).toEqual(1);
    expect(yearMap.get(1)).toEqual(0);
    expect(yearMap.size).toEqual(12);
  });

  it('allows for arbitrary lookup', () => {
    expect(new MonthCounter().get(2020, 1)).toBe(0);
  });

  describe('properties', () => {
    const map = new MonthCounter();

    map.set(new Date('2020-06-2'), 1);
    map.set(new Date('2020-05-3'), 2);
    map.set(new Date('2021-01-01'), 3);

    it('retrieves eariestKey', () => {
      expect(map.earliestKey).toEqual({ year: 2020, month: 5 })
    });

    it('retrieves the latestKey', () => {
      expect(map.latestKey).toEqual({ year: 2021, month: 1 });
    });

  });


  describe('iteration', () => {
    const map = new MonthCounter();

    map.set(new Date('2020-01'), 5);
    map.set(new Date('2019-10'), 1);

    it('iterates over data from min key to max key with no options', () => {

      const results = [...map.iterData()];
      const keys = results.map(k => k.key);

      expect(keys).toContainEqual({ year: 2020, month: 1 });
      expect(keys).toContainEqual({ year: 2019, month: 10 });
      expect(results.length).toBe(4);
    });

    it('iterates over data from min key to options.end', () => {
      const results = [...map.iterData({ end: { year: 2020, month: 3 } })];
      const keys = results.map(k => k.key);

      expect(keys.length).toBe(6);
      expect(keys).toContainEqual({ year: 2020, month: 3 });
      expect(keys).not.toContainEqual({ year: 2020, month: 4 });
      expect(keys).toContainEqual(map.earliestKey);
    });

    it('iterates over data from options.being to lastestKey', () => {
      const results = [...map.iterData({ begin: { year: 2019, month: 8 } })];
      const keys = results.map(k => k.key);

      expect(keys.length).toBe(6);
      expect(keys).toContainEqual({ year: 2019, month: 8 });
      expect(keys).not.toContainEqual({ year: 2019, month: 7 });
      expect(keys).toContainEqual(map.latestKey);
    });

    it('throws error for out of bounds keys', () => {
      expect(() => [...map.iterData({ begin: { year: 2030, month: 1 } })]).toThrow();
      expect(() => [...map.iterData({ end: { year: 2010, month: 1 } })]).toThrow();
      expect(() => [...new MonthCounter().iterData()]).toThrow();
    });
  });
})