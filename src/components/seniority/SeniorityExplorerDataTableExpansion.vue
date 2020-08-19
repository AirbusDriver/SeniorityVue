<template>
  <div style="display: contents">
    <td :colspan="headers.length - (headers.length / 2)">{{ seniorityInfo.string }}</td>
    <td :colspan="headers.length / 2">{{ retireInfo.string }}</td>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { PropType } from "vue";
import { TableItem } from "./types";
import moment from "moment";
import "moment/locale/en-ie";

type TimeUntilInfo = { string: string; isPast: boolean };

const getTimeInfoStringForItem: (item: TableItem) => TimeUntilInfo = item => {
  const now = moment();
  const retirement = moment(item.retireDate);
  const string = retirement.from(now);
  const isPast = retirement.isBefore(now);
  return { string, isPast };
};

const ItemPropOptions = { type: Object as PropType<TableItem>, required: true };

@Component
export default class SeniorityExplorerDataTableExpansion extends Vue {
  @Prop(ItemPropOptions) readonly item!: TableItem;
  @Prop(Array) readonly headers!: [];

  get retireInfo(): { string: string; isPast: boolean } {
    const { string: timeString, isPast } = getTimeInfoStringForItem(this.item);
    const retireString = isPast
      ? ` retired ${timeString}`
      : ` is retiring ${timeString}`;
    return {
      string: `${this.item.employeeID} ${retireString}`,
      isPast: isPast
    };
  }

  get seniorityInfo(): { string: string } {
    return { string: `Published Seniority: ${this.item.seniorityNumber}` };
  }
}
</script>