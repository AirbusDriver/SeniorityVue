<template>
  <div class="seniority-explorer-system-bar">
    <v-system-bar dark extended>
      <v-toolbar-title class="mx-2">
        <div v-if="hasRecord">Most Recent Record: {{ latestRecordDate }}</div>
        <div v-else>No Records Currently Available</div>
      </v-toolbar-title>

      <v-spacer />
    </v-system-bar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SeniorityRecord } from "@/seniority/types";

@Component
export default class SeniorityExplorerSystemBar extends Vue {
  get latestRecord(): SeniorityRecord | null {
    return this.$store.getters["seniority/mostRecentRecord"];
  }

  get latestRecordDate(): string {
    if (this.hasRecord != null) {
      const last = this.latestRecord as SeniorityRecord;
      const [year, month, date] = last.publishedDate
        .toISOString()
        .substr(0, 10)
        .split("-");
      return `${month}/${date}/${year}`;
    }
    return "";
  }

  get hasRecord(): boolean {
    return this.latestRecord != null;
  }
}
</script>