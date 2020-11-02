<template>
  <div>
    <NuevoDia :iieeid='iiee_id' :dia='dia' :userid='acompanante_id' :hayvisita='1' :diaid='diaid' />
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
  data() {
    return {
      dia: 0,
      diaid: this.$route.params.diaid,
      acompanante_id: localStorage.getItem('usuarioLogeado'),
      iiee_id: 0,
      asesoria_id: this.$route.params.asesoria_id,
    }
  },
  computed: {
    ...mapGetters({
      usuarioLogeado: 'user/usuarioLogeado',
    })
  },
  created() {
    this.LlamarDatos();
  },
  methods: {
    async LlamarDatos() {
      try {
        let rpt = await axios.get(`http://asesoria2.test/api/v1/asesoria/${this.asesoria_id}`);
        console.log('rpt', rpt.data[0].iiee_id)
        this.iiee_id = rpt.data[0].iiee_id;
        if (this.diaid > 0)
          this.dia = '1';
        else
          this.dia = rpt.data[0].dias.length + 1;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
