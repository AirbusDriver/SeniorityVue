<template>
  <div class="seniority-directory">
    <div v-for="summary in allRecordSummaries" :key="summary.id">
      <SeniorityDirectoryCard :summary="summary" class="ma-5" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { SeniorityRecordSummary } from "../../seniority/types";
import { SeniorityGetterTypes } from "@/store/seniority";
import SeniorityDirectoryCard from "./SeniorityDirectoryCard.vue";

const getters = SeniorityGetterTypes;

@Component({
  components: { SeniorityDirectoryCard }
})
export default class SeniorityDirectory extends Vue {
  get allRecordSummaries(): SeniorityRecordSummary[] {
    const records: SeniorityRecordSummary[] = this.$store.getters[
      `seniority/${getters.ALL_RECORD_SUMMARIES}`
    ];
    return records.sort(
      (a, b) => (+a.publishedDate > +b.publishedDate ? -1 : 1) // descending by date
    );
  }
}
</script>