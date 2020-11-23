<template>

  <v-main>
    <v-container fluid fill-height>
      <v-row>
        <v-col align="center" justify="center">
          <v-card elevation="5" tile max-width="400px">
            <v-card-title align="center">
              <h2 align="center" class="primary--text">Iniciar sesion</h2>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row align="center">
                <v-col cols="12">
                  <v-text-field label="Usuario" prepend-icon="mdi-account" v-model="txt_user" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field :type="show1 ? 'text' : 'password'" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show1 = !show1" label="Contraseña" prepend-icon="mdi-key" v-model="txt_pw"></v-text-field>
                </v-col>
                <v-col>
                  <v-btn block color="primary" class="ma-2 white--text" @click="Login()">
                    Acceder
                    <v-icon right dark>
                      mdi-login-variant
                    </v-icon>
                  </v-btn>
                  <p v-if="error" class="text-center red--text">Usuario o contrasenna incorrecta</p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </v-main>

</template>

<script>
// import axios from "axios";
// import auth from '@/components/auth.js'
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  data() {
    return {
      error: false,
      show1: false,
      txt_user: '',
      txt_pw: '',
      password: 'Password',
    }
  },
  computed: {
    ...mapGetters({
      username: 'user/username'
    })
  },
  methods: {
    ...mapActions({
      login: 'user/login'
    }),
    async Login() {
      try {
        const user = {
          'txt_user': this.txt_user,
          'txt_pw': this.txt_pw
        }
        let legeado=await this.login(user);
        if (legeado) {
          this.$router.push({
            name: 'admin'
          }).catch(() => {});
        } else {
          this.$router.push({
            name: 'Login'
          })
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style>

</style>
