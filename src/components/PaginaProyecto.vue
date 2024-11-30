<template>
  <div>
    <!-- Barra de navegación -->
    <BarraMenu />

    <!-- Contenedor principal -->
    <div class="proyecto-container">
      <h1 class="text-center">Mis Proyectos</h1>

      <!-- Formulario para crear/editar proyectos -->
      <form @submit.prevent="publicarProyecto" class="proyecto-form">
        <!-- Título del Proyecto -->
        <div class="mb-3">
          <label for="titulo" class="form-label">Título del Proyecto:</label>
          <input
            type="text"
            id="titulo"
            v-model="titulo"
            class="form-control"
            placeholder="Ingresa el título de tu proyecto"
            required
          />
        </div>

        <!-- Descripción -->
        <div class="mb-3">
          <label for="descripcion" class="form-label">Descripción:</label>
          <textarea
            id="descripcion"
            v-model="descripcion"
            class="form-control"
            rows="3"
            placeholder="Describe tu proyecto..."
          ></textarea>
        </div>

        <!-- Talento Buscado -->
        <div class="mb-3">
          <label for="talentoBuscado" class="form-label">Talento Buscado:</label>
          <input
            type="text"
            v-model="filtro"
            class="form-control"
            placeholder="Buscar talento..."
          />
          <div class="talento-container">
            <span
              v-for="(talento, index) in talentosFiltrados.slice(0, talentosMostrados)"
              :key="index"
              :class="['talento-tag', { 'selected': talentoBuscado.some(t => t.id_habilidad === talento.id_habilidad) }]"
              @click="toggleTalento(talento.id_habilidad, talento.nombre_habilidad)"
            >
              {{ talento.nombre_habilidad }}
            </span>
          </div>
          <div class="btn-group mt-2">
            <button
              type="button"
              v-if="talentosFiltrados.length > talentosMostrados"
              @click="verMasTalentos"
              class="btn btn-link"
            >
              Ver más
            </button>
            <button
              type="button"
              v-if="talentosMostrados > 5"
              @click="verMenosTalentos"
              class="btn btn-link"
            >
              Ver menos
            </button>
          </div>
        </div>

        <!-- Botones -->
        <div class="text-center">
          <button type="submit" class="btn btn-primary me-2">Publicar Proyecto</button>
          <button type="button" class="btn btn-secondary" @click="limpiarFormulario">Cancelar</button>
        </div>
      </form>

      <!-- Lista de Proyectos -->
      <div class="proyectos-creados mt-4" v-if="proyectos.length > 0">
        <h2 class="text-center">Proyectos Creados</h2>
        <ul class="list-group">
          <li v-for="proyecto in proyectos" :key="proyecto.id_proyecto" class="list-group-item">
            <div>
              <strong>Título:</strong> {{ proyecto.nombre_proyecto }}
              <br />
              <strong>Descripción:</strong> {{ proyecto.descripcion || 'Sin descripción' }}
              <br />
              <strong>Talento Buscado:</strong> 
              <span v-if="proyecto.habilidades.length > 0">
                {{ proyecto.habilidades.map(h => h.nombre_habilidad).join(', ') }}
              </span>
              <span v-else>
                Sin talento especificado
              </span>
              <br />
              <button @click="mostrarColaboradores(proyecto)" class="btn btn-sm btn-info mt-2">Ver Colaboradores</button>
              <button @click="editarProyecto(proyecto)" class="btn btn-sm btn-warning mt-2">Editar</button>
              <button @click="eliminarProyecto(proyecto.id_proyecto)" class="btn btn-sm btn-danger mt-2">Eliminar</button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Modal de Colaboradores -->
      <div v-if="modalColaboradores" class="modal-backdrop">
        <div class="modal-content">
          <h2>Compañeros que son parte de {{ proyectoSeleccionado.nombre_proyecto }}</h2>
          <ul>
            <li v-for="colaborador in colaboradores" :key="colaborador.id_usuario">
              <strong>Nombre:</strong> {{ colaborador.nombre }}
              <br />
              <strong>Habilidades:</strong> {{ colaborador.habilidades.join(', ') }}
              <br />
              <strong>Correo:</strong> {{ colaborador.correo }}
              <br />
              <button @click="eliminarColaborador(colaborador.id_usuario)" class="btn btn-sm btn-danger mt-2">Eliminar</button>
            </li>
          </ul>
          <button @click="cerrarModal" class="btn btn-secondary mt-3">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import BarraMenu from "@/components/BarraMenu.vue";

