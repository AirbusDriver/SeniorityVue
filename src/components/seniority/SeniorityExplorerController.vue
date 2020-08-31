<template>
  <div class="pa-4">
    <v-container>
      <v-row justify="space-around">
        <v-btn
          id="active-today-btn"
          rounded
          dark
          :disabled="isToday"
          @click.prevent="setToday()"
        >{{ activeRetiredSelectState === "ACTIVE" ? "Active" : "Retired" }} Today</v-btn>

        <v-btn
          id="active-published-btn"
          rounded
          dark
          :disabled="isCleared"
          @click.prevent="clearActiveDate()"
        >{{ activeRetiredSelectState === "ACTIVE" ? "Active" : "Retired" }} When Published</v-btn>
      </v-row>

      <v-row align="center" justify="space-between">
        <v-col sm="4">
          <v-select :items="activeRetireSelectItems" v-model="activeRetiredSelectState"></v-select>
        </v-col>

        <v-col sm="6">
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="my-4"
                ref="picker-output"
                v-model="pickerValue"
                label="Active As Of"
                persistent-hint
                readonly
                hint="YYYY-MM-DD"
                v-bind="attrs"
                @blur="pickerValue = parseDate(pickerValue)"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="pickerValue" no-title @input="menu1 = false"></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>

      <v-row>
        <v-col sm="4">
          <v-select :items="baseSelectChoices" v-model="baseSelect" placeholder="Select Base"></v-select>
        </v-col>
      </v-row>

      <!-- TODO: move to parent -->
      <v-row align="center">
        <v-checkbox v-model="employeeDetailsEnabled"></v-checkbox>
        <v-text-field
          :disabled="!employeeDetailsEnabled"
          v-model="$data._employeeDetailsValue"
          placeholder="Enter an ID to pin the details to the top"
        ></v-text-field>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { parseDate } from "@/helpers";
import { PropOptions } from "vue/types/options";
import { PilotFilter, buildPilotFilter } from "@/seniority/filters";
import {
  FilterBuilderOptions,
  ActiveFilterOptions,
  ActiveFilterStatus
} from "@/seniority/types";

type ActiveRetiredStates = "ACTIVE" | "RETIRED";

const publishedDateProp: PropOptions = {
  type: [Date, String],
  default: ""
};
/**
 * Props:
 *
 * Provide a publishedDate to set the default date for the filter
 *
 * Events: "update:activeFilterDate" => {date: Date, string: String 'YYYY-MM-DD'}
 *
 * @emits
 */
@Component
export default class SeniorityExplorerController extends Vue {
  @Prop(publishedDateProp) readonly publishedDate!: Date | string;

  pickerValue = "";
  menu1 = false;

  // TODO: rip out to parent
  employeeDetailsEnabled = false;
  _employeeDetailsValue = "";
  activeRetireSelectItems: ActiveRetiredStates[] = ["ACTIVE", "RETIRED"];
  activeRetiredSelectState: ActiveRetiredStates = "ACTIVE";
  baseSelect = "ALL";
  baseSelectChoices = ["ALL", "BOS", "JFK", "MCO", "LGB", "FLL"];

  get pilotFilter(): PilotFilter {
    return this.buildFilter();
  }

  get pickerDate(): Date | null {
    if (this.pickerValue === "") {
      return null;
    }
    const [year, month, date] = this.pickerValue.split("-");
    const newDate = new Date(+year, +month - 1, +date);

    if (isNaN(newDate.getFullYear())) {
      throw new Error(`could not parse ${this.pickerValue} to a date`);
    }
    return newDate;
  }

  get isToday(): boolean {
    return this.parseDate(new Date(Date.now())) === this.pickerValue;
  }

  get isCleared(): boolean {
    if (this.publishedDate === "" || this.publishedDate == null) {
      return true;
    }
    try {
      return this.parseDate(this.publishedDate) === this.pickerValue;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // TODO: this needs to be moved to parent
  get employeeDetailsValue(): string {
    if (this.employeeDetailsEnabled === false) {
      return "";
    }
    return this.$data._employeeDetailsValue;
  }

  get activeFilterOptions(): ActiveFilterOptions | null {
    return {
      status:
        this.activeRetiredSelectState === "ACTIVE"
          ? ActiveFilterStatus.ACTIVE
          : ActiveFilterStatus.RETIRED,
      value: this.pickerDate !== null ? this.pickerDate : undefined
    };
  }

  get baseFilterOptions(): { value: string } | null {
    if (this.baseSelect === "ALL") {
      return null;
    }
    return { value: this.baseSelect };
  }

  get pilotFilterOptions(): FilterBuilderOptions {
    const activeFilter =
      this.activeFilterOptions != null ? this.activeFilterOptions : undefined;

    const baseFilter =
      this.baseFilterOptions != null ? this.baseFilterOptions : undefined;

    const out: FilterBuilderOptions = {
      activeFilter,
      baseFilter
    };

    return out;
  }

  buildFilter(): PilotFilter {
    const options = this.pilotFilterOptions;
    return buildPilotFilter(options);
  }

  created() {
    if (this.publishedDate == null || this.publishedDate === "") {
      this.setToday();
      return;
    }
    this.setToPublished();

    // TODO: move to parent
    this.$data._employeeDetailsValue = "";
  }

  parseDate(date: Date | string): string {
    return parseDate(date);
  }

  clearActiveDate(): void {
    if (this.publishedDate !== "") {
      this.setToPublished();
    } else {
      this.setToday();
    }
  }

  setToday(): void {
    const today = new Date(Date.now());
    this.pickerValue = this.parseDate(today);
  }

  setToPublished(): void {
    if (this.publishedDate == null || this.publishedDate === "") {
      this.setToday();
      return;
    }
    const newValue = this.parseDate(this.publishedDate);
    this.pickerValue = newValue;
  }

  // TODO: move to parent
  @Watch("employeeDetailsValue", { immediate: true })
  onEmployeeDetailsChange() {
    this.$emit("update:show-employee-details", this.employeeDetailsValue || "");
  }

  @Watch("pilotFilterOptions", { deep: true, immediate: true })
  onPilotFilterOptionsChange() {
    this.$emit("update:pilot-filter", {
      filter: this.pilotFilter,
      options: this.pilotFilterOptions
    });
  }
}
</script>