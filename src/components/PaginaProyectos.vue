<template>
  <div class="explora-proyectos">
    <h1>Explora Proyectos</h1>
    <input 
      type="text" 
      placeholder="Buscar por título o habilidades requeridas"
      v-model="searchQuery"
      class="busqueda"
    />
    <div class="habilidades-populares">
      <button v-for="habilidad in habilidadesPopulares" :key="habilidad" @click="buscarPorHabilidad(habilidad)">
        {{ habilidad }}
      </button>
    </div>
    <div class="proyectos">
      <div v-for="(fila, index) in filasProyectos" :key="index" class="fila">
        <div v-for="proyecto in fila" :key="proyecto.titulo" class="proyecto" @click="seleccionarProyecto(proyecto)">
          <h3>{{ proyecto.titulo }}</h3>
          <p>Habilidades requeridas: {{ proyecto.habilidades.join(', ') }}</p>
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
  name: 'PaginaProyectos',
  data() {
    return {
      searchQuery: '',
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
      this.$router.push({ name: 'Detalles_proyectos', params: { proyecto: JSON.stringify(proyecto) } });
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
</style>