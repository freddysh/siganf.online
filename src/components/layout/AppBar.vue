<template>
  <div>
    <v-app-bar color="primary" dense dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Asesoria</v-toolbar-title>
      <v-spacer></v-spacer>
      <Menu v-if="usuarioLogeado"></Menu>

      <v-spacer></v-spacer>
      <router-link v-if="!usuarioLogeado" to="Login">
        <v-btn color="white" class="blue--text">Login</v-btn>
      </router-link>
      <b v-if="usuarioLogeado">{{ username}} </b>
      <v-menu v-if="usuarioLogeado" left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item key="1" @click="() => {}">
            <v-list-item-title>Editar</v-list-item-title>
          </v-list-item>
          <v-list-item key="2" @click="Salir()">
            <v-list-item-title>Salir</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import Menu from '@/views/layout/Menu.vue'
import auth from '@/components/auth.js'
import {
  mapActions,
  mapGetters,
} from 'vuex'
export default {
  name: 'AppBar',
  components: {
    Menu
  },
  computed: {
    ...mapGetters({
      usuarioLogeado: 'user/usuarioLogeado',
      username: 'user/username'
    })
  },
  data() {
    return {
      logeado: null
    }
  },
  created() {
    // console.log('se ejecurara el created')
    // this.obtenerUsuarioLogeado();
    // console.log(this.logeado);
    // console.log('se ejecuto el created')
  },
  methods: {
    ...mapActions({
      Logout: 'user/logout'
    }),
    async obtenerUsuarioLogeado() {
      console.log('obtenemos lo que esta en cookie:', auth.getUserLoged());
      if (auth.getUserLoged()) {
        console.log('la true');
        this.logeado = await auth.getUserLoged();
      } else {
        console.log('la false');
        this.logeado = null;
      }
    },
    Salir() {
      this.Logout();
      this.$router.push({
        name: 'Login'
      })
    }
  }
}
</script>

<style>

</style>
