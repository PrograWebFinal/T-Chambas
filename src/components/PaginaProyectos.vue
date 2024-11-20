<template>
  <div>
    <!-- Barra de navegación -->
    <BarraMenu />

    <!-- Contenido principal -->
    <div class="explora-proyectos container mt-4">
      <h1 class="text-center">Explora Proyectos</h1>

      <!-- Cuadro de búsqueda -->
      <input 
        type="text" 
        placeholder="Buscar por título o habilidades requeridas"
        v-model="searchQuery"
        class="form-control mb-4"
      />

      <!-- Botones de habilidades populares -->
      <div class="habilidades-populares mb-4">
        <button 
          v-for="habilidad in habilidadesPopulares" 
          :key="habilidad" 
          @click="buscarPorHabilidad(habilidad)"
          class="btn btn-outline-primary me-2"
        >
          {{ habilidad }}
        </button>
      </div>

      <!-- Lista de proyectos -->
      <div class="proyectos">
        <div 
          v-for="(fila, index) in filasProyectos" 
          :key="index" 
          class="row mb-4"
        >
          <div 
            v-for="proyecto in fila" 
            :key="proyecto.titulo" 
            class="col-md-6"
          >
            <div class="proyecto card h-100" @click="seleccionarProyecto(proyecto)">
              <div class="card-body">
                <h3 class="card-title">{{ proyecto.titulo }}</h3>
                <p class="card-text">Habilidades requeridas: {{ proyecto.habilidades.join(', ') }}</p>
                <p class="card-text text-muted">{{ proyecto.descripcion }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarraMenu from "@/components/BarraMenu.vue";
import Proyecto1Img from "../assets/proyecto1.jpg";
import Proyecto2Img from "../assets/proyecto2.jpg";
import Proyecto3Img from "../assets/proyecto3.jpg";

import JuanFoto from "../assets/Perfiles/Juan.jpg";
import AnaFoto from "../assets/Perfiles/Ana.jpeg";

export default {
  name: "PaginaProyectos",
  components: {
    BarraMenu,
  },
  data() {
    return {
      searchQuery: "",
      habilidadesPopulares: ["Programación", "Diseño Gráfico", "Marketing", "Gestión de Proyectos"],
      proyectos: [
        { 
          titulo: "Sistema de Gestión Escolar", 
          habilidades: ["Programación", "Bases de Datos"], 
          descripcion: "Sistema para gestionar información de estudiantes y profesores.", 
          imagenes: [Proyecto1Img], 
          integrantes: [
            { 
              nombre: "Juan Pérez", 
              foto: JuanFoto, 
              carrera: "Ingeniería en Tecnologías de la Información", 
              habilidades: ["Programación", "Ciberseguridad"], 
              proyectos: ["Sistema de Ciberseguridad", "Aplicación de Redes"] 
            }
          ]
        },
        { 
          titulo: "Rediseño de Marca Universitaria", 
          habilidades: ["Diseño Gráfico", "Marketing"], 
          descripcion: "Proyecto de rediseño de la marca de la universidad.", 
          imagenes: [Proyecto2Img], 
          integrantes: [
            { 
              nombre: "Ana López", 
              foto: AnaFoto, 
              carrera: "Diseño Multimedia", 
              habilidades: ["Diseño Gráfico", "Fotografía"], 
              proyectos: [] 
            }
          ]
        },
        { 
          titulo: "Aplicación de Finanzas Personales", 
          habilidades: ["Programación", "Finanzas"], 
          descripcion: "Aplicación para gestionar finanzas personales.", 
          imagenes: [Proyecto3Img], 
          integrantes: [] 
        },
        { 
          titulo: "Propuesta de Desarrollo Empresarial", 
          habilidades: ["Gestión de Proyectos", "Contaduría"], 
          descripcion: "Propuesta para el desarrollo de estrategias empresariales.", 
          imagenes: [Proyecto3Img], 
          integrantes: [] 
        }
      ]
    };
  },
  computed: {
    proyectosFiltrados() {
      if (!this.searchQuery) {
        return this.proyectos;
      }
      const query = this.searchQuery.toLowerCase();
      return this.proyectos.filter(
        (proyecto) =>
          proyecto.titulo.toLowerCase().includes(query) || 
          proyecto.habilidades.some((habilidad) => habilidad.toLowerCase().includes(query))
      );
    },
    filasProyectos() {
      const filas = [];
      for (let i = 0; i < this.proyectosFiltrados.length; i += 2) {
        filas.push(this.proyectosFiltrados.slice(i, i + 2));
      }
      return filas;
    },
  },
  methods: {
    buscarPorHabilidad(habilidad) {
      this.searchQuery = habilidad;
    },
    seleccionarProyecto(proyecto) {
      this.$router.push({ name: "Detalles_proyectos", params: { proyecto: JSON.stringify(proyecto) } });
    },
  },
};
</script>

<style scoped>
.explora-proyectos {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}
.habilidades-populares button {
  margin-bottom: 10px;
}
.proyecto {
  cursor: pointer;
}
.card {
  transition: transform 0.2s ease-in-out;
}
.card:hover {
  transform: scale(1.05);
}
</style>