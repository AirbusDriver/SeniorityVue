<template>
  <div>
    <v-card dark>
      <v-container>
        <v-row>
          <v-col cols="12">
            <Controller
              @update:active-filter-date="updateFilterDate($event)"
              @update:filter-status="updateFilterStatus($event)"
              :published-date="recordPublishedDateString"
            />
          </v-col>
        </v-row>
        <v-divider />
        <v-row>
          <v-col cols="12">
            <div v-if="!hasRecords">No Record Data</div>
            <div v-else>
              <DataTable :pilot-data="mostRecentPilotData" :filter-func="filterFunction" />
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
import { FilterStatus, ItemFilter } from "./types";
import { parseDate } from "@/helpers";

@Component({
  components: { Controller, DataTable }
})
export default class SeniorityExplorer extends Vue {
  activeFilterDate: Date | null = new Date(Date.now());
  filterStatus: FilterStatus = FilterStatus.ACTIVE_ON;

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

  get mostRecentRecord(): SeniorityRecord | null {
    if (!this.hasRecords) {
      return null;
    }
    const mostRecentRecord: SeniorityRecord = this.$store.getters[
      "seniority/mostRecentRecord"
    ];
    return mostRecentRecord;
  }

  get filterFunction(): ItemFilter {
    if (
      this.activeFilterDate !== null &&
      this.filterStatus === FilterStatus.ACTIVE_ON
    ) {
      const dateString = parseDate(this.activeFilterDate);
      return item => item.retireDateString > dateString;
    } else {
      return () => true;
    }
  }

  get recordPublishedDateString(): string {
    if (this.mostRecentRecord) {
      return parseDate(this.mostRecentRecord.publishedDate);
    }
    return "";
  }

  mounted() {
    this.activeFilterDate = new Date(Date.now());
    this.filterStatus = FilterStatus.ACTIVE_ON;
  }

  updateFilterDate(event: { date: Date; string: string }) {
    const { date } = event;
    this.activeFilterDate = date;
  }

  updateFilterStatus(event: FilterStatus) {
    this.filterStatus = event;
  }
}
</script>