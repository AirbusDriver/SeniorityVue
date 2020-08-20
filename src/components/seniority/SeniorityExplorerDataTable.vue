<template>
  <div>
    <v-data-table
      :items="tableItems"
      :headers="tableHeaders"
      :loading="loading"
      item-key="employeeID"
      :footer-props="footerProps"
      show-expand
      single-expand
    >
      <template v-slot:expanded-item="{item, headers}">
        <Expansion :item="item" :headers="headers" />
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { DataTableHeader } from "vuetify/types";
import { PilotRecord, EmployeeID } from "@/seniority/types";
import Expansion from "./SeniorityExplorerDataTableExpansion.vue";
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

function createSeniorityMap(items: TableItem[]): Map<string, number> {
  const entries = items.map((item, idx): [string, number] => {
    return [`${item.employeeID}`, idx + 1];
  });
  return new Map<string, number>(entries);
}

// PROPS DATA

const PILOT_DATA_PROP = { type: Array, default: [] };

const FILTER_FUNC_PROPS = { type: Function, default: () => true };

const TABLE_HEADERS: (DataTableHeader & {
  value: keyof TableItem | "dynamic";
})[] = [
  { text: "Seniority Number", value: "dynamic" },
  { text: "Employee ID", value: "employeeID" },
  { text: "Retire Date", value: "retireDateString" },
  { text: "Seat", value: "seat" },
  { text: "Fleet", value: "fleet" },
  { text: "Base", value: "base" }
];

const FOOTER_PROPS = {
  itemsPerPageOptions: [100, 250, 500, 1000]
};

@Component({
  components: { Expansion }
})
export default class SeniorityExplorerDataTable extends Vue {
  @Prop(PILOT_DATA_PROP) readonly pilotData!: PilotRecord[];
  @Prop(FILTER_FUNC_PROPS) readonly filterFunc!: ItemFilter;

  tableHeaders = TABLE_HEADERS;
  footerProps = FOOTER_PROPS;
  initialItems: TableItem[] = [];
  seniorityMap: Map<string, number> = new Map();
  loading = false;

  created() {
    this.loading = true;
    this.initialItems = createTableItems(this.pilotData);
    this.loading = false;
  }

  get activeItems(): TableItem[] {
    return this.initialItems.filter(this.filterFunc);
  }

  get tableItems(): (TableItem & { dynamic: number | null })[] {
    const out = this.activeItems.map(item => ({
      ...item,
      dynamic: this.getDynamicSeniorityForId(item.employeeID.toString())
    }));
    return out;
  }

  getDynamicSeniorityForId(id: EmployeeID): number | null {
    const mapValue = this.seniorityMap.get(`${id}`);
    return mapValue || null;
  }

  @Watch("activeItems", { immediate: true })
  onActiveItemsChanged() {
    this.loading = true;
    this.seniorityMap = createSeniorityMap(this.activeItems);
    this.loading = false;
  }
}
</script>