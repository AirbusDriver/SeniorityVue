import firebase from 'firebase';
import { } from 'firebase/database'
import * as fs from 'fs';
import * as fp from 'path';
import { v4 } from 'uuid';
import firebaseConfig from './firebase.config'
import { DbSeniorityListNodes, SeniorityList, PilotRecord } from './types'

const DUMMY_PILOTS_PATH = fp.resolve(__dirname + '/dummyData.json');
const DUMMY_PREFIX = `dummy-`;
const OVERRIDE = true;

if (!fs.existsSync(DUMMY_PILOTS_PATH)) {
  throw Error(`${DUMMY_PILOTS_PATH} does not exist`);
}


const app = firebase.initializeApp(firebaseConfig);
const db = app.database();


function createSeniorityList(key: string, records: { [key: string]: PilotRecord }): SeniorityList {

  const publishedDate = '2019-06-15';

  return {
    id: key,
    publishedDate,
    publishedStamp: new Date(publishedDate).valueOf(),
    recordCount: Object.keys(records).length,
  }
}

function getPilotData(path: string): { [key: string]: PilotRecord } {
  const data = fs.readFileSync(path, "utf-8");
  const pilotData: PilotRecord[] = JSON.parse(data);
  const out: { [key: string]: PilotRecord } = {};
  pilotData.forEach(item => {
    out[item.employeeID] = { ...item, retireDate: item.retireDate.substring(0, 10) };
  })
  return out;
}


function populateDummyData() {
  const newKey = `${DUMMY_PREFIX + v4()}`;

  const newRecords = getPilotData(DUMMY_PILOTS_PATH);

  const newSeniorityList = createSeniorityList(newKey, newRecords)

  console.log(`populating ${newKey}`);
  return Promise.all(
    [db.ref('seniorityLists').child(newKey).set(newSeniorityList),
    db.ref('seniorityData').child(newKey).set(newRecords)
    ])
}


async function getSeniorityLisData() {
  const snapshots = await db.ref('seniorityLists').orderByKey().once('value');
  const data = snapshots.toJSON() as DbSeniorityListNodes;

  console.log(`getting seniorityLists child nodes...`);

  const keys = Object.keys(data || {});

  console.log(`checking for dummy keys...`);

  const dummyListKeys = keys.filter(k => k.startsWith(DUMMY_PREFIX));

  if (dummyListKeys.length === 0) {
    console.log('no dummy keys found...');
    return null;
  }
  console.log(`dummy keys found => ${dummyListKeys}`);

  return Object.entries(data).reduce((acc: DbSeniorityListNodes, item) => {
    const [key, senList] = item;
    if (dummyListKeys.includes(key)) {
      return { ...acc, [key]: senList }
    }
    return acc
  }, {})
}


async function main() {

  const foundData = await getSeniorityLisData();

  if (foundData == null || OVERRIDE) {
    try {
      await populateDummyData();
    } catch (err) {
      console.error(err)
    }
  }
}

main().finally(
  () => app.delete()
);
