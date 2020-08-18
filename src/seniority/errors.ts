import { BasePilotFactory } from './pilot';

export class PilotFactoryError extends Error {
  constructor(record: any, factory: BasePilotFactory, msg?: string) {
    const message = msg ? msg : `Could not make record for ${factory.airlineInfo.name} from object: ${JSON.stringify(record)}`
    super(message);
  }
}

export class MissingPilotPropertyError extends PilotFactoryError {
  constructor(property: string, record: any, factory: BasePilotFactory) {
    const message = `property: '${property}' missing on record: ${JSON.stringify(record)}`;
    super(record, factory, message);
  }
}
