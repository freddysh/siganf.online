<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-breadcrumbs :items="breadcrumbs" class="py-0">
          <template v-slot:divider>
            <v-icon>mdi-forward</v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>
      <v-col cols="12" class="px-3">
        <v-card elevation="3" outlined>
          <v-card-title>
            <h3 class="primary--text">Mis Asesorias</h3>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4">
                <v-container>
                  <v-row>
                    <v-col cols="6" sm='6' md="6">
                      <v-select :items="anios" label="Año" v-model="form.anio"></v-select>
                    </v-col>
                    <v-col cols="6" sm='6' md="6">
                      <v-select autocomplete :items="meses" item-value="nro" item-text="nombre" label="Mes" v-model="form.mes"></v-select>
                    </v-col>
                    <v-col cols="12" sm='12'>
                      <v-select autocomplete :items="dres" v-model="dres[0]" item-value="id" item-text="nombre" label="Dre"></v-select>
                    </v-col>
                    <v-col cols="12" sm='12'>
                      <v-select autocomplete :items="ugeles" v-model="ugeles[0]" item-value="nro" item-text="nombre" label="Ugel"></v-select>
                    </v-col>
                    <v-col cols="12" sm='12'>
                      <v-select autocomplete :items="iiees" item-value="id" item-text="nombre" label="Iiee" v-model="form.iiee_id"> </v-select>
                    </v-col>
                    <v-col cols="12" sm='12'>
                      <v-select autocomplete :items="estados" item-value="nro" item-text="nombre" label="Estado" v-model="form.estado"></v-select>
                    </v-col>
                    <v-col>
                      <v-btn block color="primary" @click="filtrar()">Buscar</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
              <v-col cols="12" sm="8">
                <v-row>
                  <v-col cols="12" class="my-0 py-0">
                    <v-row>
                      <v-col cols="12" sm="12" md="8">
                        <h2>Relacion de asesorias</h2>
                      </v-col>
                      <v-col cols="12" sm="12" md="4" class="text-rigth">
                        <v-btn color="green" class="ma-2 white--text" @click="ruta('asesorias.agregar')">
                          <v-icon right dark>
                            mdi-plus
                          </v-icon> Agregar asesoria
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" class="my-0 py-0">
                    <v-skeleton-loader v-if="loader" v-bind="attrs" type="table-heading, list-item-two-line, image, table-tfoot"></v-skeleton-loader>
                    <v-simple-table v-if="!loader" dense>
                      <template v-slot:default>
                        <thead class="primary">
                          <tr>
                            <th class="text-left white--text">
                              #
                            </th>
                            <th class="text-left  white--text">
                              Año
                            </th>
                            <th class="text-left  white--text">
                              Mes
                            </th>
                            <th class="text-left  white--text">
                              Docente
                            </th>
                            <th class="text-left  white--text">
                              Codigo modular
                            </th>
                            <th class="text-left  white--text">
                              Iiee
                            </th>
                            <th class="text-left  white--text">
                              Fecha ejecutada
                            </th>
                            <th class="text-left  white--text">
                              Operaciones
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item,i) in asesorias" :key="i">
                            <td>{{ i+1 }}</td>
                            <td>{{ item.anio }}</td>
                            <td>{{ item.mes }}</td>
                            <td>{{ item.docente }}</td>
                            <td>{{ item.codigo_modular }}</td>
                            <td>{{ item.iiee }}</td>
                            <td>{{ item.fecha_ejecutada }}</td>
                            <!--<td>
                              <v-chip v-if="item.estado==0" class="ma-2" color="primary" text-color="white">
                                Registrado
                              </v-chip>
                              <v-chip v-else class="ma-2" color="green" text-color="white">
                                Enviado
                              </v-chip>
                            </td>-->
                            <td>
                              <v-btn-toggle v-model="icon" borderless>
                                <v-btn class="mx-0" dark small color="primary" @click="asesoriaShow(item.id)">
                                  <v-icon dark color="white">
                                    mdi-eye
                                  </v-icon> ({{ item.dias }} Dias) Ver
                                </v-btn>
                                <v-btn v-if="item.estado==0" class="mx-0" dark small color="green" @click="confir_enviar(item.id)">
                                  <v-icon dark color="white">
                                    mdi-cube-send
                                  </v-icon>
                                </v-btn>
                                <v-btn class="mx-0" dark small color="red" @click="confir_eliminar(item.id)">
                                  <v-icon dark color="white">
                                    mdi-trash-can
                                  </v-icon>
                                </v-btn>
                              </v-btn-toggle>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
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
  data: () => ({
    icon: 'justify',
    loader: false,
    attrs: {
      class: 'mb-6',
      boilerplate: true,
      elevation: 2,
    },
    user_id: 1,
    breadcrumbs: [{
        text: 'Inicio',
        disabled: false,
        href: '',
      },
      {
        text: 'Ejecucion',
        disabled: false,
        href: '',
      },
      {
        text: 'Mis asesorias',
        disabled: true,
        href: 'breadcrumbs_link_1',
      }
    ],
    anios: [2019, 2020, 2021, 2022],
    meses: [{
      nro: 1,
      nombre: 'Enero'
    }, {
      nro: 2,
      nombre: 'Febrero'
    }, {
      nro: 3,
      nombre: 'Marzo'
    }, {
      nro: 4,
      nombre: 'Abril'
    }, {
      nro: 5,
      nombre: 'Mayo'
    }, {
      nro: 6,
      nombre: 'Junio'
    }, {
      nro: 7,
      nombre: 'Julio'
    }, {
      nro: 8,
      nombre: 'Agosto'
    }, {
      nro: 9,
      nombre: 'Setiembre'
    }, {
      nro: 10,
      nombre: 'Octubre'
    }, {
      nro: 11,
      nombre: 'Noviembre'
    }, {
      nro: 12,
      nombre: 'Diciembre'
    }],
    dres: [{
      id: 1,
      nombre: 'NINGUNO'
    }],
    ugeles: [{
      nro: 1,
      nombre: 'UNIDAD DE GESTION EDUCATIVA LOCAL'
    }],
    iiees: [{
      id: 1,
      nombre: 'COLEGIO X'
    }],
    estados: [{
      nro: 0,
      nombre: 'Registrado'
    }, {
      nro: 1,
      nombre: 'Enviado'
    }],
    asesorias: [],
    form: {
      anio: new Date().getFullYear(),
      mes: new Date().getMonth() + 1,
      estado: 0,
      acompanante_id: 1,
      iiee_id: 0
    }
  }),
  computed: {
    ...mapGetters({
      endpoint: 'user/endpoint',
      usuarioLogeado: 'user/usuarioLogeado',
    })
  },
  created() {
    this.listarDre();
    this.listarUgel();
    this.listarColegios();
  },
  methods: {
    async listarDre() {
      try {
        let rpt = await axios.get(`${this.endpoint}/api/v1/dre`);
        let rpt_procesada = await rpt.data.map(res => ({
          id: res.id,
          nombre: res.nombre
        }));
        this.dres = rpt_procesada;
      } catch (error) {
        console.log(error);
      }
    },
    async listarUgel() {
      try {
        let rpt = await axios.get(`${this.endpoint}/api/v1/ugel/1`);
        // console.log(rpt.data);
        let rpt_procesada = await rpt.data.map(res => ({
          id: res.id,
          nombre: res.nombre
        }));
        this.ugeles = rpt_procesada;
        // console.log(rpt_procesada);
      } catch (error) {
        console.log(error);
      }
    },
    async listarColegios() {
      try {
        let rpt = await axios.get(`${this.endpoint}/api/v1/iiee/${this.usuarioLogeado}`);
        // console.log(rpt.data);
        let rpt_procesada = await rpt.data.map(res => ({
          id: res.iiee.id,
          nombre: res.iiee.nombre
        }));
        this.iiees = rpt_procesada;
        // console.log(rpt_procesada);
      } catch (error) {
        console.log(error);
      }
    },
    async filtrar() {
      try {
        this.loader = !this.loader;
        let rpt = await axios.post(`${this.endpoint}/api/v1/asesoria`, this.form);
        // console.log('rpt filtro:', rpt);
        let rpt_procesada = await rpt.data.map(res => ({
          id: res.id,
          anio: res.anio,
          mes: res.mes,
          docente: res.docente ? res.docente.name : null,
          codigo_modular: res.iiee ? res.iiee.codigo : null,
          iiee: res.iiee ? res.iiee.nombre : null,
          fecha_ejecutada: res.fecha_envio,
          estado: res.estado,
          dias: res.dias.length
        }));
        this.asesorias = rpt_procesada;

        this.loader = !this.loader;
        // console.log(rpt_procesada);
      } catch (error) {
        console.log(error);
      }
    },
    asesoriaShow(asesoria_id) {
      this.$router.push({
        name: 'asesorias.show',
        params: {
          asesoria_id
        }
      })
    },
    ruta(ruta_) {
      this.$router.push({
        name: ruta_
      })
    },
    confir_eliminar(asesoria_id) {
      this.$swal.fire({
        title: 'Recuerda',
        text: "Una vez borrado los datos no se podran recuperar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, proceder!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.eliminar(asesoria_id);
        }
      })
    },
    async eliminar(asesoria_id) {
      try {
        let rpt = await axios.get(`${this.endpoint}/api/v1/asesoria/${asesoria_id}/delete`);
        console.log(rpt);
        if (rpt.data == true) {
          const index = this.asesorias.findIndex(asesoria_ => asesoria_.id === asesoria_id);
          this.asesorias.splice(index, 1);
          this.$swal.fire(
            'Hecho!',
            'Datos borados correctamente.',
            'success'
          )
        } else {
          console.log(rpt.data);
          this.$swal.fire(
            'Opps!',
            'Ocurrio un error.',
            'error'
          )
        }
        // console.log(rpt_procesada);
      } catch (error) {
        console.log(error);
      }
    },
    confir_enviar(asesoria_id) {
      this.$swal.fire({
        title: 'Recuerda',
        text: "Revise todos los datos antes de enviar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, proceder!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.enviar(asesoria_id);
        }
      })
    },
    async enviar(asesoria_id) {
      try {
        let rpt = await axios.get(`${this.endpoint}/api/v1/asesoria/${asesoria_id}/enviar`);
        console.log(rpt);
        if (rpt.data == true) {
          const index = this.asesorias.findIndex(asesoria_ => asesoria_.id === asesoria_id);
          this.asesorias.splice(index, 1);
          this.$swal.fire(
            'Hecho!',
            'Datos enviados correctamente.',
            'success'
          )
        } else {
          console.log(rpt.data);
          this.$swal.fire(
            'Opps!',
            'Ocurrio un error.',
            'error'
          )
        }
        // console.log(rpt_procesada);
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>
