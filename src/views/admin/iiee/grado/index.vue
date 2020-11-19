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
          <b class="primary--text">{{ iiee.codigo_modular }}</b>|
          <b class="primary--text">{{ iiee.nombre }}</b>|
          <b class="primary--text">{{ iiee.nivel }}</b>|
          <b class="primary--text">{{ iiee.centro_poblado }}</b>|
          <b class="primary--text">{{ iiee.local }}</b>|
          <b class="primary--text">{{ iiee.direccion }}</b>|
          <b class="primary--text">{{ departamento }}</b> >
          <b class="primary--text">{{ provincia }}</b> >
          <b class="primary--text">{{ distrito }}</b>
          </p>
          <v-divider></v-divider>
            <v-data-table :headers="headers" :items="grados" sort-by="calories" class="elevation-1">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Grados </v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="800px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="green" dark class="mb-2" v-bind="attrs" v-on="on">
                        Nueva Grado
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
                              <v-select :items="niveles" v-model="editedItem.nivel" item-value="id" item-text="nombre" label="Nivel"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
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
        text: 'Iiees',
        disabled: true,
        href: 'breadcrumbs_link_1',
      },
      {
        text: 'Grados',
        disabled: true,
        href: 'breadcrumbs_link_1',
      }
    ],
    iiee:[],
    dialog: false,
    dialogDelete: false,
    headers: [{
        text: 'Nivel',
        align: 'start',
        sortable: false,
        value: 'nivel',
      },
      {
        text: 'Nombre',
        value: 'nombre'
      },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false
      },
    ],
    grados:[],
    departamento:'',
    provincia: '',
    distrito: '',
    editedIndex: -1,
    editedItem: {
      nivel: '',
      nombre: '',
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

      let datos = await axios.get(`${this.endpoint}/api/v1/iiee/${this.$route.params.iiee_id}/show`);
      console.log('datos:',datos.data);
      let datos_procesado = await datos.data.map(obj => ({
        id: obj.id,
        codigo_modular: obj.codigo_modular,
        nombre: obj.nombre,
        nivel: obj.nivel,
        departamento_id: parseInt(obj.departamento),
        provincia_id: parseInt(obj.provincia),
        distrito_id: parseInt(obj.distrito),
        centro_poblado: obj.centro_poblado,
        local: obj.local,
        direccion: obj.direccion,
        ugel_id: obj.ugel_id,
      }));
      this.iiee = datos_procesado[0];
      console.log('departamento_id:',this.iiee.departamento_id);
        //   listamos los grados
        let datos1 = await axios.get(`${this.endpoint}/api/v1/iiee/1/${this.$route.params.iiee_id}/grados`);

        let datos_procesado1 = await datos1.data.map(obj => ({
        id: obj.id, nivel: obj.nivel, nombre: obj.nombre
      }));
      this.grados = datos_procesado1;

    //   this.editedItem.nivel = this.niveles[0].nombre;

      //   Obtenemos el id de la ugel
      let datos_ugel = await axios.get(`${this.endpoint}/api/v1/ugel/1`);
      console.log('ugel_id', datos_ugel.data[0].id);
      this.ugel_id_ = datos_ugel.data[0].id;
        this.getDepartamentos();
        this.getProvincias();
        this.getDistritos();
    },
    async getDepartamentos() {
      let datos = await axios.get(`${this.endpoint}/api/v1/departamentos/${this.iiee.departamento_id}/show`);
      this.departamento = datos.data.name;
    },
    async getProvincias() {
      let datos = await axios.get(`${this.endpoint}/api/v1/provincias/${this.iiee.provincia_id}/show`);
      this.provincia =  datos.data.name;
    },
    async getDistritos() {
      let datos = await axios.get(`${this.endpoint}/api/v1/distritos/${this.iiee.distrito_id}/show`);
      this.distrito =  datos.data.name;
    },
    editItem(item) {
      this.editedIndex = this.grados.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.getProvincias(this.editedItem.departamento);
      this.getDistritos(this.editedItem.provincia);
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.grados.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
        console.log('this.editedItem:',this.editedItem.id);
        let datos = await axios.get(`${this.endpoint}/api/v1/grados/${this.editedItem.id}/delete/ld`);
        console.log('eliminando id',datos.data);
        if(datos.data){
            this.grados.splice(this.editedIndex, 1)
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
        let datos = await axios.put(`${this.endpoint}/api/v1/grados/${this.editedItem.id}/update`, this.editedItem);
        if (datos.data) {
          Object.assign(this.grados[this.editedIndex], this.editedItem);
          this.editedItem = this.defaultItem;
        } else {
          console.log(datos.data)
        }
      } else {
        let datos = await axios.post(`${this.endpoint}/api/v1/grados/${this.iiee.id}/store`, this.editedItem);
        console.log('store', datos.data);
        if (datos.data) {
          this.grados.push(this.editedItem);
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
