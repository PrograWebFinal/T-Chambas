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

      <!-- Perfiles de alumnos en hileras -->
      <div class="perfiles-alumnos">
        <div v-for="(fila, index) in filasPerfiles" :key="index" class="row mb-4">
          <div
            v-for="perfil in fila"
            :key="perfil.id_usuario"
            class="col-md-3 text-center"
          >
            <div class="perfil" @click="seleccionarPerfil(perfil)">
              <img :src="perfil.foto || defaultFoto" alt="Foto de perfil" class="foto-perfil" />
              <h3 class="mt-2">{{ perfil.nombre }}</h3>
              <p>Habilidades: {{ perfil.habilidades }}</p>
              <div v-if="perfilSeleccionado === perfil" class="flecha-abajo">⬇️</div>
            </div>

            <!-- Ficha técnica debajo del perfil seleccionado -->
            <div
              v-if="perfilSeleccionado === perfil"
              class="ficha-tecnica mt-3 p-3 border rounded"
            >
              <img
                :src="perfilSeleccionado.foto || defaultFoto"
                alt="Foto del perfil"
                class="ficha-foto-perfil mb-2"
              />
              <div class="ficha-detalles">
                <h4>{{ perfilSeleccionado.nombre }}</h4>
                <p><strong>Carrera:</strong> {{ perfilSeleccionado.carrera }}</p>
                <p><strong>Habilidades:</strong> {{ perfilSeleccionado.habilidades }}</p>
                <p><strong>Descripción:</strong> {{ perfilSeleccionado.descripcion }}</p>
                <button class="btn btn-success mt-2">Conectar o Invitar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
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
      habilidadesPopulares: [
        "Programación",
        "Fotografía",
        "Marketing",
        "Gestión de Proyectos",
        "Contabilidad",
      ],
      perfiles: [],
      defaultFoto,
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
    filasPerfiles() {
      const filas = [];
      for (let i = 0; i < this.perfilesFiltrados.length; i += 4) {
        filas.push(this.perfilesFiltrados.slice(i, i + 4));
      }
      return filas;
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
    buscarPorHabilidad(habilidad) {
      this.searchQuery = habilidad;
    },
    seleccionarPerfil(perfil) {
      this.perfilSeleccionado = this.perfilSeleccionado === perfil ? null : perfil;
    },
  },
  mounted() {
    this.cargarPerfiles();
  },
};
</script>

<style scoped>
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
</style>