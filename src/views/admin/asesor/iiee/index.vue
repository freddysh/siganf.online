<template>
  <div class="grey lighten-2">
    <v-row>
      <v-col cols="12" class="py-0 my-0">
        <v-card outlined color="white">
          <v-breadcrumbs :items="breadcrumbs" class="py-0">
            <template v-slot:divider>
              <v-icon>mdi-forward</v-icon>
            </template>
          </v-breadcrumbs>
        </v-card>
      </v-col>
      <v-col cols="12" class="py-0 my-1">
        <v-card outlined color="white">
          <v-card-text>
          <p>
          <b>Asesor </b>
          <b class="primary--text">{{ asesor.dni }}</b>|
          <b class="primary--text">{{ asesor.nombre }}</b>|
          <b class="primary--text">{{ asesor.email }}</b>
          </p>
          <v-divider></v-divider>
            <v-data-table :headers="headers" :items="iiees_asignadas" sort-by="calories" class="elevation-1">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Iiees asignadas </v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="800px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="green" dark class="mb-2" v-bind="attrs" v-on="on">
                        Asignar Iiee
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-select :items="iiees" v-model="editedItem.iiee_id" item-value="id" item-text="nombre" label="Iiee a asignar"></v-select>
                            </v-col>

                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" dark @click="close">
                          Cancelar
                        </v-btn>
                        <v-btn color="primary" dark @click="save()">
                          Guardar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="headline">Esta seguro de borrar este grado?</v-card-title>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" dark @click="closeDelete">Cancelar</v-btn>
                        <v-btn color="red" dark @click="deleteItemConfirm">Si</v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn fab dark small color="warning" @click="editItem(item)">
                  <v-icon>
                    mdi-pencil
                  </v-icon>
                </v-btn>
                <v-btn fab dark small color="red" @click="deleteItem(item)">
                  <v-icon @click="deleteItem(item)">
                    mdi-delete
                  </v-icon>
                </v-btn>

              </template>
              <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">
                  Recargar
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import axios from "axios";
import {
  mapGetters
} from 'vuex'
export default {
  components: {

  },
  data: () => ({
    breadcrumbs: [{
        text: 'Inicio',
        disabled: false,
        href: '',
      },
      {
        text: 'Mantenimiento',
        disabled: false,
        href: '',
      },
      {
        text: 'Asesores',
        disabled: true,
        href: 'breadcrumbs_link_1',
      },
      {
        text: 'Iiies',
        disabled: true,
        href: 'breadcrumbs_link_1',
      }
    ],
    asesor:[],
    dialog: false,
    dialogDelete: false,
    headers: [{
        text: 'Codigo modular',
        align: 'start',
        sortable: false,
        value: 'iiee_codigo_modular',
      },{
        text: 'Nombre',
        sortable: false,
        value: 'iiee_nombre',
      },{
        text: 'Nivel',
        sortable: false,
        value: 'iiee_nivel',
      },{
        text: 'Centro poblado',
        sortable: false,
        value: 'iiee_centro_poblado',
      },{
        text: 'Local',
        sortable: false,
        value: 'iiee_local',
      },{
        text: 'Direccion',
        sortable: false,
        value: 'iiee_direccion',
      },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false
      },
    ],
    iiees_asignadas:[],
    iiees:[],
    editedIndex: -1,
    editedItem: {
      nivel: '',
      nombre: '',
      ugel_id: 0,
    },
    ugel_id_: 0,
    defaultItem: {
      nombre: '',
      nivel: '',
      ugel_id: 0,
    },
    loader_provincia: false,
    loader_distrito: false,
  }),
  computed: {
    ...mapGetters({
      usuarioLogeado: 'user/usuarioLogeado',
      endpoint: 'user/endpoint',
    }),
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Iiee' : 'Editar Iiee'
    },
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  created() {
    this.initialize();

  },
  methods: {
    async initialize() {
      let datos = await axios.get(`${this.endpoint}/api/v1/asesores/${this.$route.params.asesor_id}/show`);
    // console.log('iees',datos)
      let datos_procesado = {
        id: datos.data.id,
        dni: datos.data.dni,
        nombre:  datos.data.name,
        email:  datos.data.email
      };
      this.asesor = datos_procesado;
    //   llamamos a los colegios asignados
      let datos1 = await axios.get(`${this.endpoint}/api/v1/asesores/${this.$route.params.asesor_id}/iiees`);
        let datos_procesado1 = await datos1.data.map(obj => ({
        id: obj.id,
        iiee_id: obj.iiee_id,
        iiee_codigo_modular: obj.iiee.codigo_modular,
        iiee_nombre: obj.iiee.nombre,
        iiee_nivel: obj.iiee.nivel,
        iiee_centro_poblado: obj.iiee.centro_poblado,
        iiee_local: obj.iiee.local,
        iiee_direccion:obj.iiee.direccion
      }));
       this.iiees_asignadas = datos_procesado1;

    //   llamamos a los colegios
      let datos2 = await axios.get(`${this.endpoint}/api/v1/iiee`);
        let datos_procesado2 = await datos2.data.map(obj => ({
        id: obj.id,
        nombre: obj.codigo_modular+' | '+obj.nombre+' | '+obj.nivel+' | '+obj.centro_poblado+' | '+obj.local,
      }));
       this.iiees = datos_procesado2;
    },
    editItem(item) {
      this.editedIndex = this.iiees_asignadas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.iiees_asignadas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
        console.log('this.editedItem:',this.editedItem.id);
        let datos = await axios.get(`${this.endpoint}/api/v1/asesores/asesor/iiees/${this.editedItem.id}/delete`);
        console.log('eliminando id',datos.data);
        if(datos.data){
            this.iiees_asignadas.splice(this.editedIndex, 1)
            this.closeDelete()
        }
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      this.editedItem.ugel_id = this.ugel_id_;
      if (this.editedIndex > -1) {
        let datos = await axios.put(`${this.endpoint}/api/v1/asesores/${this.$route.params.asesor_id}/iiees/update`, this.editedItem);
        console.log('datos.dataeeee:',datos.data);
        if (datos.data) {
            let datos_procesado = {
                id: datos.data.id,
                iiee_id: datos.data.iiee_id,
                iiee_codigo_modular: datos.data.iiee.codigo_modular,
                iiee_nombre: datos.data.iiee.nombre,
                iiee_nivel: datos.data.iiee.nivel,
                iiee_centro_poblado: datos.data.iiee.centro_poblado,
                iiee_local: datos.data.iiee.local,
                iiee_direccion:datos.data.iiee.direccion
            };
          Object.assign(this.iiees_asignadas[this.editedIndex], datos_procesado);
          this.editedItem = this.defaultItem;
        } else {
          console.log(datos.data)
        }
      } else {
        let datos = await axios.post(`${this.endpoint}/api/v1/asesores/${this.$route.params.asesor_id}/iiees/store`, this.editedItem);
        console.log('store', datos.data);
        if (datos.data) {
            let datos_procesado = {
                id: datos.data.id,
                iiee_id: datos.data.iiee_id,
                iiee_codigo_modular: datos.data.iiee.codigo_modular,
                iiee_nombre: datos.data.iiee.nombre,
                iiee_nivel: datos.data.iiee.nivel,
                iiee_centro_poblado: datos.data.iiee.centro_poblado,
                iiee_local: datos.data.iiee.local,
                iiee_direccion:datos.data.iiee.direccion
            };
          this.iiees_asignadas.push(datos_procesado);
          this.editedItem = this.defaultItem;
        } else {
          console.log(datos.data)
        }
      }
      this.close()
    },

  }
}
</script>
