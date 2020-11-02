<template>
  <div>
    <v-container>
      <v-card elevation="2" outlined tile>
        <v-card-title>
          <h3 color="primary">Asesoria</h3>
        </v-card-title>
        <v-card-text>
          <p><b class="primary--text">
              <v-icon color="primary">mdi-share-variant-outline</v-icon> Constancia
            </b>{{asesoria.constancia_nro}}
            |
            <b class="primary--text">
              <v-icon color="primary">mdi-calendar</v-icon> Año/mes
            </b>{{asesoria.anio}} / {{asesoria.mes}}
            |
            <b class="primary--text">
              <v-icon color="primary">mdi-calendar</v-icon> Fecha de primer registro
            </b>{{asesoria.fecha_envio}}
            |
            <b class="primary--text">
              <v-icon color="primary">mdi-account-tie</v-icon> Docente
            </b>{{asesoria.docente}}
            |
            <b class="primary--text">
              <v-icon :class="asesoria.estado?'primary--text':'secondary--text'">mdi-email-send</v-icon> Estado
            </b>{{ estado }}
          </p>
          <p>
            <b class="primary--text">
              <v-icon color="primary">mdi-school</v-icon> Iiee
            </b>{{ asesoria.iiee.codigo_modular }} - {{ asesoria.iiee.nombre }} - {{ asesoria.iiee.nivel }} - {{ asesoria.iiee.ugel }}
          </p>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="12" sm="6" md="8">
              <h3>Lista de dias agregados</h3>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-btn dark color="green" @click="agregarAsesoria(0)">
                <v-icon>mdi-plus-circle</v-icon> Agregar dia
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-simple-table fixed-header height="300px" dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Dia
                      </th>
                      <th class="text-left">
                        Fecha
                      </th>
                      <th class="text-left">
                        Operaciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in asesoria.dias" :key="item.name">
                      <td># {{ item.dia }}</td>
                      <td>{{ item.fecha }} [{{ item.hora_inicio }} - {{ item.hora_fin }}]</td>
                      <td>
                        <v-btn dark color="warning" @click="agregarAsesoria(item.id)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn dark color="red" @click="confir_eliminar(item.id)">
                          <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import {
  mapGetters
} from 'vuex'
export default {
  props: [],
  data() {
    return {
      asesoria_id: this.$route.params.asesoria_id,
      asesoria: {
        id: 0,
        anio: '',
        mes: '',
        constancia_nro: '',
        fecha_envio: '',
        estado: 0,
        hay_visita: 0,
        docente: '',
        dias: [],
        iiee: []
      }
    }
  },
  created() {
    this.LlamarDatos();
  },
  computed: {
    estado() {
      return this.asesoria.estado ? 'Enviado' : 'Registrado'
    },
    ...mapGetters({
      endpoint: 'user/endpoint',
    })
  },
  methods: {
    async LlamarDatos() {
      try {
        let rpt = await axios.get(`${this.endpoint}/api/v1/asesoria/${this.asesoria_id}`);
        console.log('rpt', rpt.data)
        let rpt_procesada = await rpt.data.map(res => ({
          id: res.id,
          anio: res.anio,
          mes: res.mes,
          constancia_nro: res.constancia_nro,
          fecha_envio: res.fecha_envio,
          estado: res.estado,
          hay_visita: res.hay_visita,
          docente: res.docente.name,
          dias: res.dias,
          iiee: res.iiee
        }));
        this.asesoria = rpt_procesada[0];
      } catch (error) {
        console.log(error);
      }
    },
    agregarAsesoria(diaid) {
      this.$router.push({
        name: 'asesorias.crear',
        params: {
          'asesoria_id': this.asesoria_id,
          'diaid': diaid
        }
      })
    },
    confir_eliminar(eliminar_dia_id) {
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
          this.eliminar(eliminar_dia_id);
        }
      })
    },
    async eliminar(eliminar_dia_id) {
      try {
        let rpt = await axios.get(`${this.endpoint}/api/v1/dia/${eliminar_dia_id}/delete`);
        console.log(rpt);
        if (rpt.data == true) {
          const index = this.asesoria.dias.findIndex(dias_ => dias_.id === eliminar_dia_id);
          this.asesoria.dias.splice(index, 1);
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
    }
  }
}
</script>
