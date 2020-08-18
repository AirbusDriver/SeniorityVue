import { AirlineInfo } from './types';


export const JetblueInfo: AirlineInfo = {
  bases: [
    { code: "BOS", city: "Boston" },
    { code: "JFK", city: "New York City" },
    { code: "FLL", city: "Fort Lauderdale" },
    { code: "MCO", city: "Orlando" },
    { code: "LGB", city: "Long Beach" },
  ],
  name: "JetBlue Airways",
  fleet: [
    { code: "320", name: "Airbus A320" },
    { code: "190", name: "Embraer E190" },
  ]
}