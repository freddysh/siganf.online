<template>
  <v-app>
    <AppBar />
    <router-view />
  </v-app>
</template>

<script>
import AppBar from './components/layout/AppBar.vue'
export default {
  name: 'App',
  components: {
    AppBar
  }
};
</script>
