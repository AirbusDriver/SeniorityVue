
export interface DbSeniorityListsNodeItem {
  publishedStamp: number;
  id: string;
  recordCount: number;
  publishedDate: string;
}

export interface DbPilotRecordNode {
  employeeID: string;
  base: string;
  fleet: string;
  retireDate: string;
  seat: string;
  seniorityNumber: number;
}

export interface DbSeniorityDataNodeItem {
  [key: string]: DbPilotRecordNode;
}
export interface DbSeniorityListsNode {
  [key: string]: DbSeniorityListsNodeItem;
}

export interface DbSeniorityDataNode {
  [key: string]: DbSeniorityDataNodeItem;
}
