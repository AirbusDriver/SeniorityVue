<template>
  <v-app>
    <TheNavBar />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import TheNavBar from "@/components/TheNavBar.vue";

export default Vue.extend({
  name: "App",

  components: { TheNavBar },

  data: () => ({
    //
  })
});
</script>
