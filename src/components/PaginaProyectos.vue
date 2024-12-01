<template>
  <div>
    <!-- Barra de navegación -->
    <BarraMenu />

    <!-- Contenido principal -->
    <div class="explora-proyectos container mt-4">
      <h1 class="text-center mb-2">Explora Proyectos</h1>
      <p class="text-center text-muted mb-4">
        Descubre proyectos emocionantes, busca por habilidades o explora nuestras recomendaciones.
      </p>

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
        <div v-for="(fila, index) in filasProyectos" :key="index" class="row mb-4">
          <div
            v-for="proyecto in fila"
            :key="proyecto.id_proyecto"
            class="col-sm-12 col-md-6 col-lg-4"
          >
            <div class="proyecto card h-100">
              <img
                v-if="proyecto.imagen"
                :src="proyecto.imagen"
                alt="Imagen del proyecto"
                class="card-img-top"
                loading="lazy"
              />
              <div class="card-body">
                <h3 class="card-title">{{ proyecto.titulo }}</h3>
                <button class="btn btn-info mt-2" @click="abrirModal(proyecto)">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para detalles del proyecto -->
      <div v-if="mostrarModal && proyectoSeleccionado" class="modal-backdrop">
        <div class="modal-content">
          <h2>{{ proyectoSeleccionado.titulo }}</h2>
          <p><strong>Descripción:</strong> {{ proyectoSeleccionado.descripcion }}</p>
          <p><strong>Habilidades requeridas:</strong></p>
          <ul>
            <li v-for="habilidad in proyectoSeleccionado.habilidades" :key="habilidad.id_habilidad">
              {{ habilidad.nombre_habilidad }}
            </li>
          </ul>
          <p><strong>Dueño del proyecto:</strong></p>
          <p><strong>Nombre:</strong> {{ dueñoProyecto?.nombre || 'Desconocido' }}</p>
          <p><strong>Carrera:</strong> {{ dueñoProyecto?.carrera || 'Desconocida' }}</p>
          <p><strong>Correo:</strong> {{ dueñoProyecto?.correo || 'No disponible' }}</p>
          <button class="btn btn-success mt-2" @click="unirseProyecto(proyectoSeleccionado.id_proyecto)">
            Unirse al Proyecto
          </button>
          <button class="btn btn-secondary mt-2" @click="cerrarModal">Cerrar</button>
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
import axios from "axios";
import Swal from "sweetalert2";
import BarraMenu from "@/components/BarraMenu.vue";

export default {
  name: "PaginaProyectos",
  components: {
    BarraMenu,
  },
  data() {
    return {
      searchQuery: "",
      habilidadesPopulares: [],
      proyectos: [],
      paginaActual: 1,
      elementosPorPagina: 6,
      cargando: false,
      mostrarModal: false, // Controla la visibilidad del modal
      proyectoSeleccionado: null, // Almacena el proyecto seleccionado
      dueñoProyecto: null, // Información del dueño del proyecto
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
          proyecto.habilidades.some((habilidad) =>
            habilidad.nombre_habilidad.toLowerCase().includes(query)
          )
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
    async cargarProyectos() {
      this.cargando = true;
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          Swal.fire({
            icon: "warning",
            title: "Sesión caducada",
            text: "Tu sesión ha caducado. Inicia sesión nuevamente.",
          }).then(() => {
            this.$router.push("/login");
          });
          return;
        }

        const response = await axios.get("http://localhost:3000/proyectos", {
          params: { userId },
        });

        this.proyectos = response.data.map((proyecto) => ({
          id_proyecto: proyecto.id_proyecto,
          titulo: proyecto.nombre_proyecto,
          descripcion: proyecto.descripcion || "Sin descripción",
          imagen: proyecto.imagen || null,
          habilidades: proyecto.habilidades || [],
        }));
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al cargar los proyectos. Inténtalo más tarde.",
        });
      } finally {
        this.cargando = false;
      }
    },
    buscarPorHabilidad(habilidad) {
      this.searchQuery = habilidad;
    },
    async abrirModal(proyecto) {
      this.proyectoSeleccionado = proyecto;
      this.mostrarModal = true;

      try {
        const { data } = await axios.get(`http://localhost:3000/proyectos/${proyecto.id_proyecto}/jefe`);
        this.dueñoProyecto = {
          nombre: data.nombre,
          carrera: data.carrera,
          correo: data.correo,
        };
      } catch (error) {
        console.error("Error al cargar el dueño del proyecto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información del dueño del proyecto.",
        });
      }
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.proyectoSeleccionado = null;
      this.dueñoProyecto = null;
    },
    async unirseProyecto(idProyecto) {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          Swal.fire({
            icon: "warning",
            title: "Sesión caducada",
            text: "Tu sesión ha caducado. Inicia sesión nuevamente.",
          }).then(() => {
            this.$router.push("/login");
          });
          return;
        }

        await axios.post(`http://localhost:3000/proyectos/${idProyecto}/unirse`, {
          userId,
        });

        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Te has unido exitosamente al proyecto.",
        });
        this.cerrarModal();
      } catch (error) {
        console.error("Error al unirse al proyecto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo unir al proyecto. Inténtalo de nuevo.",
        });
      }
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
  mounted() {
    this.cargarProyectos();
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

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  text-align: center;
}

</style>
