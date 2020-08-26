<template>
  <v-card class="seniority-directory-card">
    <v-card-title>{{ formattedDate }}</v-card-title>
    <v-card-actions>
      <v-btn :to="{ name: 'SeniorityListDataShow', params: {id: summary.id }}">Show Data Table</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { SeniorityRecordSummary } from "../../seniority/types";
import moment from "moment";

@Component
export default class SeniorityDirectoryCard extends Vue {
  @Prop({ type: Object, required: true })
  readonly summary!: SeniorityRecordSummary;

  get formattedDate(): string {
    return moment(this.summary.publishedDate).format("YYYY-MM-DD");
  }
}
</script>