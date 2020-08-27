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
                v-if="recordData.length > 0"
                :pilot-data="recordData"
                :filter-func="filterFunction"
                :employee-details="showEmployeeDetails"
              />
              <div v-else>{{ recordError }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Controller from "./SeniorityExplorerController.vue";
import DataTable from "./SeniorityExplorerDataTable.vue";
import { SeniorityRecord, PilotRecord } from "@/seniority/types";
import { FilterStatus, ItemFilter } from "./types";
import { parseDate } from "@/helpers";

@Component({
  components: { Controller, DataTable }
})
export default class SeniorityExplorer extends Vue {
  @Prop({ type: String, default: "latest" }) readonly recordId!: string;

  activeFilterDate: Date | null = new Date(Date.now());
  filterStatus: FilterStatus = FilterStatus.ACTIVE_ON;
  showEmployeeDetails = "";
  loading = false;
  selectedRecord: SeniorityRecord | null = null;
  recordError = "";

  get recordData(): PilotRecord[] {
    const record = this.selectedRecord;
    if (record == null) {
      return [];
    }
    const records = record.records.sort((a, b) =>
      a.seniorityNumber < b.seniorityNumber ? -1 : 1
    );
    return records;
  }

  get mostRecentRecord(): SeniorityRecord | null {
    return this.$store.getters["seniority/mostRecentRecord"];
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

  get hasRecords(): boolean {
    return this.$store.getters["seniority/hasRecords"];
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
    if (this.recordId === "latest") {
      this.selectedRecord = this.mostRecentRecord;
    } else {
      try {
        this.selectedRecord = this.getSelectedRecord(this.recordId);
      } catch (error) {
        this.recordError = `${error}`;
      }
    }
  }

  getSelectedRecord(id: string): SeniorityRecord | null {
    const record: SeniorityRecord | null = this.$store.getters[
      "seniority/getRecordForId"
    ](id);
    if (record == null) {
      throw new Error(`could not get record for id: ${id}`);
    }
    return record;
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