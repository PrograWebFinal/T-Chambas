import { createRouter, createWebHistory } from 'vue-router';
import PaginaInicio from '../components/PaginaInicio.vue';
import PaginaPerfil from '../components/PaginaPerfil'; 
import PaginaProyectos from '../components/PaginaProyectos.vue';

const routes = [
  { path: '/', name: 'Inicio', component: PaginaInicio },
  { path: '/Perfil', name: 'Perfil', component: PaginaPerfil},
  { path: '/Proyectos', name: 'Proyectos', component: PaginaProyectos},  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
