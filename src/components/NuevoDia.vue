<template>
  <v-row>
    <v-col v-if="hayvisita" cols="12" sm="12" md="12" lg="12">
      <v-container fluid>
        <v-card elevation="3" outlined>
          <v-card-text>
            <v-form ref="form1" v-model="valid" @submit.prevent="cofirmar">
              <v-row>
                <v-col cols="12">
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

                </v-col>
                <v-col cols="12">
                  <h2>ASESORIA PEDAGOGICA/COMPROMISOS (DIA {{ form.dia_ }})</h2>
                </v-col>
                <v-col cols="12">
                  <p><b>Fecha de la asesoría pedágogica</b></p>
                </v-col>
                <v-col cols="6" sm='6' md="3">
                  <v-menu v-model="form.menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="form.fecha" label="Fecha" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="form.fecha" @input="form.menu2 = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6" sm='6' md="3">
                  <v-menu ref="menu" v-model="form.hi_menu2" :close-on-content-click="false" :nudge-right="40" :return-value.sync="form.dia_hora_inicio_" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="form.hora_inicio" label="Hora inicio" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-time-picker v-if="form.hi_menu2" v-model="form.hora_inicio" full-width @click:minute="$refs.menu.save(form.dia_hora_inicio_)"></v-time-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6" sm='6' md="3">
                  <v-menu ref="menu" v-model="form.hf_menu2" :close-on-content-click="false" :nudge-right="40" :return-value.sync="form.dia_hora_fin_" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="form.hora_fin" label="Hora fin" prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-time-picker v-if="form.hf_menu2" v-model="form.hora_fin" full-width @click:minute="$refs.menu.save(form.dia_hora_fin_)"></v-time-picker>
                  </v-menu>
                </v-col>
                <v-col cols="4" sm='4' md="2">
                  <v-select v-model="form.nivel_educativo" :items="niveles_educativos" item-value="id" item-text="nombre" label="Nivel educativo" @change="MostrarGrados()" required></v-select>
                </v-col>
                <v-col cols="4" sm='4' md="4">
                  <v-select v-model="form.grados" :items="grados" item-value="id" item-text="nombre" attach chips deletable-chips label="Grados" multiple></v-select>
                </v-col>
                <v-col cols="6" sm='6' md="8">
                  <v-select v-model="form.area_curricular" :items="areas_curriculares" item-value="id" item-text="nombre" attach chips deletable-chips label="Area curricular" multiple></v-select>
                </v-col>

                <v-col cols="12">
                  <p><b>Competencia priorizada en la Asesoria pedagógica</b></p>
                </v-col>

                <v-col v-if="false" cols="6" sm='12' md="12">
                  <v-textarea filled v-model="form.detalle" label="Detalles"></v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-btn color="primary" dark @click="dialog = true">
                    <v-icon large color="white">
                      mdi-plus-circle
                    </v-icon> Agregar competencias
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
                    <v-card>
                      <v-toolbar flat dark color="primary" max-height="60px">
                        <v-btn icon dark @click="dialog = false">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Cerrar</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                          <v-btn dark text @click="dialog = false">
                            <v-icon large color="white">mdi-content-save</v-icon>
                            Guardar
                          </v-btn>
                        </v-toolbar-items>
                      </v-toolbar>
                      <v-card-text>
                        <!--TODO: Agregamos los criterios-->
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">
                                  Competencia
                                </th>
                                <th class="text-left">
                                  Eje
                                </th>
                                <th class="text-left">
                                  Dimension
                                </th>
                                <th class="text-left">
                                  Criterio
                                </th>
                                <th class="text-left">
                                  Aspectos
                                </th>
                                <th class="text-left">
                                  Seleccione segun los aspectos
                                </th>
                                <th class="text-left">
                                  Compromisos
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(item,i) in form.competencias_" :key="i" :class="item.background">
                                <td>{{item.competencia}}</td>
                                <td>{{item.eje}}</td>
                                <td>{{item.dimension}}</td>
                                <td>{{item.criterio}}</td>
                                <td>{{item.aspecto}}</td>
                                <td>
                                  <v-select :items="opciones" item-value="nro" item-text="nombre" v-model="item.opcion"></v-select>
                                </td>
                                <td>
                                  <v-text-field v-model="item.compromiso"></v-text-field>
                                </td>
                                <!--<td>
                              <v-text-field v-show="item.opcion==2" v-model="item.compromiso_2"></v-text-field>
                            </td>
                            <td>
                              <v-text-field v-show="item.opcion==3" v-model="item.compromiso_3"></v-text-field>
                            </td>-->
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </v-col>
                <v-row>
                  <v-col cols="6" sm='12' md="6">
                    <v-select v-model="form.medio_virtual" :items="medios" item-value="id" item-text="nombre" label="Medio por el cual se hizo la asesoria"></v-select>
                  </v-col>
                  <v-col cols="6" sm='12' md="6">
                    <v-text-field v-show="form.medio_virtual=='Otros'" v-model="form.medio_virtual_otros" label="Ingrese una descripción"></v-text-field>
                  </v-col>
                </v-row>
                <v-col cols="12">
                  <v-btn color="primary" dark @click="dialog1 = true">
                    <v-icon large color="white">
                      mdi-plus-circle
                    </v-icon> Agregar criterios/aspectos
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-dialog v-model="dialog1" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
                    <v-card>
                      <v-toolbar flat dark color="primary" max-height="60px">
                        <v-btn icon dark @click="dialog1 = false">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Cerrar</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                          <v-btn dark text @click="dialog1 = false">
                            <v-icon large color="white">mdi-content-save</v-icon>
                            Guardar
                          </v-btn>
                        </v-toolbar-items>
                      </v-toolbar>
                      <v-card-text>
                        <!--TODO: Agregamos los criterios-->
                        <v-simple-table>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">
                                  Criterios
                                </th>
                                <th class="text-left">
                                  Aspectos
                                </th>
                                <th class="text-left">
                                  Opcion 1
                                </th>
                                <th class="text-left">
                                  Opción 2
                                </th>
                                <th class="text-left">
                                  Opción 3
                                </th>
                                <th class="text-left">
                                  Opción 4
                                </th>
                                <th class="text-left">
                                  Respuesta
                                </th>
                                <th class="text-left">
                                  Observación
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(item,i) in form.criterios_" :key="i" :class="item.background">
                                <td>{{item.criterio}}</td>
                                <td>{{item.aspecto}}</td>
                                <td>{{item.opcion_1}}</td>
                                <td>{{item.opcion_2}}</td>
                                <td>{{item.opcion_3}}</td>
                                <td>{{item.opcion_4}}</td>
                                <td>
                                  <v-select :items="criterio_opciones" item-value="nro" item-text="nombre" v-model="item.opcion"></v-select>
                                </td>
                                <td>
                                  <v-text-field v-model="item.observacion"></v-text-field>
                                </td>
                                <!--<td>
                              <v-text-field v-show="item.opcion==2" v-model="item.compromiso_2"></v-text-field>
                            </td>
                            <td>
                              <v-text-field v-show="item.opcion==3" v-model="item.compromiso_3"></v-text-field>
                            </td>-->
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </v-col>
                <v-col cols="6" sm='12' md="12">
                  <v-select v-model="form.p_16" :items="p_16" item-value="id" item-text="nombre" label="El docente plantea proyectos de aprendizaje?"></v-select>
                </v-col>
                <v-col v-if="form.p_16" cols="6" sm='12' md="12">
                </v-col>
                <v-col v-if="form.p_16" cols="6" sm='12' md="12">
                  <v-row>
                    <v-col>
                      <v-select v-model="form.p_17" :items="p_17" item-value="id" item-text="nombre" label="Planteamiento de proyectos y/o experiencias de aprendizaje respondiendo al contexto donde se desenvuelve el estudiante. - Alineación del propósito con las competencias a desarrollar y las características de los estudiantes (1)"></v-select>
                    </v-col>
                    <v-col>
                      <v-text-field v-model="form.obs_p_17" label="Observaciones"></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="form.p_16" cols="6" sm='12' md="12">
                  <v-row>
                    <v-col>
                      <v-select v-model="form.p_18" :items="p_18" item-value="id" item-text="nombre" chips deletable-chips clearable multiple label="Planteamiento de proyectos y/o experiencias de aprendizaje respondiendo al contexto donde se desenvuelve el estudiante. - Alineación del propósito con las competencias a desarrollar y las características de los estudiantes (2)"></v-select>
                    </v-col>
                    <v-col>
                      <v-text-field v-model="form.obs_p_18" label="Observaciones"></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="form.p_16" cols="6" sm='12' md="12">
                  <v-row>
                    <v-col>
                      <v-select v-model="form.p_19" :items="p_19" item-value="id" item-text="nombre" label=" Planteamiento de proyectos y/o experiencias de aprendizaje respondiendo al contexto donde se desenvuelve el estudiante. -Coherencia entre la situación significativa y el propósito de aprendizaje"></v-select>
                    </v-col>
                    <v-col>
                      <v-text-field v-model="form.obs_p_19" label="Observaciones"></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="form.p_16" cols="6" sm='12' md="12">
                  <v-row>
                    <v-col>
                      <v-select v-model="form.p_20" :items="p_20" item-value="id" item-text="nombre" label="Planteamiento de proyectos y/o experiencias de aprendizaje respondiendo al contexto donde se desenvuelve el estudiante. -Definición de criterios de evaluación de acuerdo a las características del estudiante."></v-select>
                    </v-col>
                    <v-col>
                      <v-text-field v-model="form.obs_p_20" label="Observaciones"></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-btn v-if="diaid==0" block color="green" dark type="submit">
                  <v-icon>mdi-send</v-icon> Crear Dia
                </v-btn>
                <v-btn v-if="diaid>0" block color="warning" dark type="submit">
                  <v-icon>mdi-pencil</v-icon> Editar Dia {{dia}}
                </v-btn>

              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import {
  mapGetters
} from 'vuex'
export default {
  props: ['dia', 'iieeid', 'userid', 'hayvisita', 'diaid'],
  data() {
    return {
      valid: false,
      vacioRules: [v => !!v || 'Este valor es requerido', v => v.length < 1 || 'Este valor es requerido'],
      dialog: false,
      dialog1: false,
      areas_curriculares: [],
      niveles_educativos: [{
          id: 'INICIAL',
          nombre: 'INICIAL'
        },
        {
          id: 'PRIMARIA',
          nombre: 'PRIMARIA'
        },
        {
          id: 'SECUNDARIA',
          nombre: 'SECUNDARIA'
        }
      ],
      grados: [{
        id: 1,
        nombre: '1er Grado'
      }],
      form: {
        dia_id: this.diaid,
        dia_: this.dia || 0,
        fecha: new Date().toISOString().substr(0, 10),
        menu: false,
        modal: false,
        menu2: false,
        hora_inicio: '11:30',
        hi_menu2: false,
        hora_fin: '11:30',
        hf_menu2: false,
        medio_virtual: ' ',
        medio_virtual_otros: ' ',
        p_16: 0,
        p_17: ' ',
        obs_p_17: ' ',
        area_curricular: [],
        grados: [],
        asesoria_id: this.$route.params.asesoria_id || null,
        nivel_educativo: ' ',
        p_18: [],
        obs_p_18: ' ',
        p_19: ' ',
        obs_p_19: ' ',
        p_20: ' ',
        obs_p_20: ' ',
        criterios_: [{
          background: 'green lighten-4',
          criterio: '1.1. Soporte emocional.',
          aspecto: "1.1.a. Respuesta empática.",
          opcion_1: "1. No realiza preguntas para conocer el estado emocional de los estudiantes.",
          opcion_2: "2. Realiza preguntas para conocer el estado emocional de los estudiantes, pero no responde de manera empática.",
          opcion_3: "3. Realiza preguntas para conocer el estado emocional de sus estudiantes y responde de manera empática.",
          opcion_4: ".",
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          criterio: '2.1. Comunicación y orientación a las familias considerando su contexto.',
          aspecto: '2.1.a. Comunicación y orientación a las familias.',
          opcion_1: '1. No se ha comunicado con las familias durante la semana.',
          opcion_2: '2. La comunicación docente familia se ha realizado se ha realizado 1 o 2 veces por semana utilizando la lengua materna de las familias.',
          opcion_3: '3. La comunicación docente familia se ha realizado de manera interdiaria utilizando la lengua materna de las familias.',
          opcion_4: "4. La comunicación docente familia se ha realizado de manera utilizando la lengua materna de las familias.",
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          criterio: '.',
          aspecto: '.',
          opcion_1: '1. No se ha comunicado con las familias',
          opcion_2: '2. Se ha comunicado con algunas familias',
          opcion_3: '3. Se ha comunicado con todas las familias',
          opcion_4: ".",
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          criterio: '.',
          aspecto: '.',
          opcion_1: '1. No brinda orientaciones a los padres de familia para dar soporte en el desarrollo de las actividades de aprendizaje.',
          opcion_2: '2. Brinda orientaciones a los padres de familia para dar soporte en el desarrollo de las actividades',
          opcion_3: '.',
          opcion_4: ".",
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          criterio: '.',
          aspecto: '.',
          opcion_1: '1. No orienta a la familia para fomentar el bienestar emocional del estudiante.',
          opcion_2: '2. Orienta a la familia para fomentar el bienestar emocional del estudiante',
          opcion_3: '.',
          opcion_4: ".",
          opcion: 0,
          observacion: ' '
        }, {
          background: 'green lighten-4',
          criterio: '3.1. Conocimiento de la planificación de Aprendo en Casa.',
          aspecto: '3.1.a. Identificación del propósito y las competencias del día de la estrategia Aprendo en Casa',
          opcion_1: '1. El docente no menciona el propósito del día de la estrategia Aprendo en casa.',
          opcion_2: '2. El docente menciona el propósito del día de la estrategia Aprendo en casa',
          opcion_3: '.',
          opcion_4: ".",
          opcion: 0,
          observacion: ' '
        }, {
          background: 'green lighten-4',
          criterio: '.',
          aspecto: '.',
          opcion_1: '1. El docente no menciona las competencias del día de la estrategia Aprendo en casa',
          opcion_2: '2. El docente menciona las competencias del día de la estrategia Aprendo en casa',
          opcion_3: '.',
          opcion_4: ".",
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          criterio: '4.1. Actividades alineadas al propósito de aprendizaje',
          aspecto: '4.1.a. Desarrollo de las actividades correspondientes de Aprendo en Casa',
          opcion_1: '1.El docente desarrolla actividades de Aprendo en Casa,pero no corresponde a la programación del día',
          opcion_2: '2. El docente desarrolla actividades de Aprendo en Casa que corresponde a la programación del día',
          opcion_3: '.',
          opcion_4: ".",
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          criterio: '4.1. Actividades alineadas al propósito de aprendizaje',
          aspecto: '4.1.b. Desarrollo de actividades adicionales alineadas al propósito de aprendizaje',
          opcion_1: '1. El docente no desarrolla actividades adicionales.',
          opcion_2: '2. El docente desarrolla actividades adicionales, pero sin el marco de un proyecto de aprendizaje y',
          opcion_3: '3. El docente desarrolla actividades adicionales en el marco de un proyecto, pero no están alineadas al propósito de aprendizaje , sin embargo, considera el calendario comunal',
          opcion_4: "4. El docente desarrolla actividades adicionales alineadas al propósito de aprendizaje considerando el calendario comunal y las relaciona con el cuaderno de trabajo",
          opcion: 0,
          observacion: ' '
        }, {
          background: 'green lighten-4',
          criterio: '4.2. Desarrollo del pensamiento crítico',
          aspecto: '4.2.a. Desarrollo de actividades que generan pensamiento crítico',
          opcion_1: '1. El docente realiza mayormente actividades y/o preguntas de memorización o repetición literal.',
          opcion_2: '2. El docente realiza mayormente actividades y/o preguntas que permiten',
          opcion_3: '3. El docente realiza mayormente actividades y/o preguntas que permiten el análisis y reflexión',
          opcion_4: ".",
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          criterio: '4.3. Desarrollo de la metacognición',
          aspecto: '4.3.a. Desarrollo de la metacognición',
          opcion_1: '1. No hace preguntas para que el estudiante pueda reflexionar sobre sus aprendizajes (metacognición)',
          opcion_2: '2. Hace preguntas para que el estudiante pueda reflexionar sobre sus aprendizajes',
          opcion_3: '.',
          opcion_4: ".",
          opcion: 0,
          observacion: ' '
        }, {
          background: 'green lighten-4',
          criterio: '4.4. Desarrollo de la interculturalidad.',
          aspecto: '4.4.a. Dialogo de saberes.',
          opcion_1: '1. El docente orienta la profundización de los saberes locales.',
          opcion_2: '2. El docente orienta la identificación de semejanzas y diferencias entre los',
          opcion_3: '3. El docente orienta la resolución de problemas teniendo en cuenta los saberes locales y otros sistemas de conocimientos.',
          opcion_4: ".",
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          criterio: '5.1. Seguimiento y evaluación de los aprendizajes',
          aspecto: '5.1.a. Organización y recolección de evidencias',
          opcion_1: '1. No brinda indicaciones a los estudiantes sobre el medio y/o recurso del contexto que utilizarán para la entrega de actividades/tareas.',
          opcion_2: '2. Brinda indicaciones sobre el medio y/o recurso del contexto que utilizarán',
          opcion_3: '.',
          opcion_4: ".",
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          criterio: '.',
          aspecto: '.',
          opcion_1: '1. No recopila las evidencias de aprendizaje planteadas en Aprendo en casa o adicionales',
          opcion_2: '2. Recopila las evidencias de aprendizaje planteadas en Aprendo en casa o',
          opcion_3: '3. Recopila las evidencias de aprendizaje planteadas en Aprendo en casa o adicionales de manera interdiaria',
          opcion_4: "4. Recopila las evidencias de aprendizaje  planteadas en Aprendo en casa o adicionales de manera diaria",
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          criterio: '.',
          aspecto: '5.1.b. Retroalimentación sobre el aprendizaje',
          opcion_1: '1. No retroalimenta a sus estudiantes',
          opcion_2: '2. Retroalimenta a algunos de sus estudiantes',
          opcion_3: '3. Retroalimenta a todos sus estudiantes',
          opcion_4: '',
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          criterio: '.',
          aspecto: '',
          opcion_1: '1. No retroalimenta a sus estudiantes',
          opcion_2: '2. Responde de manera oral o escrita con palabras muy breves como: “bien”, “mal”,',
          opcion_3: '3. Responde explicando lo que ha hecho bien y lo que puede hacer para mejorar',
          opcion_4: '',
          opcion: 0,
          observacion: ' '
        }, {
          background: 'green lighten-4',
          criterio: '5.2. Comunicación respetuosa',
          aspecto: '5.2.a. Trato respetuoso  hacia sus estudiantes',
          opcion_1: '1. El docente no se comunica de manera respetuosa con sus estudiantes.',
          opcion_2: '2. El docente  se  comunica de manera respetuosa con sus estudiantes',
          opcion_3: '3. El docente  se  comunica de manera respetuosa con sus estudiantes (sin agresión, sin ofender y sin discriminar) tomando en cuenta su cultura y su lengua.',
          opcion_4: '',
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          aspecto: '6.1. Participación en reuniones de trabajo colaborativo (no GIA y no RTC)',
          criterio: '6.1.a. Participación en reuniones de trabajo colaborativo (no GIA y no RTC)',
          opcion_1: '1. No participa en reuniones con sus colegas para reflexionar y plantear mejoras',
          opcion_2: '2. Participa en reuniones con sus colegas para reflexionar y plantear mejoras sobre su práctica pedagógica en relación al modelo de servicio EIB (no GIA y no RTC)',
          opcion_3: '',
          opcion_4: '',
          opcion: 0,
          observacion: ' '
        }, {
          background: 'green lighten-4',
          criterio: '7.1. Uso de recursos tecnológicos en el proceso de enseñanza aprendizaje',
          aspecto: '7.1.a. Uso de recursos tecnológicos en la comunicación con sus estudiantes',
          opcion_1: '1. No usa herramientas tecnológicas para la comunicación',
          opcion_2: '2. Usa al menos una herramienta tecnológica para la comunicación',
          opcion_3: '3. Usa al menos dos herramientas tecnológicas para la comunicación',
          opcion_4: '',
          opcion: 0,
          observacion: ' '
        }, {
          background: 'green lighten-4',
          criterio: '.',
          aspecto: '.',
          opcion_1: '1. No usa herramientas tecnológicas para la colaboración',
          opcion_2: '2. Usa al menos una herramienta tecnológica para la colaboración',
          opcion_3: '3. Usa al menos dos herramientas tecnológicas para la colaboración',
          opcion_4: '',
          opcion: 0,
          observacion: ' '
        }, {
          background: 'green lighten-4',
          criterio: '.',
          aspecto: '.',
          opcion_1: '1. No usa herramientas tecnológicas para la creación de contenidos',
          opcion_2: '2. Usa al menos una herramienta  tecnológica para la creación de contenidos',
          opcion_3: '3. Usa al menos dos herramientas tecnológicas para la creación de contenidos',
          opcion_4: '',
          opcion: 0,
          observacion: ' '
        }, {
          background: 'green lighten-4',
          criterio: '.',
          aspecto: '.',
          opcion_1: '1. No usa herramientas tecnológicas para la evaluación',
          opcion_2: '2. Usa al menos una herramienta tecnológica para la evaluación',
          opcion_3: '3. Usa al menos dos herramientas tecnológicas para la evaluación',
          opcion_4: '',
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          criterio: '8.1. Colaboración y corresponsabilidad con las familias, la comunidad',
          aspecto: '8.1.a. Fortalecimiento de la identidad cultural y lingüística y práctica de valores.',
          opcion_1: '1. No orienta para la implementación de espacios de dialogo en la familia que fortalezcan la identidad cultural y lingüística.',
          opcion_2: '2. Orienta para la implementación de espacios de dialogo en la familia que aportan',
          opcion_3: '3. Orienta para la implementación de espacios de dialogo sobre los saberes y prácticas locales en la familia a fin de contribuir al fortalecimiento de la identidad cultural y lingüística.',
          opcion_4: '',
          opcion: 0,
          observacion: ' '
        }, {
          background: '',
          criterio: '8.1. Colaboración y corresponsabilidad con las familias, la comunidad',
          aspecto: '8.1.b. Sistema de Valores.',
          opcion_1: '1. No fomenta la transmisión y  práctica de valores para el buen vivir*.',
          opcion_2: '2. Fomenta la transmisión y  práctica de valores culturales para el buen vivir*',
          opcion_3: '.',
          opcion_4: '',
          opcion: 0,
          observacion: ' '
        }],
        competencias_: [{
            background: 'green lighten-4',
            competencia: "Competencia 3 y 4",
            eje: "Acompañamiento y soporte emocional a los estudiantes",
            dimension: "1. Soporte emocional",
            criterio: "1.1. Soporte emocional",
            aspecto: "1.1.a. Respuesta empática",
            opcion: 0,
            compromiso: ' '
          }, {
            background: '',
            competencia: 'Competencia 3',
            eje: 'Comunicación e interacción con las familia',
            dimension: '2. Familia y comunidad',
            criterio: '2.1. Comunicación y orientación a las familias',
            aspecto: '2.1.a. Comunicación y orientación a las familias',
            opcion: 0,
            compromiso: ' '
          }, {
            background: 'green lighten-4',
            competencia: 'Competencia 2',
            eje: 'Orientación pedagógica para el logro de aprendizajes',
            dimension: '3. Planificación',
            criterio: '3.1. Conocimiento de la planificación de Aprendo en Casa',
            aspecto: '3.1.a. Identificación del propósito y las competencias del día de la estrategia Aprendo en Casa',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: 'green lighten-4',
            competencia: '.',
            eje: '.',
            dimension: '.',
            criterio: '3.2. Planteamiento de proyectos y/o experiencias de aprendizaje respondiendo al contexto donde se desenvuelve el estudiante.',
            aspecto: '3.2.a. Alineación del propósito con las competencias a desarrollar y las características de los estudiantes',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: 'green lighten-4',
            competencia: '.',
            eje: '.',
            dimension: '.',
            criterio: '.',
            aspecto: '3.2.b. Coherencia entre la situación significativa y el propósito de aprendizaje',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: 'green lighten-4',
            competencia: '.',
            eje: '.',
            dimension: '.',
            criterio: '.',
            aspecto: '3.2.c. Definición de criterios de evaluación',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: '',
            competencia: 'Competencia 4',
            eje: 'Orientación pedagógica para el logro de aprendizajes',
            dimension: '4. Conducción (pensamiento crítico)',
            criterio: '4.1. Actividades alineadas al propósito de aprendizaje',
            aspecto: '4.1.a. Desarrollo de las actividades correspondientes de Aprendo en Casa',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: '',
            competencia: '.',
            eje: '.',
            dimension: '.',
            criterio: '.',
            aspecto: '4.1.b. Desarrollo de actividades adicionales alineadas al propósito de aprendizaje',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: '',
            competencia: '.',
            eje: '.',
            dimension: '.',
            criterio: '4.2. Desarrollo del pensamiento crítico',
            aspecto: '4.2.a. Desarrollo de actividades que generan pensamiento crítico',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: '',
            competencia: '.',
            eje: '.',
            dimension: '.',
            criterio: '4.3. Desarrollo de la metacognición',
            aspecto: '4.3.a. Desarrollo de la metacognición',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: '',
            competencia: '.',
            eje: '.',
            dimension: '.',
            criterio: '4.4. Desarrollo de la interculturalidad.',
            aspecto: '4.4.a. Dialogo de saberes.',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: 'green lighten-4',
            competencia: 'Competencia 5 y 3',
            eje: 'Orientación pedagógica para el logro de aprendizajes',
            dimension: '5. Evaluación y retroalimentación',
            criterio: '5.1. Seguimiento y evaluación de los aprendizajes',
            aspecto: '5.1.a. Organización y recolección de evidencias',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: 'green lighten-4',
            competencia: '.',
            eje: '.',
            dimension: '.',
            criterio: '.',
            aspecto: '5.1.b. Retroalimentación sobre el aprendizaje',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: 'green lighten-4',
            competencia: '.',
            eje: '.',
            dimension: '.',
            criterio: '5.2. Comunicación respetuosa',
            aspecto: '5.2.a. Trato respetuoso hacia sus estudiantes',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: '',
            competencia: 'Competencia 6',
            eje: 'Trabajo colaborativo. Comunidades virtuales de aprendizaje',
            dimension: '6. Trabajo colaborativo',
            criterio: '6.1. Participación en reuniones de trabajo colaborativo (no GIA y no RTC)',
            aspecto: '6.1.a. Participación en reuniones de trabajo colaborativo (no GIA y no RTC)',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: 'green lighten-4',
            competencia: 'Competencia 11',
            eje: 'Orientación pedagógica para el logro de aprendizajes',
            dimension: '7. Herramientas y recursos tecnológicos',
            criterio: '7.1. Uso de recursos tecnológicos en el proceso de enseñanza aprendizaje',
            aspecto: '7.1.a. Uso de recursos tecnológicos en la comunicación con sus estudiantes',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: '',
            competencia: 'Competencia 7',
            eje: 'Comunicación con las familias',
            dimension: '8. Relación intergeneracional',
            criterio: '8.1. Colaboración y corresponsabilidad con las familias, la comunidad',
            aspecto: '8.1.a. Fortalecimiento de la identidad cultural y lingüística y práctica de valores.',
            opcion: 0,
            compromiso: ' '
          },
          {
            background: '',
            competencia: '.',
            eje: '.',
            dimension: '.',
            criterio: '.',
            aspecto: '8.1.b. Sistema de Valores.',
            opcion: 0,
            compromiso: ' '
          }
        ]
      },
      asesoria: {
        anio: ' ',
        mes: ' ',
        iiee: ' ',
        docente: ' ',
        fecha_registro: ' ',
        estado: 0,
      },
      asesoria_id: this.$route.params.asesoria_id || null,
      opciones: [{
        nro: 0,
        nombre: 'Opcion'
      }, {
        nro: 1,
        nombre: 'Compromiso 1'
      }, {
        nro: 2,
        nombre: 'Compromiso 2'
      }, {
        nro: 3,
        nombre: 'Compromiso 3'
      }],
      criterio_opciones: [{
        nro: 0,
        nombre: 'Opcion'
      }, {
        nro: 1,
        nombre: 'Opción 1'
      }, {
        nro: 2,
        nombre: 'Opción 2'
      }, {
        nro: 3,
        nombre: 'Opción 3'
      }, {
        nro: 4,
        nombre: 'Opción 4'
      }],
      //   competencias: [],
      medios: [{
        nro: "Virtual",
        nombre: "Virtual"
      }, {
        nro: "Llamada telefónica/Celular",
        nombre: "Llamada telefónica/Celular"
      }, {
        nro: "Otros",
        nombre: "Otros"
      }],
      //   criterios: [],
      p_16: [{
        id: 1,
        nombre: 'Si'
      }, {
        id: 0,
        nombre: 'No'
      }],
      p_17: [{
        id: 1,
        nombre: 'El docente propone un proyecto de aprendizaje sin propósito'
      }, {
        id: 2,
        nombre: 'El docente propone un proyecto de aprendizaje con un propósito'
      }, {
        id: 3,
        nombre: 'El docente propone proyectos contextualizado con un propósito asociado a las competencias seleccionadas'
      }],
      p_18: [{
        id: 1,
        nombre: 'El propósito del proyecto considera los Intereses de los estudiantes'
      }, {
        id: 2,
        nombre: 'El propósito del proyecto considera las necesidades de aprendizaje de los estudiantes'
      }, {
        id: 3,
        nombre: 'El propósito del proyecto considera el contexto sociocultural de los estudiantes'
      }, {
        id: 4,
        nombre: 'El propósito del proyecto considera el aspecto lingüístico (sólo para EIB)'
      }],
      p_19: [{
        id: 1,
        nombre: 'No plantea una situación significativa'
      }, {
        id: 2,
        nombre: 'Plantea una situación significativa pero no es acorde el propósito de aprendizaje'
      }, {
        id: 3,
        nombre: 'Plantea una situación significativa acorde al propósito de aprendizaje'
      }],
      p_20: [{
        id: 1,
        nombre: 'No presenta criterios de evaluación o presenta solo uno que no se vincula al propósito'
      }, {
        id: 2,
        nombre: 'Presenta al menos un criterio de evaluación que se vincula al propósito'
      }, {
        id: 3,
        nombre: 'Presenta al menos dos criterios de evaluación que se vinculan al propósito'
      }],
    }
  },
  computed: {
    ...mapGetters({
      //   asesoria_id: 'user/asesoria_id'
    }),
    estado() {
      return this.asesoria.estado ? 'Enviado' : 'Registrado'
    }
  },
  created() {
    // this.mostrar_grados();

    this.mostrarAsesoria();
    if (this.diaid > 0) {
      this.traerDia();
    }
  },
  methods: {
    async traerDia() {
      try {
        // Procesamos los grados del colegio
        let rpt1 = await axios.get(`http://asesoria2.test/api/v1/dia/show/${this.diaid}`);
        console.log('dia a editar', rpt1);
        let rpt_procesada1 = await rpt1.data.map(res => ({
          dia_id: this.diaid,
          dia_: res.dia,
          fecha: res.fecha,
          menu: false,
          modal: false,
          menu2: false,
          hora_inicio: res.hora_inicio,
          nivel_educativo: res.nivel_educativo,
          hi_menu2: false,
          hora_fin: res.hora_fin,
          hf_menu2: false,
          medio_virtual: res.medio_virtual,
          medio_virtual_otros: res.medio_virtual_otros,
          p_16: res.p_16,
          p_17: res.p_17,
          obs_p_17: res.obs_p_16,
          area_curricular: res.area_curriculares.map(res2 => res2.area_curricular_id),
          grados: res.grados.map(res2 => res2.grado_id),
          asesoria_id: this.$route.params.asesoria_id || null,
          p_18: res.p_18.map(res2 => res2.opcion),
          obs_p_18: res.obs_p_18,
          p_19: res.p_19,
          obs_p_19: res.obs_p_19,
          p_20: res.p_20,
          obs_p_20: res.obs_p_20,
          criterios_: res.criterios.map(res4 => ({
            aspecto: res4.aspecto,
            background: res4.background,
            criterio: res4.criterio,
            observacion: res4.observacion,
            opcion: res4.opcion,
            opcion_1: res4.opcion_1,
            opcion_2: res4.opcion_2,
            opcion_3: res4.opcion_3,
            opcion_4: res4.opcion_4
          })),
          competencias_: res.competencias.map(res5 => ({
            aspecto: res5.aspecto,
            background: res5.background,
            competencia: res5.competencia,
            compromiso: res5.compromiso,
            criterio: res5.criterio,
            dimension: res5.dimension,
            eje: res5.eje,
            opcion: res5.opcion
          }))
        }));
        this.form = await rpt_procesada1[0];
        this.MostrarGrados();
        console.log('se trajo el dia', rpt_procesada1);

      } catch (error) {
        console.log(error);
      }
    },
    async MostrarGrados() {
      try {
        // Procesamos los grados del colegio
        let rpt1 = await axios.get(`http://asesoria2.test/api/v1/grados/${this.iieeid}/${this.form.nivel_educativo}`);

        let rpt_procesada1 = await rpt1.data.map(res => ({
          id: res.id,
          nombre: res.nombre,
        }));
        this.grados = rpt_procesada1;
        // console.log('grados en db con nivel' + this.form.nivel_educativo, rpt_procesada1);

        this.listarAreaCurricular();
      } catch (error) {
        console.log(error);
      }
    },
    async mostrarAsesoria() {
      try {
        let rpt = await axios.get(`http://asesoria2.test/api/v1/asesoria/${this.asesoria_id}`);
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
    // async mostrar_grados() {
    //   try {
    //     // Procesamos los grados del colegio
    //     let rpt1 = await axios.get(`http://asesoria2.test/api/v1/iiee/${this.userid}/${this.iieeid}/grados`);

    //     let rpt_procesada1 = await rpt1.data.map(res => ({
    //       id: res.id,
    //       nombre: res.nombre
    //     }));
    //     this.grados = rpt_procesada1;
    //     console.log('grados', rpt1);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    async listarAreaCurricular() {
      try {
        let rpt = await axios.get(`http://asesoria2.test/api/v1/area-curricular/${this.form.nivel_educativo}`);
        // console.log(rpt.data);
        let rpt_procesada = await rpt.data.map(res => ({
          id: res.id,
          nombre: res.nivel + '->' + res.nombre
        }));
        this.areas_curriculares = rpt_procesada;
        // console.log(rpt_procesada);
      } catch (error) {
        console.log(error);
      }
    },
    async EnviarDatos() {
      try {
        // this.form.criterios_ = this.criterios;
        // this.form.competencias_ = this.competencias;
        let mensaje = 'guardados';
        if (this.diaid > 0)
          mensaje = 'editados';
        this.$refs.form1.validate()
        let rpt = await axios.post('http://asesoria2.test/api/v1/dia/store', this.form);
        console.log('respuest:', rpt.data);
        this.$swal.fire('Datos guardados correctamente')
        if (rpt.data) {
          this.$swal.fire(
            'Hecho!',
            'Datos ' + mensaje + ' correctamente.',
            'success'
          )
          this.$router.push({
            name: 'asesorias.show',
            params: {
              'asesoria_id': this.asesoria_id
            }
          })
        } else {
          this.$swal.fire(
            'Opps!',
            'Ocurrio un error.',
            'error'
          )
        }
        // localStorage.setItem('asesoria_id', rpt.data);
        // this.form.asesoria_id = rpt.data;
        // if (!this.form.hay_visita) {
        //   this.$router.push({
        //     name: 'Asesorias'
        //   });
        // }
        // this.$router.push({
        //   name: 'asesoria.dia',
        //   params: {
        //     asesoaria_id: rpt.data
        //   }
        // });

      } catch (error) {
        console.log(error);
      }
    },
    cofirmar() {
      this.$swal.fire({
        title: 'Recuerda',
        text: "Por favor revisa bien tus datos antes de guardar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Guardar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.EnviarDatos();
        }
      })
    }
  }
}
</script>

<style>

</style>
