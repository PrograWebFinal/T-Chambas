<template>
  <div v-if="proyecto" class="detalles-proyecto container mt-4">
    <div class="header text-center mb-4">
      <h1 class="text-primary">{{ proyecto.titulo }}</h1>
      <button class="btn btn-outline-secondary" @click="$router.go(-1)">← Regresar</button>
    </div>

    <div class="habilidades mb-3">
      <h5><strong>Habilidades requeridas:</strong></h5>
      <span
        v-for="habilidad in proyecto.habilidades"
        :key="habilidad.id_habilidad"
        class="badge bg-info text-dark me-2 mb-2"
      >
        {{ habilidad.nombre_habilidad }}
      </span>
    </div>

    <div class="descripcion mb-4">
      <h5><strong>Descripción:</strong></h5>
      <p>{{ proyecto.descripcion }}</p>
    </div>

    <div v-if="proyecto.integrantes.length > 0" class="integrantes">
      <h5><strong>Integrantes:</strong></h5>
      <div class="row">
        <div
          v-for="perfil in proyecto.integrantes"
          :key="perfil.id_usuario"
          class="col-sm-12 col-md-6 col-lg-4 mb-4"
        >
          <div class="card h-100 shadow">
            <div class="card-body">
              <h6 class="card-title text-primary">{{ perfil.nombre }}</h6>
              <p class="card-text">Carrera: {{ perfil.carrera }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="acciones mt-4 text-center">
      <button class="btn btn-success mt-3" @click="unirseProyecto" v-if="!esIntegrante">
        Unirse al Proyecto
      </button>
    </div>
  </div>

  <div v-else class="text-center mt-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DetallesProyectos",
  data() {
    return {
      proyecto: {
        habilidades: [],
        integrantes: [], // Inicializar como un array vacío para evitar errores
      },
      esIntegrante: false,
    };
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const response = await axios.get(`http://localhost:3000/proyectos/${id}`);
      this.proyecto = {
        ...response.data,
        habilidades: response.data.habilidades || [],
        integrantes: response.data.integrantes || [],
      };

      // Validar si el usuario actual es un integrante del proyecto
      const userId = localStorage.getItem("userId");
      if (userId && Array.isArray(this.proyecto.integrantes)) {
        this.esIntegrante = this.proyecto.integrantes.some(
          (integrante) => integrante.id_usuario === parseInt(userId)
        );
      }
    } catch (error) {
      console.error("Error al cargar los detalles del proyecto:", error);
    }
  },
  methods: {
    async unirseProyecto() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          alert("No estás autenticado. Inicia sesión para unirte al proyecto.");
          return;
        }

        // Validar si el proyecto tiene un ID antes de realizar la solicitud
        if (!this.proyecto.id_proyecto) {
          alert("Error al obtener el ID del proyecto. Inténtalo nuevamente.");
          return;
        }

        await axios.post(`http://localhost:3000/proyectos/${this.proyecto.id_proyecto}/unirse`, {
          userId,
        });

        alert("Te has unido exitosamente al proyecto.");
        this.esIntegrante = true;
      } catch (error) {
        console.error("Error al unirse al proyecto:", error);
        alert("No se pudo unir al proyecto. Inténtalo de nuevo.");
      }
    },
  },
};
</script>


<style scoped>
.detalles-proyecto {
  padding: 20px;
}
.habilidades .badge {
  font-size: 0.9em;
}
.img-fluid {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.img-fluid:hover {
  transform: scale(1.05);
}
.card {
  border: none;
  transition: box-shadow 0.2s ease-in-out;
}
.card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.lightbox img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
}
</style>
