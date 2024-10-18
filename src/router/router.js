import { createRouter, createWebHistory } from 'vue-router';
import PaginaInicio from '../components/PaginaInicio.vue';
import PaginaPerfil from '../components/PaginaPerfil'; 
import PaginaProyecto from '../components/PaginaProyecto.vue';
import PaginaPerfiles from '../components/PaginaPerfiles.vue'; 
import PaginaProyectos from '../components/PaginaProyectos.vue';

const routes = [
  { path: '/', name: 'Inicio', component: PaginaInicio },
  { path: '/Perfil', name: 'Perfil', component: PaginaPerfil},
  { path: '/Proyecto', name: 'Proyecto', component: PaginaProyecto},  
  { path: '/Perfiles', name: 'Perfiles', component: PaginaPerfiles},
  { path: '/Proyectos', name: 'Proyectos', component: PaginaProyectos},  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
