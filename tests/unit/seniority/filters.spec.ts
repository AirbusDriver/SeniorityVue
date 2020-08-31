import { FilterActiveOnPilots, FilterRetiredOnPilots, hasFieldEqual, multiFilter, buildPilotFilter, ActiveFilterStatus, FilterBuilderOptions } from '@/seniority/filters';
import { makeTestData } from './seniorityUtils';
import { Seat, PilotRecord } from '@/seniority/types';
import { has } from 'lodash';


const testData = makeTestData();


describe('active/retiredOn filters', () => {

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


describe('hasFieldEqual', () => {
  it('filters by seat', () => {
    const captainFilter = hasFieldEqual('seat', Seat.CA);
    const pilots = testData.filter(captainFilter);

    expect(pilots.every(p => p.seat === Seat.CA)).toBeTruthy();
  })

  it('ignores case', () => {
    const baseFilter = hasFieldEqual("base", "mco");
    const pilots = testData.filter(baseFilter);
    expect(pilots.every(p => p.base === "MCO")).toBeTruthy();
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

describe('buildPilotFilter', () => {
  it('filters active', () => {
    const status = ActiveFilterStatus.ACTIVE;
    const value = new Date('2030');
    const filter = buildPilotFilter({ activeFilter: { status, value } });

    const results = testData.filter(filter);

    expect(results.every(k => k.retireDate > value));
    expect(results.filter(k => k.retireDate <= value).length).toBe(0);
  });

  it('filters active today when value not provided', () => {
    const oldDateNow = global.Date.now;
    try {
      const now = new Date('2030-01-01');
      global.Date.now = jest.fn(() => +now);

      const status = ActiveFilterStatus.ACTIVE;

      const filter = buildPilotFilter({ activeFilter: { status: ActiveFilterStatus.RETIRED } })

      const results = testData.filter(filter);
      expect(results.every(p => p.retireDate <= now)).toBeTruthy();
      expect(global.Date.now).toBeCalled();

    } finally {
      global.Date.now = oldDateNow
    }
  });

  it('filters for multiple options', () => {

    const activeFilterValue = new Date('2035');

    const filterOptions: FilterBuilderOptions = {
      activeFilter: {
        status: ActiveFilterStatus.ACTIVE,
        value: activeFilterValue,
      },
      seatFilter: {
        value: Seat.FO
      },
      fleetFilter: {
        value: "320"
      },
      baseFilter: {
        value: "BOS"
      }
    }

    const filter = buildPilotFilter(filterOptions);

    const results = testData.filter(filter);

    expect(results.every(p => p.retireDate > activeFilterValue)).toBeTruthy();
    expect(results.every(p => p.base === "BOS")).toBeTruthy();
    expect(results.every(p => p.fleet === "320")).toBeTruthy();
    expect(results.every(p => p.seat === Seat.FO)).toBeTruthy();
  });
})