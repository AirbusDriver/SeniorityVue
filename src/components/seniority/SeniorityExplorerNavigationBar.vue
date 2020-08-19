<template>
  <div class="seniority-explorer-nav-bar"></div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class SeniorityExplorerNavigationBar extends Vue {
  drawer = true;
  mini = true;
  items = [
    {
      title: "Main",
      icon: "mdi-home-city",
      to: {
        name: "SeniorityMain"
      }
    },
    {
      title: "Data",
      icon: "mdi-table-large"
    }
  ];
}
</script>