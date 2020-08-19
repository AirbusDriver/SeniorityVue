<template>
  <div class="seniority">
    <SeniorityExplorerSystemBar />
    <v-container>
      <SeniorityNavigationBar />
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SeniorityExplorerSystemBar from "@/components/seniority/SeniorityExplorerSystemBar.vue";
import SeniorityNavigationBar from "@/components/seniority/SeniorityExplorerNavigationBar.vue";
import { SeniorityActionTypes } from "@/store/seniority/types";

const ACTIONS = SeniorityActionTypes;

@Component({
  components: { SeniorityExplorerSystemBar, SeniorityNavigationBar }
})
export default class Seniority extends Vue {
  mounted() {
    this.$store.dispatch("seniority/" + ACTIONS.LOAD_SENIORITY_RECORDS);
  }
}
</script>