export default {
  name: "PaginaProyecto",
  components: {
    BarraMenu,
  },
  data() {
    return {
      titulo: "",
      descripcion: "",
      talentoBuscado: [],
      proyectos: [],
      filtro: "",
      talentosMostrados: 5,
      baseTalentos: [], // Almacena los talentos disponibles
      proyectoEditando: null,
      modalColaboradores: false,
      colaboradores: [],
      proyectoSeleccionado: null,
    };
  },
  computed: {
    talentosFiltrados() {
      return this.baseTalentos.filter((talento) =>
        talento.nombre_habilidad.toLowerCase().includes(this.filtro.toLowerCase())
      );
    },
  },
  methods: {
    async cargarProyectos() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          this.$router.push("/login");
          return;
        }

        const { data } = await axios.get(`http://localhost:3000/proyectos/${userId}`);
        this.proyectos = data;
      } catch (error) {
        console.error("Error al cargar los proyectos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al cargar los proyectos.",
        });
      }
    },
    async cargarTalentos() {
      try {
        const { data } = await axios.get("http://localhost:3000/usuarios/habilidades");
        this.baseTalentos = data.map((talento) => ({
          id_habilidad: talento.id_habilidad,
          nombre_habilidad: talento.nombre_habilidad,
        }));
      } catch (error) {
        console.error("Error al cargar habilidades:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al cargar las habilidades.",
        });
      }
    },
    async mostrarColaboradores(proyecto) {
      this.proyectoSeleccionado = proyecto;
      this.modalColaboradores = true;

      try {
        const { data } = await axios.get(`http://localhost:3000/proyectos/${proyecto.id_proyecto}/colaboradores`);
        this.colaboradores = data.map((colaborador) => ({
          id_usuario: colaborador.id_usuario,
          nombre: colaborador.nombre,
          correo: colaborador.correo,
          habilidades: colaborador.habilidades.map((h) => h.nombre_habilidad),
        }));
      } catch (error) {
        console.error("Error al obtener colaboradores:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los colaboradores.",
        });
      }
    },
    async eliminarColaborador(id_usuario) {
      try {
        await axios.delete(`http://localhost:3000/proyectos/${this.proyectoSeleccionado.id_proyecto}/colaboradores/${id_usuario}`);
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El colaborador fue eliminado del proyecto.",
        });
        this.mostrarColaboradores(this.proyectoSeleccionado); // Recargar colaboradores
      } catch (error) {
        console.error("Error al eliminar colaborador:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar al colaborador.",
        });
      }
    },
    cerrarModal() {
      this.modalColaboradores = false;
      this.proyectoSeleccionado = null;
    },
    toggleTalento(id_habilidad, nombre_habilidad) {
      const index = this.talentoBuscado.findIndex((t) => t.id_habilidad === id_habilidad);
      if (index !== -1) {
        this.talentoBuscado.splice(index, 1);
      } else {
        this.talentoBuscado.push({ id_habilidad, nombre_habilidad });
      }
    },
    async publicarProyecto() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        this.$router.push("/login");
        return;
      }

      try {
        if (this.proyectoEditando) {
          await axios.put(`http://localhost:3000/proyectos/${this.proyectoEditando.id_proyecto}`, {
            nombre_proyecto: this.titulo,
            descripcion: this.descripcion,
            habilidades: this.talentoBuscado.map((t) => t.id_habilidad),
          });
          Swal.fire({
            icon: "success",
            title: "Proyecto actualizado",
            text: "El proyecto se ha actualizado con éxito.",
          });
        } else {
          await axios.post("http://localhost:3000/proyectos", {
            nombre_proyecto: this.titulo,
            descripcion: this.descripcion,
            id_usuario_creador: userId,
            habilidades: this.talentoBuscado.map((t) => t.id_habilidad),
          });
          Swal.fire({
            icon: "success",
            title: "Proyecto creado",
            text: "El proyecto se ha creado con éxito.",
          });
        }
        this.limpiarFormulario();
        this.cargarProyectos();
      } catch (error) {
        console.error("Error al guardar el proyecto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al guardar el proyecto.",
        });
      }
    },
    async eliminarProyecto(id_proyecto) {
      try {
        await axios.delete(`http://localhost:3000/proyectos/${id_proyecto}`);
        Swal.fire({
          icon: "success",
          title: "Proyecto eliminado",
          text: "El proyecto se ha eliminado con éxito.",
        });
        this.cargarProyectos();
      } catch (error) {
        console.error("Error al eliminar el proyecto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al eliminar el proyecto.",
        });
      }
    },
    limpiarFormulario() {
      this.titulo = "";
      this.descripcion = "";
      this.talentoBuscado = [];
      this.filtro = "";
      this.talentosMostrados = 5;
      this.proyectoEditando = null;
    },
    verMasTalentos() {
      this.talentosMostrados += 5;
    },
    verMenosTalentos() {
      this.talentosMostrados = Math.max(5, this.talentosMostrados - 5);
    },
    editarProyecto(proyecto) {
      this.proyectoEditando = proyecto;
      this.titulo = proyecto.nombre_proyecto;
      this.descripcion = proyecto.descripcion;
      this.talentoBuscado = proyecto.habilidades.map((h) => ({
        id_habilidad: h.id_habilidad,
        nombre_habilidad: h.nombre_habilidad,
      }));
    },
  },
  mounted() {
    this.cargarProyectos();
    this.cargarTalentos(); // Se asegura de cargar los talentos disponibles
  },
};
</script>


<style scoped>
.proyecto-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.proyecto-form {
  margin-bottom: 30px;
}

.talento-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.talento-tag {
  padding: 8px 12px;
  background-color: #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.talento-tag.selected {
  background-color: #007bff;
  color: #ffffff;
}

h1 {
  font-size: 2.5rem;
  color: #343a40;
  margin-bottom: 20px;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  margin-bottom: 10px;
  border-radius: 8px;
}

.text-center {
  text-align: center;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; /* Asegúrate de que sea mayor que otros elementos */
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1051; /* Modal por encima del fondo */
  text-align: center;
}

</style>