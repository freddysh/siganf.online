import axios from 'axios'


export default {
    namespaced:true,
    state:{
        username:localStorage.getItem('usuarioLogeadoName')||null,
        usuarioLogeado:localStorage.getItem('usuarioLogeado')||null,
        endpoint1:'http://api.siganf.online' || null
    },
    actions:{
        async getUser({commit},id){
            const rpt='el id del user es'+id;
            commit('setUser',rpt);
        },
        async login({commit},credenciales){
            try {
                // Procesamos los grados del colegio
                let rpt1 = await axios.get(`http://api.siganf.online/api/v1/login/${credenciales.txt_user.trim()}/${credenciales.txt_pw.trim()}`);
                if (rpt1.data.length) {
                  let user = await rpt1.data.map(rep => ({
                    id: rep.id,
                    nombre: rep.name
                  }));
                    console.log('user', user);
                    const usuarioLogeado=user[0].id;
                    localStorage.setItem('usuarioLogeado',usuarioLogeado);
                    localStorage.setItem('usuarioLogeadoName',user[0].nombre);

                    commit('setUsuarioLogeado',usuarioLogeado);
                    commit('setUserName',user[0].nombre);
                //   auth.setUserLoged(user);
                //   this.$router.push({
                //     name: 'Admin'
                //   })
                return true;
                } else {
                  this.error = true;
                  console.log('error');
                  return false
                }
                // console.log(rpt_procesada[0]);
              } catch (error) {
                console.log(error);
              }
        },
        logout({commit}){
            localStorage.removeItem('usuarioLogeado');
            localStorage.removeItem('usuarioLogeadoName');
            commit('setUsuarioLogeado',null);
            commit('setUserName',null);

        }
    },
    mutations:{
        setUser(state,valor){
            state.username=valor;
        },
        setUsuarioLogeado(state,valor){
            state.usuarioLogeado=valor;
        },
        setUserName(state,valor){
            state.username=valor;
        },
    }
    ,getters:{
        // title(state){
        //     return state.title
        // }
        username:state=>state.username,
        usuarioLogeado:state=>state.usuarioLogeado,
        endpoint:state=>state.endpoint1
    }
}
