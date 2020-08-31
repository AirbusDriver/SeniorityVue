import { FilterActiveOnPilots, FilterRetiredOnPilots, hasFieldEqual, multiFilter } from '@/seniority/filters';
import { makeTestData } from './seniorityUtils';
import { Seat, PilotRecord } from '@/seniority/types';


const testData = makeTestData();


describe('On Filters', () => {

  const DATE_TEST = new Date('2045');

  describe('filterActiveOnPilots', () => {

    const filter = FilterActiveOnPilots(DATE_TEST);

    const pilots = filter(testData);
    const retireDates = pilots.map(k => k.retireDate);

    it('has only active pilots', () => {
      expect(retireDates.every(d => d > DATE_TEST)).toBeTruthy();
    })

    it('has no retired pilots', () => {
      expect(retireDates.filter(d => d < DATE_TEST).length).toBe(0);
    });
  });

  describe('filterRetiredOnPilots', () => {

    const filter = FilterRetiredOnPilots(DATE_TEST);

    const pilots = filter(testData);
    const retireDates = pilots.map(k => k.retireDate);

    it('has only retired pilots', () => {
      expect(retireDates.every(d => d <= DATE_TEST)).toBeTruthy();
    })

    it('has no active pilots', () => {
      expect(retireDates.filter(d => d > DATE_TEST).length).toBe(0);
    });
  });
});


describe('Field tests', () => {
  it('filters by seat', () => {
    const captainFilter = hasFieldEqual('seat', Seat.CA);
    const pilots = testData.filter(captainFilter);

    expect(pilots.every(p => p.seat === Seat.CA)).toBeTruthy();
  })
})


describe('multiFilter', () => {
  const filter1 = jest.fn(() => true);
  const filter2 = jest.fn(() => true);
  const filter3 = jest.fn((p: PilotRecord) => p.seniorityNumber <= 100);

  const filters = [
    filter1, filter2, filter3
  ];

  const multi = multiFilter(...filters);

  beforeEach(() => {
    filters.forEach(f => f.mockClear())
  });

  it('calls all filters', () => {
    const _ = multi(testData[0]);

    filters.forEach(f => expect(f).toHaveBeenCalledWith(testData[0]));
  })

  it('applies filters', () => {
    const results = testData.filter(multi);

    filters.forEach(f => expect(f).toHaveBeenCalledTimes(testData.length));
    expect(results.length).toBe(100);
  });
})