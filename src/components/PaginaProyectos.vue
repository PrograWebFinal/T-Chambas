<template>
  <div>
    <!-- Barra de navegación -->
    <BarraMenu />

    <!-- Contenido principal -->
    <div class="explora-proyectos container mt-4">
      <h1 class="text-center mb-2">Explora Proyectos</h1>
      <p class="text-center text-muted mb-4">Descubre proyectos emocionantes, busca por habilidades o explora nuestras recomendaciones.</p>

      <!-- Cuadro de búsqueda -->
      <input
        type="text"
        placeholder="Buscar por título o habilidades requeridas"
        v-model="searchQuery"
        class="form-control mb-4"
        aria-label="Buscar proyectos"
      />

      <!-- Botones de habilidades populares -->
      <div class="habilidades-populares mb-4">
        <button
          v-for="habilidad in habilidadesPopulares"
          :key="habilidad"
          @click="buscarPorHabilidad(habilidad)"
          class="btn btn-outline-primary me-2 mb-2"
          aria-label="Filtrar por habilidad"
        >
          <i class="bi bi-tags"></i> {{ habilidad }}
        </button>
      </div>

      <!-- Spinner de carga -->
      <div v-if="cargando" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Mensaje de vacío -->
      <div v-if="!cargando && proyectosFiltrados.length === 0" class="text-center my-5">
        <p class="text-muted">No se encontraron proyectos con los criterios seleccionados.</p>
      </div>

      <!-- Lista de proyectos -->
      <div class="proyectos" v-else>
        <div
          v-for="(fila, index) in filasProyectos"
          :key="index"
          class="row mb-4"
        >
          <div
            v-for="proyecto in fila"
            :key="proyecto.titulo"
            class="col-sm-12 col-md-6 col-lg-4"
          >
            <div class="proyecto card h-100" @click="seleccionarProyecto(proyecto)">
              <img
                v-if="proyecto.imagenes.length > 0"
                :src="proyecto.imagenes[0]"
                alt="Imagen del proyecto"
                class="card-img-top"
                loading="lazy"
              />
              <div class="card-body">
                <h3 class="card-title">{{ proyecto.titulo }}</h3>
                <p class="card-text">
                  <span class="badge bg-secondary me-1" v-for="habilidad in proyecto.habilidades" :key="habilidad">
                    {{ habilidad }}
                  </span>
                </p>
                <p class="card-text text-muted">{{ proyecto.descripcion }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div class="pagination-container text-center mt-4">
        <button
          class="btn btn-outline-secondary me-2"
          :disabled="paginaActual === 1"
          @click="cambiarPagina(paginaActual - 1)"
        >
          Anterior
        </button>
        <button
          class="btn btn-outline-secondary"
          :disabled="paginaActual === totalPaginas"
          @click="cambiarPagina(paginaActual + 1)"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import BarraMenu from "@/components/BarraMenu.vue";
import Proyecto1Img from "../assets/proyecto1.jpg";
import Proyecto2Img from "../assets/proyecto2.jpg";
import Proyecto3Img from "../assets/proyecto3.jpg";

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
        },
        {
          titulo: "Rediseño de Marca Universitaria",
          habilidades: ["Diseño Gráfico", "Marketing"],
          descripcion: "Proyecto de rediseño de la marca de la universidad.",
          imagenes: [Proyecto2Img],
        },
        {
          titulo: "Aplicación de Finanzas Personales",
          habilidades: ["Programación", "Finanzas"],
          descripcion: "Aplicación para gestionar finanzas personales.",
          imagenes: [Proyecto3Img],
        },
        {
          titulo: "Propuesta de Desarrollo Empresarial",
          habilidades: ["Gestión de Proyectos", "Contaduría"],
          descripcion: "Propuesta para el desarrollo de estrategias empresariales.",
          imagenes: [],
        },
      ],
      paginaActual: 1,
      elementosPorPagina: 6,
      cargando: false,
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
      const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
      const fin = inicio + this.elementosPorPagina;
      const proyectosPaginados = this.proyectosFiltrados.slice(inicio, fin);
      const filas = [];
      for (let i = 0; i < proyectosPaginados.length; i += 3) {
        filas.push(proyectosPaginados.slice(i, i + 3));
      }
      return filas;
    },
    totalPaginas() {
      return Math.ceil(this.proyectosFiltrados.length / this.elementosPorPagina);
    },
  },
  methods: {
    buscarPorHabilidad(habilidad) {
      this.searchQuery = habilidad;
    },
    seleccionarProyecto(proyecto) {
      this.$router.push({ name: "Detalles_proyectos", params: { proyecto: JSON.stringify(proyecto) } });
    },
    cambiarPagina(pagina) {
      this.paginaActual = pagina;
    },
  },
  watch: {
    searchQuery() {
      this.paginaActual = 1;
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
.pagination-container button {
  margin: 0 5px;
}
</style>
