<template>
  <div>
    <!-- Barra de navegación -->
    <BarraMenu />

    <!-- Contenido principal -->
    <div class="buscar-companeros">
      <h1 class="text-center">Busca Compañeros</h1>

      <!-- Cuadro de búsqueda -->
      <input
        type="text"
        placeholder="Buscar por nombre, habilidades o carrera"
        v-model="searchQuery"
        class="form-control mb-4"
      />

      <!-- Botones de habilidades más buscadas -->
      <div class="habilidades-populares mb-3">
        <button
          v-for="habilidad in habilidadesPopulares"
          :key="habilidad"
          @click="buscarPorHabilidad(habilidad)"
          class="btn btn-outline-primary me-2"
        >
          {{ habilidad }}
        </button>
      </div>

      <!-- Perfiles de alumnos en paneles -->
      <div class="row">
        <div v-for="perfil in perfilesFiltrados" :key="perfil.id_usuario" class="col-md-4 col-lg-3 mb-4">
          <div class="card perfil-card" @click="abrirModal(perfil)">
            <img
              :src="perfil.foto || defaultFoto"
              alt="Foto de perfil"
              class="card-img-top perfil-imagen"
            />
            <div class="card-body text-center">
              <h5 class="card-title">{{ perfil.nombre }}</h5>
              <p class="card-text"><strong>Carrera:</strong> {{ perfil.carrera }}</p>
              <button class="btn btn-info mt-2">Ver Detalles</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para Ficha Técnica -->
      <div v-if="mostrarModal && perfilSeleccionado" class="modal-backdrop">
        <div class="modal-content">
          <h2>{{ perfilSeleccionado.nombre }}</h2>
          <img
            :src="perfilSeleccionado.foto || defaultFoto"
            alt="Foto del perfil"
            class="modal-foto-perfil mb-3"
          />
          <p><strong>Carrera:</strong> {{ perfilSeleccionado.carrera }}</p>
          <p><strong>Habilidades:</strong> {{ perfilSeleccionado.habilidades }}</p>
          <p><strong>Descripción:</strong> {{ perfilSeleccionado.descripcion }}</p>

          <!-- Selección de proyecto -->
          <div class="mt-3">
            <label for="proyectoSeleccionado" class="form-label">Selecciona un proyecto:</label>
            <select
              id="proyectoSeleccionado"
              v-model="proyectoSeleccionado"
              class="form-select mb-3"
            >
              <option v-for="proyecto in proyectos" :key="proyecto.id_proyecto" :value="proyecto.id_proyecto">
                {{ proyecto.nombre_proyecto }}
              </option>
            </select>
            <button
              class="btn btn-success"
              @click="confirmarInvitacion"
              :disabled="!proyectoSeleccionado"
            >
              Invitar al Proyecto
            </button>
          </div>

          <button class="btn btn-secondary mt-3" @click="cerrarModal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import BarraMenu from "@/components/BarraMenu.vue";
import defaultFoto from "../assets/Perfiles/Juan.jpg";

export default {
  name: "PaginaBuscarCompaneros",
  components: {
    BarraMenu,
  },
  data() {
    return {
      searchQuery: "",
      perfilSeleccionado: null,
      habilidadesPopulares: [],
      perfiles: [],
      proyectos: [], // Almacena los proyectos creados por el usuario
      defaultFoto,
      mostrarModal: false, // Controla la visibilidad del modal
      proyectoSeleccionado: null, // Proyecto seleccionado para invitar
    };
  },
  computed: {
    perfilesFiltrados() {
      if (!this.searchQuery) return this.perfiles;
      const query = this.searchQuery.toLowerCase();
      return this.perfiles.filter(
        (perfil) =>
          perfil.nombre.toLowerCase().includes(query) ||
          perfil.habilidades.toLowerCase().includes(query) ||
          perfil.carrera.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    async cargarPerfiles() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No se encontró userId en localStorage.");
          this.$router.push("/login");
          return;
        }

        const response = await axios.get("http://localhost:3000/usuarios", {
          params: { userId },
        });

        this.perfiles = response.data.map((usuario) => ({
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          foto: usuario.foto || null,
          carrera: usuario.carrera || "No especificado",
          habilidades: usuario.habilidades || "Sin habilidades",
          descripcion: usuario.descripcion || "Sin descripción",
        }));
      } catch (error) {
        console.error("Error al cargar perfiles:", error);
      }
    },
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
        console.error("Error al cargar proyectos:", error);
      }
    },
    buscarPorHabilidad(habilidad) {
      this.searchQuery = habilidad;
    },
    abrirModal(perfil) {
      this.perfilSeleccionado = perfil;
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.perfilSeleccionado = null;
      this.proyectoSeleccionado = null;
    },
    async confirmarInvitacion() {
      try {
        const { id_usuario } = this.perfilSeleccionado;
        const id_proyecto = this.proyectoSeleccionado;

        // Confirmación con SweetAlert2
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: `¿Quieres invitar a ${this.perfilSeleccionado.nombre} al proyecto seleccionado?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, invitar",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          await axios.post(`http://localhost:3000/proyectos/${id_proyecto}/invitar`, {
            id_usuario,
          });

          Swal.fire({
            icon: "success",
            title: "Invitación enviada",
            text: `${this.perfilSeleccionado.nombre} ha sido invitado al proyecto.`,
          });

          this.cerrarModal();
        }
      } catch (error) {
        console.error("Error al invitar al usuario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al invitar al usuario al proyecto.",
        });
      }
    },
  },
  mounted() {
    this.cargarPerfiles();
    this.cargarProyectos(); // Cargar los proyectos creados por el usuario
  },
};
</script>

<style scoped>
/* Estilos de los paneles */
.perfil-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.perfil-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.perfil-imagen {
  width: 100%;
  height: 150px;
  object-fit: cover; /* Evita la deformación de la imagen */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.buscar-companeros {
  padding: 20px;
}
.foto-perfil, .ficha-foto-perfil {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.ficha-tecnica {
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
}
.ficha-detalles {
  margin-left: 20px;
}
.perfiles-alumnos {
  margin-top: 20px;
}
.flecha-abajo {
  font-size: 20px;
  color: #007bff;
}
.buscar-companeros {
  padding: 20px;
}

.foto-perfil {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #007bff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.ficha-tecnica {
  background-color: #ffffff;
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 10px;
  text-align: left;
}

.ficha-foto-perfil {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #28a745;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.ficha-detalles h4 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.ficha-detalles p {
  margin: 5px 0;
  font-size: 0.95rem;
  color: #555;
}

.ficha-detalles strong {
  color: #007bff;
}

.ficha-detalles button {
  background-color: #28a745;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 0.9rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.ficha-detalles button:hover {
  background-color: #218838;
}

.flecha-abajo {
  font-size: 1.5rem;
  color: #007bff;
  margin-top: 5px;
}

.habilidades-populares button {
  margin-bottom: 5px;
}

.habilidades-populares button:hover {
  background-color: #007bff;
  color: white;
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
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-foto-perfil {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover; /* Asegura que la imagen no se deforme */
  display: block;
  margin: 0 auto; /* Centra la imagen horizontalmente */
}


</style>