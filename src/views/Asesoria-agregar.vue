<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-breadcrumbs :items="breadcrumbs" class="py-0 ">
          <template v-slot:divider>
            <v-icon>mdi-forward</v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>
      <v-col cols="12" class="px-3">
        <v-container fluid>
          <v-card elevation="3" outlined>
            <v-card-title>
              <h3 class="primary--text">Nueva asesoria</h3>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="12">

                  <v-row v-if="form.asesoria_id==0">
                    <v-col cols="6" sm='6' md="1">
                      <v-select :items="anios" label="Año" v-model="form.anio"></v-select>
                    </v-col>
                    <v-col cols="6" sm='6' md="2">
                      <v-select autocomplete :items="meses" item-value="nro" item-text="nombre" label="Mes" v-model="form.mes"></v-select>
                    </v-col>
                    <v-col cols="6" sm='6' md="3">
                        <v-menu v-model="form.menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="form.fecha_envio" label="Fecha de la asesoria" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="form.fecha_envio" @input="form.menu2 = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" md='6'>
                      <v-select @change="mostrar_docentes()" autocomplete :items="iiees" item-value="id" item-text="nombre" label="Iiee" v-model="form.iiee_id"> </v-select>
                    </v-col>
                    <v-col cols="12" md='4'>
                      <v-select autocomplete :items="docentes" item-value="id" item-text="nombre" label="Docentes" v-model="form.docente_id"></v-select>
                    </v-col>

                    <v-col v-if="false" cols="12" md='2'>
                      <v-select autocomplete :items="estados" item-value="nro" item-text="nombre" label="Estado" v-model="form.estado"></v-select>
                    </v-col>
                    <v-col cols="12" md='2'>
                      <v-select autocomplete :items="visitas" item-value="nro" item-text="nombre" label="Se realizo visita?" v-model="form.hay_visita"></v-select>
                    </v-col>
                    <v-col v-if="form.asesoria_id==0" cols="12">
                      <v-btn block color="green" dark @click="crearAsesoria()">Crear asesoria</v-btn>
                    </v-col>
                  </v-row>
                  <NuevoDia v-if="form.asesoria_id>0" :asesoriaid='form.asesoria_id' :iieeid='form.iiee_id' :dia='1' :userid='form.acompanante_id' :hayvisita='form.hay_visita' :diaid='diaid' />

                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-container>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import axios from "axios";
import NuevoDia from '@/components/NuevoDia';
import {
  mapGetters
} from 'vuex'
export default {
  components: {
    NuevoDia
  },
  data: () => ({
    diaid: 0,
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
        disabled: false,
        href: 'breadcrumbs_link_1',
      },
      {
        text: 'Nuevo',
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
    iiees: [],

    docentes: [],
    estados: [{
      nro: 0,
      nombre: 'Registrado'
    }, {
      nro: 1,
      nombre: 'Enviado'
    }],
    visitas: [{
      nro: 0,
      nombre: 'No'
    }, {
      nro: 1,
      nombre: 'Si'
    }],

    form: {
      menu2:false,
      anio: new Date().getFullYear(),
      mes: new Date().getMonth() + 1,
      estado: 0,
      acompanante_id: 0,
      iiee_id: 0,
      docente_id: 0,
      fecha_envio: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
      hay_visita: 1,
      asesoria_id: 0
    }
  }),
  computed: {
    ...mapGetters({
      usuarioLogeado: 'user/usuarioLogeado',
      endpoint: 'user/endpoint',
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
    async mostrar_docentes() {
      try {
        let rpt = await axios.get(`${this.endpoint}/api/v1/iiee/${this.usuarioLogeado}/${this.form.iiee_id}/docentes`);
        console.log(rpt.data);
        let rpt_procesada = await rpt.data.map(res => ({
          id: res.user.id,
          dni: res.user.dni,
          nombre: res.user.dni + ' | ' + res.user.name,
          area_especializacion: res.area_especializacion,
          nivel_educativo: res.iiee.nivel,
        }));
        this.docentes = rpt_procesada;
      } catch (error) {
        console.log(error);
      }
    },
    async crearAsesoria() {
      try {
      this.form.acompanante_id=this.usuarioLogeado;
        let rpt = await axios.post(`${this.endpoint}/api/v1/asesoria/store`, this.form);
        console.log(rpt.data);
        localStorage.setItem('asesoria_id', rpt.data);
        this.form.asesoria_id = rpt.data;
        if (!this.form.hay_visita) {
          this.$router.push({
            name: 'Asesorias'
          });
        }
        // this.$router.push({
        //   name: 'asesoria.dia',
        //   params: {
        //     asesoaria_id: rpt.data
        //   }
        // });
      } catch (error) {
        console.log(error);
      }
    }

  }
}
</script>
