<template>
  <div>
    <v-card dark>
      <v-container>
        <v-row justify-center>
          <v-spacer />
          <v-col cols="10">
            <p
              v-if="recordPublishedDateString"
              class="text-center text-h5"
            >Seniority List Published: {{ recordPublishedDateString }}</p>

            <p v-else class="red lighten-2 white--text">{{ recordError }}</p>
          </v-col>
          <v-spacer />
        </v-row>
        <v-row>
          <v-col cols="12">
            <Controller
              @update:pilot-filter="updatePilotFilter"
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
import { PilotFilter } from "@/seniority/filters";
// import { ItemFilter } from "./types";
import { SeniorityGetterTypes as getters } from "@/store/seniority";
import { parseDate } from "@/helpers";

@Component({
  components: { Controller, DataTable }
})
export default class SeniorityExplorer extends Vue {
  @Prop({ type: String, default: "latest" }) readonly recordId!: string;

  activeFilterDate: Date | null = new Date(Date.now());
  showEmployeeDetails = "";
  loading = false;
  selectedRecord: SeniorityRecord | null = null;
  recordError = "";
  filterFunction: PilotFilter = () => true;

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
    return this.$store.getters[`seniority/${getters.MOST_RECENT_RECORD}`];
  }

  get hasRecords(): boolean {
    return this.$store.getters[`seniority/${getters.HAS_RECORDS}`];
  }

  get recordPublishedDateString(): string {
    if (this.selectedRecord) {
      return parseDate(this.selectedRecord.publishedDate);
    }
    return "";
  }

  mounted() {
    this.activeFilterDate = new Date(Date.now());
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
      `seniority/${getters.GET_RECORD_FOR_ID}`
    ](id);
    if (record == null) {
      throw new Error(`could not get record for id: ${id}`);
    }
    return record;
  }

  updatePilotFilter(payload: { filter: PilotFilter; options: object }) {
    const { filter } = payload;
    this.filterFunction = filter;
  }
}
</script>