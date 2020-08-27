<template>
  <div class="seniority">
    <SeniorityExplorerSystemBar />
    <v-container>
      <SeniorityNavigationBar />
      <div v-show="loading">Fetching data...</div>
      <router-view v-if="loading === false"></router-view>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SeniorityExplorerSystemBar from "@/components/seniority/SeniorityExplorerSystemBar.vue";
import SeniorityNavigationBar from "@/components/seniority/SeniorityExplorerNavigationBar.vue";
import { SeniorityGetterTypes as getters } from "@/store/seniority";
import { SeniorityActionTypes as actions } from "@/store/seniority/types";

@Component({
  components: { SeniorityExplorerSystemBar, SeniorityNavigationBar }
})
export default class Seniority extends Vue {
  loading = false;

  created() {
    if (this.$store.getters[`seniority/${getters.HAS_RECORDS}`] === false) {
      this.loading = true;
      this.$store
        .dispatch(`seniority/${actions.LOAD_SENIORITY_RECORDS}`)
        .then(() => (this.loading = false));
    }
  }
}
</script>