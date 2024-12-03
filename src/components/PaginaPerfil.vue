<template>
  <div>
    <BarraMenu />

    <div class="perfil-container">
      <h1 class="text-center">Mi Perfil</h1>
      <form @submit.prevent="guardarPerfil" class="perfil-form">
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre:</label>
          <input
            type="text"
            id="nombre"
            v-model="nombre"
            class="form-control"
            disabled
          />
        </div>

        <div class="mb-3">
          <label for="habilidades" class="form-label">Habilidades:</label>
          <input
            type="text"
            v-model="filtro"
            class="form-control"
            placeholder="Buscar habilidad o categoría..."
          />
          <div class="habilidades-container">
            <span
              v-for="(habilidad, index) in habilidadesFiltradas.slice(0, habilidadesMostradas)"
              :key="index"
              :class="['habilidad-tag', { 'selected': habilidades.includes(habilidad.nombre_habilidad) }]"
              @click="toggleHabilidad(habilidad.nombre_habilidad)"
            >
              {{ habilidad.nombre_habilidad }}
            </span>
          </div>
          <div v-if="habilidades.length === 0" class="mt-2 text-muted">
            Aún no tienes habilidades seleccionadas.
          </div>
          <div class="btn-group mt-2">
            <button
              type="button"
              v-if="habilidadesFiltradas.length > habilidadesMostradas"
              @click="verMasHabilidades"
              class="btn btn-link"
            >
              Ver más
            </button>
            <button
              type="button"
              v-if="habilidadesMostradas > 5"
              @click="verMenosHabilidades"
              class="btn btn-link"
            >
              Ver menos
            </button>
          </div>
        </div>

        <div class="mb-3">
          <label for="biografia" class="form-label">Biografía:</label>
          <textarea
            id="biografia"
            v-model="biografia"
            class="form-control"
            rows="3"
            placeholder="Cuéntales sobre ti..."
          ></textarea>
        </div>
        
        <div class="text-center">
          <button type="submit" class="btn btn-primary me-2">Guardar Cambios</button>
          <button type="button" class="btn btn-secondary" @click="regresar">Regresar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import BarraMenu from "@/components/BarraMenu.vue";

export default {
  name: "PaginaPerfil",
  components: {
    BarraMenu,
  },
  data() {
    return {
      nombre: "",
      biografia: "",
      habilidades: [],
      filtro: "",
      habilidadesMostradas: 5,
      baseHabilidades: [],
    };
  },
  computed: {
    habilidadesFiltradas() {
      return this.baseHabilidades.filter(
        (habilidad) =>
          habilidad.nombre_habilidad?.toLowerCase().includes(this.filtro.toLowerCase()) ||
          habilidad.nombre_carrera?.toLowerCase().includes(this.filtro.toLowerCase())
      );
    },
  },
  methods: {
    toggleHabilidad(nombreHabilidad) {
      if (this.habilidades.includes(nombreHabilidad)) {
        this.habilidades = this.habilidades.filter((h) => h !== nombreHabilidad);
      } else {
        this.habilidades.push(nombreHabilidad);
      }
    },
    async guardarPerfil() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        Swal.fire({
          icon: "warning",
          title: "Sesión no iniciada",
          text: "Redirigiendo al inicio de sesión.",
        }).then(() => {
          this.$router.push("/login");
        });
        return;
      }

      try {
        await axios.put(`http://localhost:3000/usuarios/perfil/${userId}/habilidades`, {
          habilidades: this.habilidades.map(
            (nombre) =>
              this.baseHabilidades.find((h) => h.nombre_habilidad === nombre)?.id_habilidad
          ),
        });

        await axios.put(`http://localhost:3000/usuarios/perfil/${userId}/descripcion`, {
          descripcion: this.biografia,
        });

        Swal.fire({
          icon: "success",
          title: "Perfil actualizado",
          text: "Tu perfil se ha actualizado con éxito.",
        });
      } catch (error) {
        console.error("Error al guardar el perfil:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al actualizar tu perfil.",
        });
      }
    },
    regresar() {
      this.$router.push("/");
    },
    verMasHabilidades() {
      this.habilidadesMostradas += 10;
    },
    verMenosHabilidades() {
      this.habilidadesMostradas = Math.max(5, this.habilidadesMostradas - 10);
    },
    async cargarDatosUsuario() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        this.$router.push("/login");
        return;
      }

      try {
        const { data: usuario } = await axios.get(`http://localhost:3000/usuarios/perfil/${userId}`);
        this.nombre = usuario.nombre || "Usuario Anónimo";
        this.biografia = usuario.descripcion || "";

        const { data: habilidadesUsuario } = await axios.get(
          `http://localhost:3000/usuarios/perfil/${userId}/habilidades`
        );
        this.habilidades = habilidadesUsuario.map((h) => h.nombre_habilidad);

        const { data: habilidadesDisponibles } = await axios.get(
          `http://localhost:3000/usuarios/habilidades`
        );
        this.baseHabilidades = habilidadesDisponibles;
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al cargar tu perfil.",
        });
      }
    },
  },
  mounted() {
    this.cargarDatosUsuario();
  },
};
</script>


<style scoped>
.perfil-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.perfil-form {
  margin-bottom: 30px;
}

.habilidades-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.habilidad-tag {
  padding: 8px 12px;
  background-color: #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.habilidad-tag.selected {
  background-color: #007bff;
  color: #ffffff;
}

h1 {
  font-size: 2.5rem;
  color: #343a40;
  margin-bottom: 20px;
}

.text-center {
  text-align: center;
}

.btn {
  border-radius: 8px;
  font-size: 1rem;
}
</style>