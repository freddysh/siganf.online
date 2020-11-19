import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import( '../views/auth/Login.vue')
  },{
    path: '/',
    name: 'Home',
    component: () => import( '../views/layout/Home.vue')
  },{
    path: '/admin',
    name: 'admin',
    component: () => import( '../views/admin/Admin.vue'),
    meta:{requiresAuth:true}
  },{
    path: '/iiees',
    name: 'iiees',
    component: () => import( '../views/admin/iiee/index.vue'),
    meta:{requiresAuth:true}
  },{
    path: '/iiees/:iiee_id/grados',
    name: 'iiees.grados',
    component: () => import( '../views/admin/iiee/grado/index.vue'),
    meta:{requiresAuth:true}
  },{
    path: '/iiees/:iiee_id/docentes',
    name: 'iiees.docentes',
    component: () => import( '../views/admin/iiee/docente/index.vue'),
    meta:{requiresAuth:true}
  },{
    path: '/asesores',
    name: 'asesores',
    component: () => import( '../views/admin/asesor/index.vue'),
    meta:{requiresAuth:true}
  },{
    path: '/asesores/:asesor_id/iiees',
    name: 'asesores.iiees',
    component: () => import( '../views/admin/asesor/iiee/index.vue'),
    meta:{requiresAuth:true}
  }

//   ,
//   {
//     path: '/about',
//     name: 'About',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
//   },{
//     path: '/docentes',
//     name: 'Docentes',
//     component: () => import('../views/About.vue')
//   },{
//     path: '/asesores',
//     name: 'Asesores',
//     component: () => import('../views/About.vue')
//   },{
//     path: '/colegios',
//     name: 'Colegios',
//     component: () => import('../views/About.vue')
//   },{
//     path: '/asignatura',
//     name: 'Asignatura',
//     component: () => import('../views/About.vue')
//   }

  ,{
    path: '/asesorias',
    name: 'Asesorias',
    component: () => import('../views/Asesoria.vue'),
    meta:{requiresAuth:true}
  },{
    path: '/asesorias/listar/:asesoria_id',
    name: 'asesorias.show',
    component: () => import('../views/admin/asesoriaShow.vue'),
    meta:{requiresAuth:true}
  },{
    path: '/asesorias/crear/:asesoria_id/:diaid',
    name: 'asesorias.crear',
    component: () => import('../views/admin/nuevaAsesoria.vue'),
    meta:{requiresAuth:true}
  },{
    path: '/asesorias/agregar',
    name: 'asesorias.agregar',
    component: () => import('../views/Asesoria-agregar.vue'),
    meta:{requiresAuth:true}
  },{
    path: '/reportes1',
    name: 'Reportes1',
    component: () => import('../views/About.vue'),
    meta:{requiresAuth:true}
  }
]

const router = new VueRouter({
   mode: 'history',
   base: process.env.BASE_URL,
  routes
});
router.beforeEach((to, from, next) => {
    // to and from are both route objects. must call `next`.
    if(to.matched.some(ruta=>ruta.meta.requiresAuth)){
        const user= localStorage.getItem('usuarioLogeado')||null;
        if(user){
            next();
        }
        else{
            next({name:'Login'});
        }
    }
    else{
        next();
    }
})

export default router
