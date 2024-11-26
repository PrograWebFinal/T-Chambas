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
        placeholder="Buscar por nombre o habilidades"
        v-model="searchQuery"
        class="form-control mb-4"
      />

      <!-- Botones de habilidades más buscadas -->
      <div class="habilidades-populares">
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
          <!-- Renderizar cada perfil en la hilera -->
          <div
            v-for="perfil in fila"
            :key="perfil.id_usuario"
            class="col-md-3 text-center"
            @click="seleccionarPerfil(perfil)"
          >
            <div class="perfil">
              <img :src="perfil.foto || defaultFoto" alt="Foto de perfil" class="foto-perfil" />
              <h3 class="mt-2">{{ perfil.nombre }}</h3>
              <p>Habilidades: {{ perfil.habilidades }}</p>
              <div v-if="perfilSeleccionado === perfil" class="flecha-abajo">⬇️</div>
            </div>
          </div>
        </div>

        <!-- Ficha técnica -->
        <div
          v-if="perfilSeleccionado"
          class="ficha-tecnica"
        >
          <img
            :src="perfilSeleccionado.foto || defaultFoto"
            alt="Foto del perfil"
            class="ficha-foto-perfil"
          />
          <div class="ficha-detalles">
            <h2>{{ perfilSeleccionado.nombre }}</h2>
            <p><strong>Carrera:</strong> {{ perfilSeleccionado.carrera }}</p>
            <p><strong>Habilidades:</strong> {{ perfilSeleccionado.habilidades }}</p>
            <p><strong>Descripción:</strong> {{ perfilSeleccionado.descripcion }}</p>
            <button class="btn btn-success">Conectar o Invitar</button>
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
      perfiles: [], // Lista de perfiles cargados
      defaultFoto, // Foto predeterminada
    };
  },
  computed: {
    perfilesFiltrados() {
      if (!this.searchQuery) return this.perfiles;
      const query = this.searchQuery.toLowerCase();
      return this.perfiles.filter(
        (perfil) =>
          perfil.nombre.toLowerCase().includes(query) ||
          perfil.habilidades.toLowerCase().includes(query)
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
    this.cargarPerfiles(); // Cargar perfiles al montar el componente
  },
};
</script>


<style>
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
</style>