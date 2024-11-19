<template>
  <div class="detalles-proyecto">
    <h1>{{ proyecto.titulo }}</h1>
    <p><strong>Habilidades requeridas:</strong> {{ proyecto.habilidades.join(', ') }}</p>
    <p><strong>Descripción:</strong> {{ proyecto.descripcion }}</p>
    <div class="imagenes">
      <img v-for="imagen in proyecto.imagenes" :key="imagen" :src="imagen" alt="Imagen del proyecto" />
    </div>
    <div class="integrantes">
      <h2>Integrantes</h2>
      <div v-for="perfil in proyecto.integrantes" :key="perfil.nombre" class="perfil">
        <img :src="perfil.foto" alt="Foto de perfil" class="foto-perfil" />
        <h3>{{ perfil.nombre }}</h3>
        <p>Carrera: {{ perfil.carrera }}</p>
        <p>Habilidades: {{ perfil.habilidades.join(', ') }}</p>
        <p v-if="perfil.proyectos.length">Proyectos: {{ perfil.proyectos.join(', ') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetallesProyectos',
  computed: {
    proyecto() {
      return JSON.parse(this.$route.params.proyecto);
    }
  }
};
</script>

<style scoped>
.detalles-proyecto {
  padding: 20px;
}
.imagenes img {
  width: 100px;
  height: 100px;
  margin: 5px;
  border-radius: 5px;
}
.integrantes .perfil {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.foto-perfil {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
  margin-right: 15px;
}
</style>

