<template>
  <div class="seniority-statistics-retirement-rate-card">
    <v-card>
      <v-toolbar color="grey darken-1" flat dark>
        <v-toolbar-title>Data as of {{ recordDate }}</v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <div>
              <v-sparkline
                :value="lineVals"
                :labels="lineLabels"
                show-labels
                fill
                auto-draw
                :gradient="['rgb(230, 0, 0)', 'rgb(0, 230, 0)']"
                gradient-direction="top"
                smooth="2"
                height="75"
              >
                <template v-slot:label="{ index }">{{ lineLabels[index] }}</template>
              </v-sparkline>
            </div>
          </v-col>
        </v-row>

        <v-divider />

        <v-row>
          <v-col cols="12">
            <v-sheet max-height="500px" class="overflow-y-auto">
              <v-card-text>
                <v-list>
                  <v-list-item v-for="item in retirementItems" :key="item.vKey">
                    <v-list-item-content>
                      <v-list-item-title>{{ item.dateString }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.value.count }} retirements
                        <span
                          v-if="item.rolling"
                        >{{ round(item.rolling) }}/month previous 6 months</span>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Watch, Component } from "vue-property-decorator";
import { PropType, PropOptions } from "vue";
import { calcRetirementsPerMonth } from "@/seniority/statistics/seniorityStatistics";
import { MonthCounter } from "@/seniority/statistics/types";
import { rollingAvg } from "@/seniority/statistics";
import { SeniorityRecord } from "../../seniority/types";
import { MonthCounterData } from "../../seniority/statistics/monthCounter";
import { round } from "@/helpers";

type RetirementListItem = {
  vKey: string;
  value: MonthCounterData;
  dateString: string;
  rolling: number | null;
};
type RetirementsListItems = RetirementListItem[];

type RetirementItemMapper = (
  item: MonthCounterData,
  idx: number,
  arr: MonthCounterData[]
) => RetirementListItem;
type RetirementItemsMapper = (data: MonthCounterData[]) => RetirementsListItems;

// todo: turn into factory that allows for various context options like rolling avg months
const mapToRetirementItem: RetirementItemMapper = (item, idx, arr) => {
  return {
    vKey: `${item.key.year}-${item.key.month}`,
    value: { ...item },
    dateString: `${item.key.year}-${item.key.month
      .toString()
      .padStart(2, "0")}`,
    rolling: rollingAvg(arr, 6, idx, item => item.count)
  };
};

const createRetirementItems: RetirementItemsMapper = data => {
  const out = data.map(mapToRetirementItem);
  return out;
};

// Props //

const PilotDataProp: PropOptions = {
  type: Object as PropType<SeniorityRecord>,
  required: true
};

@Component
export default class SenioriyStatisticsRetirementRateCard extends Vue {
  @Prop(PilotDataProp) readonly record!: SeniorityRecord;

  retirementsPerMonth: MonthCounter | null = null;
  error = "";
  nRolling = 6;
  maxGraphPoints = 50;

  get hasCalc(): boolean {
    return this.retirementsPerMonth != null;
  }

  get recordDate(): string {
    return this.record.publishedDate.toISOString().slice(0, 10);
  }

  get iterData() {
    if (this.hasCalc) {
      const retirements: MonthCounter = this
        .retirementsPerMonth as MonthCounter;
      return [...retirements.iterData()];
    } else {
      return [];
    }
  }

  get retirementItems() {
    return createRetirementItems(this.iterData);
  }

  get lineItems(): RetirementListItem[] {
    const numNodes = this.retirementItems.length; // 400
    const max = this.maxGraphPoints; // 50

    if (numNodes > this.maxGraphPoints) {
      const takeEvery = Math.floor(numNodes / max);
      return this.retirementItems.filter((_, idx) => idx % takeEvery === 0);
    }
    return this.retirementItems;
  }

  get lineVals(): number[] {
    return this.lineItems.map(item => item.rolling || 0);
  }

  get lineLabels(): string[] {
    return this.lineItems.map(item =>
      item.dateString.endsWith("-01") ? item.dateString.slice(0, 4) : ""
    );
  }

  // MIXIN METHODS //
  round = round;

  @Watch("record", { immediate: true })
  onRecordChange(newRecord: SeniorityRecord) {
    try {
      const data = calcRetirementsPerMonth(newRecord.records);
      this.retirementsPerMonth = data;
    } catch (error) {
      this.error = `${error}`;
      this.retirementsPerMonth = null;
    }
  }
}
</script>