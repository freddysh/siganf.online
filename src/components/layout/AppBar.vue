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
          <v-list-item key="1" @click="mostrar()">
            <v-list-item-title>Editar</v-list-item-title>
          </v-list-item>
          <v-list-item key="2" @click="Salir()">
            <v-list-item-title>Salir</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-dialog v-model="ver" max-width="500px">
    <v-card>
        <v-card-title>
        <span class="headline">Editar mis datos</span>
        </v-card-title>

        <v-card-text>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="usuario.dni" label="Dni" disabled></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="usuario.nombre" label="Nombre"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="usuario.email" label="Email"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="usuario.password" label="Password"></v-text-field>
                </v-col>
            </v-row>
        </v-container>
        </v-card-text>

        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" dark @click="cerrar()">
            Cancelar
        </v-btn>
        <v-btn color="primary" dark @click="save()" >
            Guardar
        </v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Menu from '@/views/layout/Menu.vue'
// import auth from '@/components/auth.js'

import axios from "axios";
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
      username: 'user/username',
      usuarioRol: 'user/usuarioRol',
      endpoint: 'user/endpoint'
    })
  },
  data() {
    return {
      logeado: null,
      ver:false,
      usuario:[],

    }
  },
  created() {
    // console.log('se ejecurara el created')
    // this.obtenerUsuarioLogeado();
    // console.log(this.logeado);
    // console.log('se ejecuto el created')
    this.obtenerDatos();
  },
  methods: {
    ...mapActions({
      Logout: 'user/logout'
    }),
    // async obtenerUsuarioLogeado() {
    //   console.log('obtenemos lo que esta en cookie:', auth.getUserLoged());
    //   if (auth.getUserLoged()) {
    //     console.log('la true');
    //     this.logeado = await auth.getUserLoged();
    //   } else {
    //     console.log('la false');
    //     this.logeado = null;
    //   }
    // },
    async obtenerDatos(){
        let rpt = await axios.get(`${this.endpoint}/api/v1/user/${this.usuarioLogeado}`);
        console.log('usuario:',rpt.data);
        let usuario_={
        id: rpt.data.id,
        dni: rpt.data.dni,
        nombre:rpt.data.name,
        email:rpt.data.email,
        password:rpt.data.password
        }
        this.usuario=usuario_;

    },
    mostrar(){
        this.ver=true;
    },
    async save(){
        let rpt = await axios.put(`${this.endpoint}/api/v1/user/${this.usuario.id}/update`,this.usuario);

        if(rpt.data){
            this.cerrar();
            this.$swal.fire(
            'Hecho!',
            'Datos editados correctamente.',
            'success'
          )
        }
    },
    cerrar(){
        this.ver=false;
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
