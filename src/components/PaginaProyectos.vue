<template>
  <div class="explora-proyectos">
    <h1>Explora Proyectos</h1>
    <!-- Cuadro de búsqueda -->
    <input 
      type="text" 
      placeholder="Buscar por título o habilidades requeridas"
      v-model="searchQuery"
      class="busqueda"
    />
    <!-- Botones de habilidades más buscadas -->
    <div class="habilidades-populares">
      <button v-for="habilidad in habilidadesPopulares" :key="habilidad" @click="buscarPorHabilidad(habilidad)">
        {{ habilidad }}
      </button>
    </div>
    <!-- Proyectos en hileras de 2 -->
    <div class="proyectos">
      <div v-for="(fila, index) in filasProyectos" :key="index" class="fila">
        <!-- Renderizar cada proyecto en la hilera -->
        <div v-for="proyecto in fila" :key="proyecto.titulo" class="proyecto" @click="seleccionarProyecto(proyecto)">
          <h3>{{ proyecto.titulo }}</h3>
          <p>Habilidades requeridas: {{ proyecto.habilidades.join(', ') }}</p>
          <div v-if="proyectoSeleccionado === proyecto" class="flecha-abajo">⬇️</div>
        </div>
        <!-- Ficha técnica solo en la hilera donde está el proyecto seleccionado -->
        <div v-if="proyectoSeleccionado && fila.includes(proyectoSeleccionado)" class="ficha-tecnica">
          <!-- Información del proyecto -->
          <div class="ficha-proyecto">
            <h2>{{ proyectoSeleccionado.titulo }}</h2>
            <p><strong>Habilidades requeridas:</strong> {{ proyectoSeleccionado.habilidades.join(', ') }}</p>
            <p><strong>Descripción:</strong> {{ proyectoSeleccionado.descripcion }}</p>
            <div class="imagenes">
              <img v-for="imagen in proyectoSeleccionado.imagenes" :key="imagen" :src="imagen" alt="Imagen del proyecto" />
            </div>
          </div>
          <!-- Perfiles de integrantes del proyecto -->
          <div class="ficha-perfiles">
            <h2>Integrantes</h2>
            <div v-for="perfil in proyectoSeleccionado.integrantes" :key="perfil.nombre" class="perfil">
              <img :src="perfil.foto" alt="Foto de perfil" class="foto-perfil" />
              <h3>{{ perfil.nombre }}</h3>
              <p>Carrera: {{ perfil.carrera }}</p>
              <p>Habilidades: {{ perfil.habilidades.join(', ') }}</p>
              <p v-if="perfil.proyectos.length">Proyectos: {{ perfil.proyectos.join(', ') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Proyecto1Img from '../assets/proyecto1.jpg';
import Proyecto2Img from '../assets/proyecto2.jpg';
import Proyecto3Img from '../assets/proyecto3.jpg';

import JuanFoto from '../assets/Perfiles/Juan.jpg';
import AnaFoto from '../assets/Perfiles/Ana.jpeg';

export default {
  name: 'PaginaProyecto',
  data() {
    return {
      searchQuery: '',
      proyectoSeleccionado: null,
      habilidadesPopulares: ['Programación', 'Diseño Gráfico', 'Marketing', 'Gestión de Proyectos'],
      proyectos: [
        { titulo: 'Sistema de Gestión Escolar', habilidades: ['Programación', 'Bases de Datos'], descripcion: 'Sistema para gestionar información de estudiantes y profesores.', imagenes: [Proyecto1Img], integrantes: [{ nombre: 'Juan Pérez', foto: JuanFoto, carrera: 'Ingeniería en Tecnologías de la Información', habilidades: ['Programación', 'Ciberseguridad'], proyectos: ['Sistema de Ciberseguridad', 'Aplicación de Redes'] }] },
        { titulo: 'Rediseño de Marca Universitaria', habilidades: ['Diseño Gráfico', 'Marketing'], descripcion: 'Proyecto de rediseño de la marca de la universidad.', imagenes: [Proyecto2Img], integrantes: [{ nombre: 'Ana López', foto: AnaFoto, carrera: 'Diseño Multimedia', habilidades: ['Diseño Gráfico', 'Fotografía'], proyectos: [] }] },
        { titulo: 'Aplicación de Finanzas Personales', habilidades: ['Programación', 'Finanzas'], descripcion: 'Aplicación para gestionar finanzas personales.', imagenes: [Proyecto3Img], integrantes: [] },
        { titulo: 'Propuesta de Desarrollo Empresarial', habilidades: ['Gestión de Proyectos', 'Contaduría'], descripcion: 'Aplicación para gestionar finanzas personales.', imagenes: [Proyecto3Img], integrantes: [] }
      ]
    };
  },
  computed: {
    proyectosFiltrados() {
      if (!this.searchQuery) {
        return this.proyectos;
      }
      const query = this.searchQuery.toLowerCase();
      return this.proyectos.filter(proyecto => 
        proyecto.titulo.toLowerCase().includes(query) || 
        proyecto.habilidades.some(habilidad => habilidad.toLowerCase().includes(query))
      );
    },
    filasProyectos() {
      const filas = [];
      for (let i = 0; i < this.proyectosFiltrados.length; i += 2) {
        filas.push(this.proyectosFiltrados.slice(i, i + 2));
      }
      return filas;
    }
  },
  methods: {
    buscarPorHabilidad(habilidad) {
      this.searchQuery = habilidad;
    },
    seleccionarProyecto(proyecto) {
      this.proyectoSeleccionado = this.proyectoSeleccionado === proyecto ? null : proyecto;
    }
  }
};
</script>

<style scoped>
.explora-proyectos {
  text-align: center;
}
.busqueda {
  width: 80%;
  padding: 10px;
  margin: 20px 10px;
  font-size: 16px;
}
.habilidades-populares {
  margin: 20px 0;
}
.habilidades-populares button {
  margin: 0 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
}
.proyectos {
  display: grid;
  gap: 20px;
  margin-top: 20px;
  padding: 20px;
}
.fila {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.proyecto {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}
.flecha-abajo {
  font-size: 30px;
  color: #333;
  margin-top: 5px;
}
.ficha-tecnica {
  display: flex;
  padding: 20px;
  background-color: #f9f9f9;
  border-top: 2px solid #ccc;
  grid-column: span 2;
}
.ficha-proyecto, .ficha-perfiles {
  flex: 1;
  padding: 20px;
}
.imagenes img {
  width: 100px;
  height: 100px;
  margin: 5px;
  border-radius: 5px;
}
.perfil {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.foto-perfil {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
  margin-right: 15px;
}
</style>
