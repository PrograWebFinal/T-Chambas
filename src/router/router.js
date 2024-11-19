import { createRouter, createWebHistory } from 'vue-router';
import PaginaInicio from '../components/PaginaInicio.vue';
import PaginaLogin from '@/components/PaginaLogin.vue';
import PaginaRegister from '@/components/PaginaRegister.vue';
import PaginaPerfil from '../components/PaginaPerfil'; 
import PaginaProyecto from '../components/PaginaProyecto.vue';
import PaginaPerfiles from '../components/PaginaPerfiles.vue'; 
import PaginaProyectos from '../components/PaginaProyectos.vue';
import Detalles_proyectos from '@/components/Detalles_proyectos.vue';
import login from '@/components/login.vue';
import BarraMenu from '@/components/BarraMenu.vue';

const routes = [
  { path: '/', name: 'Inicio', component: PaginaInicio },
  { path: '/PaginaLogin', name: 'PaginaLogin', component: PaginaLogin },
  { path: '/PaginaRegister', name: 'PaginaRegister', component: PaginaRegister },
  { path: '/Perfil', name: 'Perfil', component: PaginaPerfil},
  { path: '/Proyecto', name: 'Proyecto', component: PaginaProyecto},  
  { path: '/Perfiles', name: 'Perfiles', component: PaginaPerfiles},
  { path: '/Proyectos', name: 'Proyectos', component: PaginaProyectos}, 
  { path: '/Detalles_proyectos', name: 'Detalles_proyectos', component: Detalles_proyectos}, 
  { path: '/login', name: 'login', component: login},
  { path: '/BarraMenu', name: 'BarraMenu', component: BarraMenu},  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
