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
            <v-data-table :headers="headers" :items="iiees" sort-by="calories" class="elevation-1">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Iiees <span>(Instituciones educativas</span> </v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="800px">
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
                            <v-col cols="12" sm="6" md="3">
                              <v-text-field v-model="editedItem.codigo_modular" label="Codigo modular"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                              <v-select :items="niveles" v-model="editedItem.nivel" item-value="nombre" item-text="nombre" label="Nivel"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select :items="departamentos" v-model="editedItem.departamento" item-value="id" item-text="nombre" label="Departamento" @change="getProvincias(editedItem.departamento)"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-skeleton-loader v-if="loader_provincia" class="mx-auto" max-width="300" type="list-item"></v-skeleton-loader>
                              <v-select v-if="!loader_provincia" :items="provincias" item-value="id" item-text="nombre" v-model="editedItem.provincia" label="Provincia" @change="getDistritos(editedItem.provincia)"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-skeleton-loader v-if="loader_distrito" class="mx-auto" max-width="300" type="list-item"></v-skeleton-loader>
                              <v-select v-if="!loader_distrito" :items="distritos" item-value="id" item-text="nombre" v-model="editedItem.distrito" label="Distrito"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field v-model="editedItem.centro_poblado" label="Centro Poblado"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field v-model="editedItem.local" label="Local"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field v-model="editedItem.direccion" label="Direccion"></v-text-field>
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
                <v-btn fab dark small color="warning" @click="editItem(item)">
                  <v-icon>
                    mdi-pencil
                  </v-icon>
                </v-btn>
                <v-btn dark small color="primary" @click="editItem(item)">
                  <v-icon>
                    mdi-plus-circle
                  </v-icon>Grados
                </v-btn>
                <v-btn fab dark small color="red" @click="deleteItem(item)">
                  <v-icon @click="deleteItem(item)">
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
        text: 'Iiees',
        disabled: true,
        href: 'breadcrumbs_link_1',
      }
    ],
    anios: [2019, 2020, 2021, 2022],
    dialog: false,
    dialogDelete: false,
    headers: [{
        text: 'Codigo modular',
        align: 'start',
        sortable: false,
        value: 'codigo_modular',
      },
      {
        text: 'Nombre',
        value: 'nombre'
      },
      {
        text: 'Nivel',
        value: 'nivel'
      },
      {
        text: 'Centro pobl.',
        value: 'centro_poblado'
      },
      {
        text: 'Local',
        value: 'local'
      },
      {
        text: 'Direccion',
        value: 'direccion'
      },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false
      },
    ],
    iiees: [],
    departamentos: [],
    provincias: [],
    distritos: [],
    editedIndex: -1,
    editedItem: {
      codigo_modular: '',
      nombre: '',
      nivel: '',
      departamento: 0,
      provincia: 0,
      distrito: 0,
      centro_poblado: '',
      local: '',
      direccion: '',
      ugel_id: 0,
    },
    niveles: [{
      nombre: 'INICIAL'
    }, {
      nombre: 'PRIMARIA'
    }, {
      nombre: 'SECUNDARIA'
    }],
    ugel_id_: 0,
    defaultItem: {
      codigo_modular: '',
      nombre: '',
      nivel: '',
      departamento: 0,
      provincia: 0,
      distrito: 0,
      centro_poblado: '',
      local: '',
      direccion: '',
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
    this.getDepartamentos();
    // this.getProvincias();
    // this.getDistritos();
  },
  methods: {
    async initialize() {

      let datos = await axios.get(`${this.endpoint}/api/v1/iiee`);
      let datos_procesado = await datos.data.map(obj => ({
        id: obj.id,
        codigo_modular: obj.codigo_modular,
        nombre: obj.nombre,
        nivel: obj.nivel,
        departamento: parseInt(obj.departamento),
        provincia: parseInt(obj.provincia),
        distrito: parseInt(obj.distrito),
        centro_poblado: obj.centro_poblado,
        local: obj.local,
        direccion: obj.direccion,
        ugel_id: obj.ugel_id,
      }));
      this.iiees = datos_procesado;
      this.editedItem.nivel = this.niveles[0].nombre;

      //   Obtenemos el id de la ugel
      let datos_ugel = await axios.get(`${this.endpoint}/api/v1/ugel/1`);
      console.log('ugel_id', datos_ugel.data[0].id);
      this.ugel_id_ = datos_ugel.data[0].id;
    },
    async getDepartamentos() {

      let datos = await axios.get(`${this.endpoint}/api/v1/departamentos`);

      let datos_procesado = await datos.data.map(obj => ({
        id: obj.id,
        nombre: obj.name
      }));
      this.departamentos = datos_procesado;
    },
    async getProvincias(departamento_id) {
      this.loader_provincia = true;
      let datos = await axios.get(`${this.endpoint}/api/v1/${departamento_id}/provincias`);

      let datos_procesado = await datos.data.map(obj => ({
        id: obj.id,
        nombre: obj.name
      }));
      this.provincias = datos_procesado;
      this.loader_provincia = false;
    },
    async getDistritos(provincia_id) {
      this.loader_distrito = true;
      let datos = await axios.get(`${this.endpoint}/api/v1/${provincia_id}/distritos`);

      let datos_procesado = await datos.data.map(obj => ({
        id: obj.id,
        nombre: obj.name
      }));
      this.distritos = datos_procesado;
      this.loader_distrito = false;
    },
    editItem(item) {
      this.editedIndex = this.iiees.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.getProvincias(this.editedItem.departamento);
      this.getDistritos(this.editedItem.provincia);
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.iiees.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.iiees.splice(this.editedIndex, 1)
      this.closeDelete()
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
        let datos = await axios.put(`${this.endpoint}/api/v1/iiee/${this.editedItem.id}/update`, this.editedItem);
        if (datos.data) {
          Object.assign(this.iiees[this.editedIndex], this.editedItem);
          this.editedItem = this.defaultItem;
        } else {
          console.log(datos.data)
        }
      } else {
        let datos = await axios.post(`${this.endpoint}/api/v1/iiee/store`, this.editedItem);
        console.log('store', datos.data);
        if (datos.data) {
          this.iiees.push(this.editedItem);
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
