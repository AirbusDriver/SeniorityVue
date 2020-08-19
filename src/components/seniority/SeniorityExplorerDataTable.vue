<template>
  <div>
    <v-data-table
      :items="pilotData"
      :headers="tableHeaders"
      :item-key="employeeID"
      :footer-props="footerProps"
    ></v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { DataTableHeader } from "vuetify/types";
import { PilotRecord } from "@/seniority/types";

const PILOT_DATA_PROP = { type: Array, default: [] };

type TableItem = PilotRecord;

const TABLE_HEADERS: (DataTableHeader & { value: keyof TableItem })[] = [
  { text: "Seniority Number", value: "seniorityNumber" },
  { text: "Employee ID", value: "employeeID" }
];

const FOOTER_PROPS = {
  itemsPerPageOptions: [100, 250, 500, 1000]
};

@Component
export default class SeniorityExplorerDataTable extends Vue {
  @Prop(PILOT_DATA_PROP) readonly pilotData!: PilotRecord[];

  tableHeaders = TABLE_HEADERS;
  footerProps = FOOTER_PROPS;
}
</script>