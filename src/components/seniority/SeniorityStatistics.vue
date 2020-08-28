<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { SeniorityGetterTypes } from "@/store/seniority/types";
import { SeniorityRecord } from "../../seniority/types";

const getters = SeniorityGetterTypes;

@Component
export default class SeniorityStatistics extends Vue {
  @Prop({ type: String, required: true }) readonly recordId!: string;

  selectedRecord: SeniorityRecord | null = null;
  error = "";

  @Watch("recordId", { immediate: true })
  onRecordIdChange(newId: string) {
    const lookup: (id: string) => SeniorityRecord | undefined = this.$store
      .getters[`seniority/${getters.GET_RECORD_FOR_ID}`];

    const record = lookup(newId);

    if (record != null) {
      this.selectedRecord = record;
      return;
    } else {
      this.error = `No record found for id: ${newId}`;
    }
  }
}
</script>