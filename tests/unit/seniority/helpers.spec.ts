import { employeeIdEqual, employeeIdFormatter } from '@/seniority/helpers'


describe.each([
  [123, '00123'],
  ['123', '00123'],
  ['1', '00001']
])('employeeIds %s and %s ', (a, b) => {
  it('compare equal', () => {
    expect(employeeIdEqual(a, b)).toBeTruthy();
  });

  it('format correctly', () => {
    expect(employeeIdFormatter(a)).toEqual(b);
  })
});