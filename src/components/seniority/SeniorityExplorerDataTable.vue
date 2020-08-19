<template>
  <div>
    <v-data-table
      :items="activeItems"
      :headers="tableHeaders"
      item-key="employeeID"
      :footer-props="footerProps"
    ></v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { DataTableHeader } from "vuetify/types";
import { PilotRecord } from "@/seniority/types";
import { TableItem, PilotRecordMapper } from "./types";
import { parseDate } from "@/helpers";

const PILOT_DATA_PROP = { type: Array, default: [] };

const TABLE_HEADERS: (DataTableHeader & { value: keyof TableItem })[] = [
  { text: "Seniority Number", value: "seniorityNumber" },
  { text: "Employee ID", value: "employeeID" },
  { text: "Retire Date", value: "retireDateString" }
];

const FOOTER_PROPS = {
  itemsPerPageOptions: [100, 250, 500, 1000]
};

const recordToTableItemMapper: PilotRecordMapper = record => {
  const retireDateString: string = parseDate(record.retireDate);
  const out: TableItem = { ...record, retireDateString };
  return out;
};

const createTableItems: (records: PilotRecord[]) => TableItem[] = records => {
  if (records.length === 0) {
    return [];
  }
  return records.map(recordToTableItemMapper);
};

@Component
export default class SeniorityExplorerDataTable extends Vue {
  @Prop(PILOT_DATA_PROP) readonly pilotData!: PilotRecord[];

  tableHeaders = TABLE_HEADERS;
  footerProps = FOOTER_PROPS;
  initialItems: TableItem[] = [];

  created() {
    this.initialItems = createTableItems(this.pilotData);
  }

  get activeItems(): TableItem[] {
    return this.initialItems;
  }
}
</script>