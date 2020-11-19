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
            <v-data-table :headers="headers" :items="asesores" sort-by="calories" class="elevation-1">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Asesores </v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="green" dark class="mb-2" v-bind="attrs" v-on="on">
                        Nueva Iiee
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
                              <v-text-field v-model="editedItem.dni" label="Dni"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field v-model="editedItem.password" label="Password"></v-text-field>
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
                      <v-card-title class="headline">Esta seguro de borrar esta Iiee?</v-card-title>
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
                <v-btn  dark small color="warning" @click="editItem(item)">
                  <v-icon>
                    mdi-pencil
                  </v-icon>
                </v-btn>
                <v-btn dark small color="primary" @click="agregarGrados(item)">
                  <v-icon>
                    mdi-plus-circle
                  </v-icon>Asiganar Iiees
                </v-btn>
                <v-btn  dark small color="red" @click="deleteItem(item)">
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </template>
              <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">
                  Reset
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
      }
    ],
    dialog: false,
    dialogDelete: false,
    headers: [{
        text: 'Dni',
        align: 'start',
        sortable: false,
        value: 'dni',
      },
      {
        text: 'Nombre',
        value: 'nombre'
      },
      {
        text: 'Email',
        value: 'email'
      },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false
      },
    ],
    asesores: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      nombre: '',
      email: '',
      password: '',
      rol:''
    },
    defaultItem: {
      id: 0,
      nombre: '',
      email: '',
      password: '',
      rol:''
    }
  }),
  computed: {
    ...mapGetters({
      usuarioLogeado: 'user/usuarioLogeado',
      endpoint: 'user/endpoint',
    }),
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Asesor' : 'Editar Asesor'
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
      let datos = await axios.get(`${this.endpoint}/api/v1/asesores`);
      console.log('datos.data:',datos.data);
      let datos_procesado = await datos.data.map(obj => ({
        id: obj.id,
        dni: obj.dni,
        nombre: obj.name,
        email: obj.email,
        password: obj.password,
        // iiees_nro: obj.iiees.lenght
      }));
      this.asesores = datos_procesado;

      //   Obtenemos el id de la ugel
    //   let datos_ugel = await axios.get(`${this.endpoint}/api/v1/ugel/1`);
    //   console.log('ugel_id', datos_ugel.data[0].id);
    //   this.ugel_id_ = datos_ugel.data[0].id;
    },
    editItem(item) {
      this.editedIndex = this.asesores.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.asesores.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
    console.log('this.editedItem:',this.editedItem.id);
        let datos = await axios.get(`${this.endpoint}/api/v1/asesores/${this.editedItem.id}/delete`);
        console.log('eliminando id',datos.data);
        if(datos.data){
        this.asesores.splice(this.editedIndex, 1)
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
      if (this.editedIndex > -1) {
        let datos = await axios.put(`${this.endpoint}/api/v1/asesores/${this.editedItem.id}/update`, this.editedItem);
        if (datos.data) {
          Object.assign(this.asesores[this.editedIndex], this.editedItem);
          this.editedItem = this.defaultItem;
        } else {
          console.log(datos.data)
        }
      } else {
        let datos = await axios.post(`${this.endpoint}/api/v1/asesores/store`, this.editedItem);
        console.log('store', datos.data);
        if (datos.data) {

        let valor={
            id:datos.data.id,
            dni:datos.data.dni,
            nombre:datos.data.name,
            email:datos.data.email,
            password:datos.data.password
            };
          this.asesores.push(valor);
          this.editedItem = this.defaultItem;
        } else {
          console.log(datos.data)
        }
      }
      this.close()
    },
    agregarGrados(item){
        this.$router.push({
        name: 'asesores.iiees',
        params: {
          'asesor_id': item.id,
        }
      })
    }

  }
}
</script>
