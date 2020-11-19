<template>
  <div>
    <v-row>
      <v-col class="justify-center d-flex align-center">
        <v-menu v-for="(modulo,i) in modulos" :key="i">
          <template v-slot:activator="{ on, attrs }">
            <b class="mx-0 mx-1 d-flex d-sm-none" :color="modulo.color" dark v-bind="attrs" v-on="on">
              {{ modulo.abr }}
            </b>
            <b class="mx-1 d-none d-sm-flex" :color="modulo.color" dark v-bind="attrs" v-on="on">
              {{ modulo.titulo }}
            </b>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in modulo.items" :key="index">
              <router-link :to="item.link">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </router-link>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex'
export default {
  data: () => ({
    modulos: [ {
      titulo: "Ejecucion",
      abr: 'Eje',
      color: 'info',
      items: [{
        title: 'Mis asesorias',
        link: '/asesorias'
      }]
    }, {
      titulo: "Reporte",
      abr: 'Rep',
      color: 'warning',
      items: [{
        title: 'Reporte 1',
        link: '/resprtes1'
      }]
    }],
  }),
  computed: {
    ...mapGetters({
      usuarioRol: 'user/usuarioRol'
    })
  },
  methods: {
    verificarRol(){
    let item={
      titulo: "Mantenimiento",
      abr: 'Man',
      color: 'green',
      items: [{
          title: 'Iiees',
          link: '/iiees'
        },
        {
          title: 'Asesores',
          link: '/asesores'
        },
      ]
    };
    this.modulos.unshift(item);
    }
  },
  created() {
      if(this.usuarioRol=='admin')
        this.verificarRol();
  },
}
</script>
