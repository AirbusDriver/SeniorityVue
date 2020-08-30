<template>
  <v-card class="seniority-directory-card grey lighten-2">
    <v-card-title>{{ formattedDate }}</v-card-title>
    <v-card-text>{{ numRetired }}/{{ numberOfPilots }} Retired</v-card-text>
    <v-card-actions>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="10" md="6">
            <v-row justify="space-around" align="center">
              <v-btn
                class="primary"
                :to="{ name: 'SeniorityListDataShow', params: { recordId: summary.id }}"
              >Data</v-btn>
              <v-btn
                class="primary"
                :to="{name: 'SeniorityStatisticsShow', params: { recordId: summary.id }}"
              >Retirements</v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import {
  SeniorityRecordSummary,
  SeniorityRecord,
  PilotRecord
} from "../../seniority/types";
import { SeniorityGetterTypes as getters } from "@/store/seniority";
import moment from "moment";

function filterRetired(records: PilotRecord[], refDate?: Date): PilotRecord[] {
  const ref: Date = refDate != null ? refDate : new Date(Date.now());
  const retired = records.filter(pilot => pilot.retireDate <= ref);
  return retired;
}

@Component
export default class SeniorityDirectoryCard extends Vue {
  @Prop({ type: Object, required: true })
  readonly summary!: SeniorityRecordSummary;

  get formattedDate(): string {
    return moment(this.summary.publishedDate).format("YYYY-MM-DD");
  }

  get numberOfPilots(): number {
    return this.summary.recordCount;
  }

  get record(): SeniorityRecord {
    return this.$store.getters[`seniority/${getters.GET_RECORD_FOR_ID}`](
      this.summary.id
    );
  }

  get numRetired(): number {
    return filterRetired(this.record.records).length;
  }

  get numActive(): number {
    return this.numberOfPilots - this.numRetired;
  }
}
</script>