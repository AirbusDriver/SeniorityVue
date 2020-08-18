<template>
  <div class="nav">
    <v-navigation-drawer v-model="drawer" clipped app dark>
      <v-list dense>
        <v-list-item link :to="{name: 'SeniorityExplore'}">
          <v-list-item-action>
            <v-icon>mdi-table</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Data</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'About'}">
          <v-list-item-action>
            <v-icon>mdi-github</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contribute</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Seniority Explorer</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class NavBar extends Vue {
  drawer = false;
}
</script>