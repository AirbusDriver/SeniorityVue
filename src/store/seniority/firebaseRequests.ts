import db from "@/db";
import { PilotRecord, SeniorityRecord } from '@/seniority/types';
import { DbSeniorityListsNodeItem, DbSeniorityDataNodeItem, DbSeniorityListsNode, DbSeniorityDataNode } from './types';


const seniorityListRef = db.ref('seniorityLists');
const seniorityDataRef = db.ref('seniorityData');


function sortBySeniorityNumber(a: { seniorityNumber: number }, b: { seniorityNumber: number }): 0 | 1 | -1 {
  const aSen = a.seniorityNumber;
  const bSen = b.seniorityNumber;

  if (aSen && bSen) {
    return aSen < bSen ? -1 : 1;
  }
  return 0;
}

function buildSeniorityRecordsFromNodes(listNode: DbSeniorityListsNodeItem, dataNode: DbSeniorityDataNodeItem): SeniorityRecord {
  const { id, publishedStamp, recordCount } = listNode;
  const records = Object.values(dataNode).sort(sortBySeniorityNumber).map(item => ({ ...item, retireDate: new Date(Date.parse(item.retireDate)) })) as PilotRecord[];
  return {
    id, publishedDate: new Date(publishedStamp), recordCount, records
  }

}

export async function getCurrentSeniorityRecords(): Promise<SeniorityRecord[]> {

  const recordQuery = await seniorityListRef.once('value');

  if (!recordQuery.exists()) {
    return [];
  } else {
    const listNodes = recordQuery.val() as DbSeniorityListsNode;

    const dataNodes = (await seniorityDataRef.once('value')).val() as DbSeniorityDataNode;

    const pilotRecords = Object.keys(listNodes).map(id => {
      return buildSeniorityRecordsFromNodes(
        listNodes[id],
        dataNodes[id]
      )
    })
    return pilotRecords;
  }
}