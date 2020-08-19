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
import { TableItem, PilotRecordMapper, ItemFilter } from "./types";
import { parseDate } from "@/helpers";

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

// PROPS DATA

const PILOT_DATA_PROP = { type: Array, default: [] };

const FILTER_FUNC_PROPS = { type: Function, default: () => true };

const TABLE_HEADERS: (DataTableHeader & { value: keyof TableItem })[] = [
  { text: "Seniority Number", value: "seniorityNumber" },
  { text: "Employee ID", value: "employeeID" },
  { text: "Retire Date", value: "retireDateString" },
  { text: "Seat", value: "seat" },
  { text: "Fleet", value: "fleet" },
  { text: "Base", value: "base" }
];

const FOOTER_PROPS = {
  itemsPerPageOptions: [100, 250, 500, 1000]
};

@Component
export default class SeniorityExplorerDataTable extends Vue {
  @Prop(PILOT_DATA_PROP) readonly pilotData!: PilotRecord[];
  @Prop(FILTER_FUNC_PROPS) readonly filterFunc!: ItemFilter;

  tableHeaders = TABLE_HEADERS;
  footerProps = FOOTER_PROPS;
  initialItems: TableItem[] = [];

  created() {
    this.initialItems = createTableItems(this.pilotData);
  }

  get activeItems(): TableItem[] {
    return this.initialItems.filter(this.filterFunc);
  }
}
</script>