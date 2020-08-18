import { PilotRecord, AirlineInfo, EmployeeID, Seat } from "./types";
import { PilotFactoryError, MissingPilotPropertyError } from './errors';



type parseFunction = (record: Record<string, any>) => PilotRecord;

export interface BasePilotFactory {
  airlineInfo: AirlineInfo;

  parseRecord: parseFunction;
}


export class PilotFactory implements BasePilotFactory {
  public readonly bases: string[];
  public readonly fleetTypes: string[];

  constructor(public airlineInfo: AirlineInfo) {
    this.bases = [...this.airlineInfo.bases.map(b => b.code.toUpperCase())];
    this.fleetTypes = [...airlineInfo.fleet.map(f => f.code.toUpperCase())];
  }

  parseRecord(record: Record<string, any> = {}): PilotRecord {

    return {
      employeeID: this.parseEmployeeID(record),
      base: this.parseBase(record),
      fleet: this.parseFleet(record),
      seniorityNumber: this.parseSeniorityNumber(record),
      retireDate: this.parseRetireDate(record),
      seat: this.parseSeat(record),
    }
  }

  private parseEmployeeID(record: { employeeID?: any }): EmployeeID {
    this.verifyProperty(record, 'employeeID');

    return this.formatEmployeeID(record.employeeID);
  }

  private formatEmployeeID(s: string | number): EmployeeID {
    return `${s}`.padStart(5, '0');
  }

  private parseBase(record: { base?: any }): string {
    this.verifyProperty(record, 'base');

    if (this.bases.indexOf(`${record.base}`.toUpperCase()) !== -1) {
      return `${record.base}`.toUpperCase();
    }
    throw new PilotFactoryError(record, this, `${record.base} is not an acceptable base`);
  }

  private parseFleet(record: { fleet?: any }): string {
    this.verifyProperty(record, 'fleet');

    if (this.fleetTypes.indexOf(record.fleet.toUpperCase()) !== -1) {
      return record.fleet.toUpperCase();
    }
    throw new PilotFactoryError(record, this, `${record.fleet} not in available fleet types: ${this.fleetTypes}`);
  }

  private parseSeniorityNumber(record: { seniorityNumber?: any }): number {
    this.verifyProperty(record, 'seniorityNumber');
    const recordSenNum = Number(record.seniorityNumber);
    if (Math.floor(recordSenNum) !== recordSenNum || isNaN(recordSenNum)) {
      throw new PilotFactoryError(record, this, `seniorityNumber must be an integer or string`)
    }

    return recordSenNum;
  }

  private parseRetireDate(record: { retireDate?: any }): Date {
    this.verifyProperty(record, 'retireDate');
    const { retireDate } = record;
    if (!(retireDate instanceof Date) || isNaN(retireDate.getFullYear())) {
      throw new PilotFactoryError(record, this, `${retireDate} is not a valid date`);
    }
    return retireDate;
  }

  private parseSeat(record: { seat?: any }): Seat {
    this.verifyProperty(record, 'seat');
    let { seat } = record;
    if (typeof seat === 'string') {
      seat = seat.toLocaleUpperCase();
      if (Object.keys(Seat).indexOf(seat) === -1) {
        throw new PilotFactoryError(record, this, `${seat} is not a valid seat type`);
      }
      return seat;
    }
    throw new PilotFactoryError(record, this, `'seat' property must be a string. Got: ${typeof seat}`);
  }

  private verifyProperty(record: any, property: string): void {
    if (record[property] == null) {
      throw new MissingPilotPropertyError(property, record, this);
    }
  }
}

