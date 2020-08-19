<template>
  <div>
    <v-card dark>
      <v-container>
        <v-row>
          <v-col cols="12">
            <Controller @update:active-filter-date="updateFilterDate($event)" />
          </v-col>
        </v-row>
        <v-divider />
        <v-row>
          <v-col cols="12">
            <div v-if="!hasRecords">No Record Data</div>
            <div v-else>
              <DataTable :pilotData="mostRecentPilotData" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Controller from "./SeniorityExplorerController.vue";
import DataTable from "./SeniorityExplorerDataTable.vue";
import { SeniorityRecord, PilotRecord } from "@/seniority/types";

@Component({
  components: { Controller, DataTable }
})
export default class SeniorityExplorer extends Vue {
  activeFilterDate!: Date | null;

  get seniorityRecords(): SeniorityRecord[] {
    return this.$store.getters["seniority/allRecords"];
  }

  get hasRecords(): boolean {
    return this.seniorityRecords.length > 0;
  }

  get mostRecentPilotData(): PilotRecord[] {
    if (!this.hasRecords) {
      return [];
    }
    const mostRecentRecord: SeniorityRecord = this.$store.getters[
      "seniority/mostRecentRecord"
    ];
    return [...mostRecentRecord.records];
  }

  created() {
    this.activeFilterDate = new Date(Date.now());
  }

  updateFilterDate(event: { date: Date; string: string }) {
    const { date } = event;
    this.activeFilterDate = date;
  }
}
</script>