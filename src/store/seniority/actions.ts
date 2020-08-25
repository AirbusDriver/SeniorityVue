import { ActionTree } from 'vuex';
import { SeniorityState, SeniorityActionTypes, SeniorityMutationTypes as mutations, DbSeniorityListsNodeItem, DbSeniorityListsNode, DbSeniorityDataNode, DbSeniorityDataNodeItem } from './types';
import { RootState } from '../index';
import { SeniorityRecord, PilotRecord } from '@/seniority/types';
import db from "@/db";
const { ADD_SENIORITY_RECORD, LOAD_SENIORITY_RECORDS } = SeniorityActionTypes;


const seniorityListRef = db.ref('seniorityLists');
const seniorityDataRef = db.ref('seniorityData');

function sortBySeniorityNumber(a: PilotRecord, b: PilotRecord): 0 | 1 | -1 {
  const aSen = a.seniorityNumber;
  const bSen = b.seniorityNumber;

  if (aSen && bSen) {
    return aSen < bSen ? -1 : 1;
  }
  return 0;
}

function buildSeniorityRecordsFromNodes(listNode: DbSeniorityListsNodeItem, dataNode: DbSeniorityDataNodeItem): SeniorityRecord {
  const { id, publishedStamp, recordCount } = listNode;
  const records = Object.values(dataNode).sort(sortBySeniorityNumber);
  return {
    id, publishedDate: new Date(publishedStamp), recordCount, records
  }

}

export const actions: ActionTree<SeniorityState, RootState> = {
  [ADD_SENIORITY_RECORD]({ commit }, payload: SeniorityRecord) {
    commit(mutations.ADD_SENIORITY_RECORD, payload);
  },
  async [LOAD_SENIORITY_RECORDS]({ dispatch }) {

    const recordQuery = await seniorityListRef.once('value');

    if (!recordQuery.exists()) {
      console.log('no records available');
      return;
    } else {
      const listNodes = recordQuery.val() as DbSeniorityListsNode;

      const dataNodes = (await seniorityDataRef.once('value')).val() as DbSeniorityDataNode;

      const pilotRecords = Object.keys(listNodes).map(id => {
        return buildSeniorityRecordsFromNodes(
          listNodes[id],
          dataNodes[id]
        )
      });

      pilotRecords.forEach(rec => {
        dispatch(ADD_SENIORITY_RECORD, { record: rec });
        console.log(`adding record: `, rec)
      })
    }
  }
}
