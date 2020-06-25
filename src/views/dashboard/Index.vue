<template>
  <v-app>
    <dashboard-core-app-bar v-if="isActive" />

    <dashboard-core-drawer v-if="isActive" />

    <dashboard-core-view />
    <dashboard-core-settings v-if="isActive" />
  </v-app>
</template>

<script>
export default {
  name: "DashboardIndex",
  components: {
    DashboardCoreAppBar: () => import("./components/core/AppBar"),
    DashboardCoreDrawer: () => import("./components/core/Drawer"),
    DashboardCoreSettings: () => import("./components/core/Settings"),
    DashboardCoreView: () => import("./components/core/View"),
  },
  props: {
    routes: {
      type: String,
      default: "",
    },
  },

  computed: {
    isActive: function() {
      return this.routes !== this.$route.path;
    },
  },
};
</script>
