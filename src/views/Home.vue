<template>
  <v-card dark>
    <!-- Data Header -->
    <v-card-title class="headline">Data Explorer</v-card-title>

    <div class="mx-4">
      <v-btn
        :disabled="parseDate(new Date(Date.now())) == date"
        rounded
        dark
        @click.prevent="date = parseDate(new Date(Date.now()))"
      >Show Currently Active</v-btn>

      <v-btn
        rounded
        dark
        @click.prevent="date = parseDate(mostRecentRecord.publishedDate)"
      >Clear Active Filter</v-btn>

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
            v-model="dateInput"
            label="Active As Of"
            persistent-hint
            readonly
            hint="YYYY-MM-DD"
            v-bind="attrs"
            @blur="date = parseDate(dateInput)"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="dateInput" no-title @input="menu1 = false"></v-date-picker>
      </v-menu>
    </div>

    <!-- Data Presentation -->
    <v-data-table
      class="mt-5"
      dense
      show-expand
      :single-expand="true"
      :expanded.sync="expanded"
      :headers="tableHeaders"
      :items="pilotData"
      item-key="employeeID"
      :search="date"
      :custom-filter="activeOn"
      :footer-props="footerProps"
    >
      <!-- Top Briefing Strip -->
      <template v-slot:top>
        <p
          class="mx-3"
        >As of {{ date }}, at least {{ pilotData.length - activePilotRecords.length }} of {{ pilotData.length }} will have retired</p>
      </template>

      <!-- Data Table Item -->
      <template
        v-slot:item.seniorityNumber="{ item }"
      >{{ getDynamicSeniorityForId(item.employeeID) }}</template>

      <!-- Item Expansion -->
      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length">Seniority When Published: {{ item.seniorityNumber }}</td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { DataTableHeader } from "vuetify";
import { createNamespacedHelpers } from "vuex";
import { SeniorityActionTypes as ACTIONS } from "@/store/seniority/types";
import { SeniorityRecord, PilotRecord } from "@/seniority/types";

const { mapGetters } = createNamespacedHelpers("seniority");

function formatDate(date: string | Date) {
  let dateStr: string;
  if (date instanceof Date) {
    dateStr = date.toISOString();
  } else {
    if (!date) return "";
    dateStr = date;
  }

  const [year, month, day] = dateStr.substr(0, 10).split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

type TableItem = PilotRecord & {
  formattedDate: string;
};

function activeOn(
  value: number,
  search: string,
  item: { formattedDate: string }
): boolean {
  if (search == "") {
    return true;
  }
  return item.formattedDate > search;
}

type SeniorityMap = Map<string | number, number>;

function createSeniorityMap(records: PilotRecord[]): SeniorityMap {
  const indices: [string, number][] = records.map((rec, idx) => [
    rec.employeeID.toString(),
    idx + 1
  ]);

  const out: SeniorityMap = new Map();

  indices.forEach(val => {
    const [k, v] = val;
    if (out.has(k)) {
      throw new Error(`trying to set ${k} when it already exists`);
    }
    out.set(k, v);
  });

  return out;
}

type Data = {
  menu1: boolean;
  expanded: any[];
  dateInput: string;
  seniorityMap: SeniorityMap;
  footerProps: {
    itemsPerPageOptions: number[];
    itemsPerPageText?: string;
  };
};

type Computed = {
  mostRecentRecord: SeniorityRecord | null;
  pilotData: TableItem[];
  activePilotRecords: PilotRecord[];
  date: string;
  minRetireDate: string;
  tableHeaders: ({ value: keyof TableItem } & DataTableHeader)[];
};

export default Vue.extend<Data, {}, Computed>({
  async mounted() {
    if (this.$store.state.seniority.records.length === 0) {
      this.$store.dispatch(`seniority/${ACTIONS.LOAD_SENIORITY_RECORDS}`);
    }
    this.dateInput = formatDate(this.minRetireDate);
  },
  data(): Data {
    return {
      menu1: false,
      expanded: [],
      dateInput: "",
      seniorityMap: new Map(),
      footerProps: {
        itemsPerPageOptions: [100, 500, 1000],
        itemsPerPageText: "Records per page"
      }
    };
  },
  computed: {
    ...mapGetters(["mostRecentRecord"]),
    pilotData(): TableItem[] {
      if (this.mostRecentRecord != null) {
        return (this.mostRecentRecord as SeniorityRecord).records
          .sort((a, b) => {
            if (a.seniorityNumber != null && b.seniorityNumber != null) {
              return a.seniorityNumber < b.seniorityNumber ? -1 : 1;
            }
            return 0;
          })
          .map(rec => {
            return {
              ...rec,
              formattedDate: formatDate(rec.retireDate)
            };
          });
      }
      return [];
    },
    activePilotRecords(): PilotRecord[] {
      if (this.pilotData.length === 0) {
        return [];
      }
      const data = (this.pilotData as TableItem[]).filter((item, idx) =>
        activeOn(idx, this.date, {
          formattedDate: formatDate(item.retireDate)
        })
      );
      return data;
    },
    date: {
      get(): string {
        return this.dateInput != "" ? this.dateInput : this.minRetireDate;
      },
      set(dateStr: string) {
        this.dateInput = formatDate(dateStr);
      }
    },
    minRetireDate(): string {
      if (this.pilotData.length === 0)
        return formatDate(new Date(Date.now()).toISOString());
      const allRetireDates = this.pilotData.map(
        (rec: TableItem) => +rec.retireDate
      );
      const maxDateVal = Math.min(...allRetireDates);
      const maxDate = new Date(maxDateVal);
      return formatDate(maxDate.toISOString());
    },
    tableHeaders(): ({ value: keyof TableItem } & DataTableHeader)[] {
      return [
        { text: "Updated\nSeniority", value: "seniorityNumber" },
        { text: "Employee ID", value: "employeeID" },
        {
          text: "Retirement",
          value: "formattedDate"
        },
        { text: "Base", value: "base" },
        { text: "Seat", value: "seat" },
        { text: "Fleet", value: "fleet" }
      ];
    }
  },
  watch: {
    async pilotData(newData) {
      if (newData) {
        this.date = this.minRetireDate;
      }
    },
    activePilotRecords: {
      handler: function(val) {
        Vue.set(this, "seniorityMap", createSeniorityMap(val));
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    formatDate(date: string) {
      formatDate(date);
    },
    parseDate(date: string | Date) {
      if (!date) return null;
      if (date instanceof Date) {
        date = date.toISOString().substr(0, 10);
      }

      const [year, month, day] = date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    activeOn,
    getDynamicSeniorityForId(id: string | number): number {
      const lookup = `${id}`;
      return this.seniorityMap.get(lookup) || -1;
    }
  }
});
</script>
