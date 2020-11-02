<template>
  <v-card class="centered" elevation="5" tile>
    Bienvenidossadas
    d
    {{ title }}
    Hola {{ username }}
  </v-card>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  data: () => ({}),
  computed: {
    ...mapGetters({
      title: 'title',
      username: 'user/username'

    })
  },
  methods: {
    ...mapActions({
      getUser: 'user/getUser'
    })
  },
  mounted() {
    let i = 0;
    setInterval(() => {
      this.getUser(i % 3 + 1);
      i++;
    }, 1000)
  }
}
</script>
