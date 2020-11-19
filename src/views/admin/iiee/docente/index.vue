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
            <v-data-table :headers="headers" :items="docentes" sort-by="calories" class="elevation-1">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Docentes </v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="green" dark class="mb-2" v-bind="attrs" v-on="on">
                        Nuevo Docente
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
                              <v-select :items="areas_curriculares" v-model="editedItem.area_especializacion" item-value="nombre" item-text="nombre" label="Area curricular"></v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field v-model="editedItem.dni" label="Dni"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="12" md="12">
                              <v-text-field v-model="editedItem.name" label="nombre"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
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
        text: 'Docentes',
        disabled: true,
        href: 'breadcrumbs_link_1',
      }
    ],
    iiee:[],
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
        value: 'name'
      },
      {
        text: 'Email',
        value: 'email'
      },
      {
        text: 'Especializacion',
        value: 'area_especializacion'
      },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false
      },
    ],
    docentes:[],
    areas_curriculares:[],
    departamento:'',
    provincia: '',
    distrito: '',
    editedIndex: -1,
    editedItem: {
        id: 0,
        area_especializacion: '',
        user_id: 0,
        dni:'',
        email:'',
        name:'',
        rol:''
    },
    // niveles: [{
    //   nombre: 'INICIAL'
    // }, {
    //   nombre: 'PRIMARIA'
    // }, {
    //   nombre: 'SECUNDARIA'
    // }],
    ugel_id_: 0,
    defaultItem: {
        id: 0,
        area_especializacion: '',
        user_id: 0,
        dni:'',
        email:'',
        name:'',
        rol:''
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
      return this.editedIndex === -1 ? 'Nuevo Docente' : 'Editar Docente'
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
        //   listamos los docentes que se agregaron a este colegio
        let datos1 = await axios.get(`${this.endpoint}/api/v1/iiee/1/${this.$route.params.iiee_id}/docentes`);
        let datos_procesado1 = await datos1.data.map(obj => ({
        id: obj.id,
        area_especializacion: obj.area_especializacion,
        user_id: obj.user_id,
        dni:obj.user.dni,
        email:obj.user.email,
        name:obj.user.name,
        rol:obj.user.rol
      }));
      this.docentes = datos_procesado1;

    //   this.editedItem.nivel = this.niveles[0].nombre;

      //   Obtenemos las areas curriculares
      let datos_areas_curriculares = await axios.get(`${this.endpoint}/api/v1/areas-curriculares`);
      let datos_procesado2 = await datos_areas_curriculares.data.map(obj => ({
        id: obj.id,
        nombre: obj.nivel+'->'+obj.nombre,
      }));
      this.areas_curriculares = datos_procesado2;
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
      this.editedIndex = this.docentes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.docentes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
        console.log('this.editedItem:',this.editedItem.id);
        let datos = await axios.delete(`${this.endpoint}/api/v1/iiee/${this.editedItem.id}/docente/delete`);
        console.log('eliminando id',datos.data);
        if(datos.data){
            this.docentes.splice(this.editedIndex, 1)
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
        let datos = await axios.put(`${this.endpoint}/api/v1/iiee/${this.editedItem.id}/docente/update`, this.editedItem);
        if (datos.data) {
            let datos_procesado1 = {
                id: datos.data.id,
                area_especializacion: datos.data.area_especializacion,
                user_id: datos.data.user_id,
                dni:datos.data.user.dni,
                email:datos.data.user.email,
                name:datos.data.user.name,
                rol:datos.data.user.rol
            };
          Object.assign(this.docentes[this.editedIndex], datos_procesado1);
          this.editedItem = this.defaultItem;
        } else {
          console.log(datos.data)
        }
      } else {
        let datos = await axios.post(`${this.endpoint}/api/v1/iiee/${this.iiee.id}/docente/store`, this.editedItem);
        console.log('store', datos.data);
        if (datos.data) {
            let datos_procesado1 = {
                id: datos.data.id,
                area_especializacion: datos.data.area_especializacion,
                user_id: datos.data.user_id,
                dni:datos.data.user.dni,
                email:datos.data.user.email,
                name:datos.data.user.name,
                rol:datos.data.user.rol
            };
          this.docentes.push(datos_procesado1);
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
