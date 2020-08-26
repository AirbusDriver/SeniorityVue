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

@Component({
  components: { SeniorityExplorerSystemBar, SeniorityNavigationBar }
})
export default class Seniority extends Vue {
  created() {
    if (this.$store.getters["seniority/allRecords"].length === 0) {
      this.$store.dispatch(
        `seniority/${SeniorityActionTypes.LOAD_SENIORITY_RECORDS}`
      );
    }
  }
}
</script>