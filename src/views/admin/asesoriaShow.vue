<template>
  <div>
    <v-container>
      <v-card elevation="2" outlined tile>
        <v-card-title>
          <v-row>
          <v-col >
          <h3 color="primary">Asesoria</h3></v-col>
          <v-col align="right">
          <v-btn color="secondary" dark @click="regresar()"><v-icon>mdi-skip-previous</v-icon> Atras</v-btn>
          </v-col>
          </v-row>
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
            </b><b :class="asesoria.estado?'green--text':'secondary--text'">{{  estado  }}</b>
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
              <v-simple-table fixed-header height="auto" dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                    <th class="text-left">Marcar
                      </th>
                      <th class="text-left">
                        Dia
                      </th>
                      <th class="text-left">
                        Fecha, duración
                      </th>
                      <th class="text-left">
                        Estado
                      </th>
                      <th class="text-left">
                        Operaciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in asesoria.dias" :key="item.name">
                    <td>
                    <v-checkbox
                    v-model="lista_a_enviar"
                    label=""
                    color="success"
                    :value="item.id"
                    hide-details
                    ></v-checkbox>
                    </td>
                      <td># {{ item.dia }}</td>
                      <td>{{ item.fecha }}, {{ item.hora_duracion }}</td>
                      <td>
                      <v-chip v-if="item.estado==0"
                        color="warning"
                        >Falta enviar</v-chip>
                        <v-chip v-if="item.estado==1"
                        color="green"
                        >Enviado</v-chip></td>
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
              <v-col>
                <v-btn color="primary" block @click="confirm_enviar()"> <v-icon dark>mdi-send</v-icon> Enviar </v-btn>
              </v-col>
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
      },
      lista_a_enviar:[],
      lista:''
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
    },
    confirm_enviar(){
        this.$swal.fire({
        title: 'Recuerda',
        text: "Estad seguro de enviar los "+this.lista_a_enviar.length+" dias",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, proceder!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.enviar();
        }
      })
    },
    async enviar(){
        let tam=this.lista_a_enviar.length;
        this.lista=[];
        for(let i=0;i<tam;i++){
            // this.lista+=this.lista_a_enviar[i]+'_';
            let valor={id:parseInt(this.lista_a_enviar[i])}
            this.lista.push(valor);
        }
        console.log('lista a enviar:',this.lista);
        // let datos = await axios.post(`${this.endpoint}/api/v1/asesores/${this.$route.params.asesor_id}/iiees/store`, this.editedItem);

        let rpt = await axios.post(`${this.endpoint}/api/v1/dia/enviar`,this.lista);
        console.log('respuesta:',rpt);
        let rpt1=await rpt.data;
        if(rpt1){
          this.$swal.fire(
            'Hecho!',
            'Datos enviados correctamente.',
            'success'
          );
        console.log('enviando a refrescar');
        this.$router.go();
        //   this.$router.push({
        //     name: 'asesorias.show',
        //     params: {
        //       'asesoria_id': this.asesoria_id
        //     }
        //   }).catch(() => {});
        }
        else{
            this.$swal.fire(
            'Opps!',
            'Ocurrio un error, es posible que no haya escojido ningun dia',
            'warning'
          );
        }
    }
    ,regresar(){
        this.$router.push({
            name: 'Asesorias'
          })
    }
  }
}
</script>
