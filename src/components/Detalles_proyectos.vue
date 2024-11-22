<template>
  <div class="detalles-proyecto container mt-4">
    <!-- Título del proyecto -->
    <div class="header text-center mb-4">
      <h1 class="text-primary">{{ proyecto.titulo }}</h1>
      <button class="btn btn-outline-secondary" @click="$router.go(-1)">← Regresar</button>
    </div>

    <!-- Habilidades requeridas -->
    <div class="habilidades mb-3">
      <h5><strong>Habilidades requeridas:</strong></h5>
      <span
        v-for="habilidad in proyecto.habilidades"
        :key="habilidad"
        class="badge bg-info text-dark me-2 mb-2"
      >
        {{ habilidad }}
      </span>
    </div>

    <!-- Descripción -->
    <div class="descripcion mb-4">
      <h5><strong>Descripción:</strong></h5>
      <p>{{ proyecto.descripcion }}</p>
    </div>

    <!-- Imágenes del proyecto -->
    <div class="imagenes mb-4">
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

    <!-- Integrantes -->
    <div class="integrantes">
      <h5><strong>Integrantes:</strong></h5>
      <div class="row">
        <div
          v-for="perfil in proyecto.integrantes"
          :key="perfil.nombre"
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

    <!-- Botones de acción -->
    <div class="acciones mt-4 text-center">
      <button class="btn btn-outline-primary me-2" @click="compartirProyecto">
        Compartir Proyecto
      </button>
      <button class="btn btn-outline-success" @click="marcarFavorito">
        Marcar como Favorito
      </button>
    </div>

    <!-- Modal Lightbox -->
    <div v-if="lightboxImagen" class="lightbox" @click="cerrarLightbox">
      <img :src="lightboxImagen" alt="Imagen ampliada del proyecto" class="img-fluid" />
    </div>
  </div>
</template>

<script>
export default {
  name: "DetallesProyectos",
  data() {
    return {
      lightboxImagen: null,
    };
  },
  computed: {
    proyecto() {
      return JSON.parse(this.$route.params.proyecto);
    },
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
      alert("Proyecto marcado como favorito.");
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
