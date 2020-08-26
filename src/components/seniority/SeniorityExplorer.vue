<template>
  <div>
    <v-card dark>
      <v-container>
        <v-row>
          <v-col cols="12">
            <Controller
              @update:active-filter-date="updateFilterDate($event)"
              @update:filter-status="updateFilterStatus($event)"
              @update:show-employee-details="showEmployeeDetails = $event"
              :published-date="recordPublishedDateString"
            />
          </v-col>
        </v-row>
        <v-divider />
        <v-row>
          <v-col cols="12">
            <div v-if="!hasRecords && !loading">No Records available</div>
            <div v-else-if="loading">Loading Data</div>
            <div v-else>
              <DataTable
                :pilot-data="selectedData"
                :filter-func="filterFunction"
                :employee-details="showEmployeeDetails"
              />
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
import { SeniorityActionTypes } from "@/store/seniority/types";

const ACTIONS = SeniorityActionTypes;

@Component({
  components: { Controller, DataTable }
})
export default class SeniorityExplorer extends Vue {
  activeFilterDate: Date | null = new Date(Date.now());
  filterStatus: FilterStatus = FilterStatus.ACTIVE_ON;
  showEmployeeDetails = "";
  loading = false;

  get seniorityRecords(): SeniorityRecord[] {
    return this.$store.getters["seniority/allRecords"];
  }

  get hasRecords(): boolean {
    return this.seniorityRecords.length > 0;
  }

  get selectedData(): PilotRecord[] {
    const record = this.selectedRecord;
    if (record == null) {
      return [];
    }
    return record.records.sort((a, b) =>
      a.seniorityNumber < b.seniorityNumber ? -1 : 1
    );
  }

  get selectedRecord(): SeniorityRecord | null {
    if (!this.hasRecords) {
      return null;
    }
    if (this.$route.params.id != null) {
      const id = this.$route.params.id;
      const record = this.seniorityRecords.find(rec => rec.id === id);
      if (record != null) {
        return record;
      }
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
    if (this.selectedRecord) {
      return parseDate(this.selectedRecord.publishedDate);
    }
    return "";
  }

  mounted() {
    this.activeFilterDate = new Date(Date.now());
    this.filterStatus = FilterStatus.ACTIVE_ON;

    if (!this.hasRecords) {
      this.loading = true;
      this.$store
        .dispatch("seniority/" + ACTIONS.LOAD_SENIORITY_RECORDS)
        .then(() => (this.loading = false));
    }
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