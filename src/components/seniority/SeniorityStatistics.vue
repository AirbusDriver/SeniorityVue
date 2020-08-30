<template>
  <div class="seniority-statistics">
    <v-container fluid>
      <v-row align="stretch" justify="center">
        <v-col class="mt-n5" md="10" sm="12">
          <SenioriyStatisticsRetirementRateCard
            v-if="selectedRecord"
            :record="selectedRecord"
            :key="selectedRecord.id"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { SeniorityGetterTypes } from "@/store/seniority/types";
import { SeniorityRecord } from "../../seniority/types";
import SenioriyStatisticsRetirementRateCard from "./SeniorityStatisticsRetirementRateCard.vue";

const getters = SeniorityGetterTypes;

@Component({
  components: { SenioriyStatisticsRetirementRateCard }
})
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