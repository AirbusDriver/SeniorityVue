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
        >Active Today</v-btn>

        <v-btn
          id="active-published-btn"
          rounded
          dark
          :disabled="isCleared"
          @click.prevent="clearActiveDate()"
        >Active When Published</v-btn>
      </v-row>
    </v-container>

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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { parseDate } from "@/helpers";
import { PropOptions } from "vue/types/options";
import { FilterStatus } from "./types";

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
  filterStatus: FilterStatus = FilterStatus.ACTIVE_ON;
  filterStatusTypes = FilterStatus;

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

  created() {
    if (this.publishedDate == null || this.publishedDate === "") {
      this.setToday();
      return;
    }
    this.setToPublished();
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

  setFilterStatus(newStatus: FilterStatus) {
    if (Object.values(this.filterStatusTypes).includes(newStatus)) {
      this.filterStatus = newStatus;
    }
    throw new TypeError(`${newStatus} is not a valid filter status`);
  }

  @Watch("pickerValue", { immediate: true })
  onPickerValueChange() {
    this.$emit("update:active-filter-date", {
      date: this.pickerDate,
      string: this.pickerValue
    });
  }

  @Watch("filterStatus", { immediate: true })
  onFilterStatusChange() {
    this.$emit("update:filter-status", this.filterStatus);
  }
}
</script>