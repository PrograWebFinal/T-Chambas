<template>
  <div v-if="proyecto" class="detalles-proyecto container mt-4">
    <!-- Título del proyecto -->
    <div class="header text-center mb-4">
      <h1 class="text-primary">{{ proyecto.titulo }}</h1>
      <button class="btn btn-outline-secondary" @click="$router.go(-1)">← Regresar</button>
    </div>

    <!-- Habilidades requeridas -->
    <div v-if="proyecto.habilidades.length > 0" class="habilidades mb-3">
      <h5><strong>Habilidades requeridas:</strong></h5>
      <span
        v-for="habilidad in proyecto.habilidades"
        :key="habilidad.id_habilidad"
        class="badge bg-info text-dark me-2 mb-2"
      >
        {{ habilidad.nombre_habilidad }}
      </span>
    </div>
    <div v-else>
      <p class="text-muted">Este proyecto no tiene habilidades requeridas.</p>
    </div>

    <!-- Descripción -->
    <div class="descripcion mb-4">
      <h5><strong>Descripción:</strong></h5>
      <p>{{ proyecto.descripcion }}</p>
    </div>

    <!-- Imágenes del proyecto -->
    <div v-if="proyecto.imagenes.length > 0" class="imagenes mb-4">
      <h5><strong>Galería del proyecto:</strong></h5>
      <div class="row">
        <div v-for="imagen in proyecto.imagenes" :key="imagen" class="col-sm-6 col-md-4 mb-3">
          <img
            :src="imagen"
            alt="Imagen del proyecto"
            class="img-fluid rounded shadow"
            @click="abrirLightbox(imagen)"
            loading="lazy"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-muted">No hay imágenes disponibles para este proyecto.</p>
    </div>

    <!-- Integrantes -->
    <div v-if="proyecto.integrantes.length > 0" class="integrantes">
      <h5><strong>Integrantes:</strong></h5>
      <div class="row">
        <div
          v-for="perfil in proyecto.integrantes"
          :key="perfil.id_usuario"
          class="col-sm-12 col-md-6 col-lg-4 mb-4"
        >
          <div class="card h-100 shadow">
            <img
              :src="perfil.foto"
              alt="Foto de perfil de {{ perfil.nombre }}"
              class="card-img-top"
              loading="lazy"
            />
            <div class="card-body">
              <h6 class="card-title text-primary">{{ perfil.nombre }}</h6>
              <p class="card-text">Carrera: {{ perfil.carrera }}</p>
              <p class="card-text">
                Habilidades:
                <span
                  v-for="habilidad in perfil.habilidades"
                  :key="habilidad"
                  class="badge bg-secondary text-light me-1"
                >
                  {{ habilidad }}
                </span>
              </p>
              <p class="card-text" v-if="perfil.proyectos.length">
                Proyectos:
                <span class="text-muted">{{ perfil.proyectos.join(', ') }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-muted">No hay integrantes asociados con este proyecto.</p>
    </div>

    <!-- Botones de acción -->
    <div class="acciones mt-4 text-center">
      <button class="btn btn-outline-primary me-2" @click="compartirProyecto">
        Compartir Proyecto
      </button>
      <button class="btn btn-outline-success" @click="marcarFavorito">
        {{ favorito ? "Quitar de Favoritos" : "Marcar como Favorito" }}
      </button>
    </div>

    <!-- Modal Lightbox -->
    <div v-if="lightboxImagen" class="lightbox" @click="cerrarLightbox">
      <img :src="lightboxImagen" alt="Imagen ampliada del proyecto" class="img-fluid" />
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
      proyecto: null,
      lightboxImagen: null,
      favorito: false, // Estado inicial para el botón de favoritos
    };
  },
  async created() {
    const id = this.$route.params.id; // Obtener el ID del proyecto desde la URL
    try {
      const response = await axios.get(`http://localhost:3000/proyectos/${id}`);
      this.proyecto = {
        ...response.data,
        habilidades: response.data.habilidades || [],
        imagenes: response.data.imagenes || [],
        integrantes: response.data.integrantes || [],
      };
    } catch (error) {
      console.error("Error al cargar los detalles del proyecto:", error);
    }
  },
  methods: {
    abrirLightbox(imagen) {
      this.lightboxImagen = imagen;
    },
    cerrarLightbox() {
      this.lightboxImagen = null;
    },
    compartirProyecto() {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        alert("Enlace del proyecto copiado al portapapeles.");
      });
    },
    marcarFavorito() {
      this.favorito = !this.favorito;
      const mensaje = this.favorito
        ? "Proyecto marcado como favorito."
        : "Proyecto eliminado de favoritos.";
      alert(mensaje);
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
