<template>
  <div class="proyecto-container">
    <h1>Publicar Mi Proyecto</h1>
    <form @submit.prevent="publicarProyecto" class="proyecto-form">
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
      <div class="mb-3">
        <label for="descripcion" class="form-label">Descripción:</label>
        <textarea
          id="descripcion"
          v-model="descripcion"
          class="form-control"
          rows="3"
          placeholder="Describe tu proyecto..."
          required
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="talentoBuscado" class="form-label">Talento Buscado:</label>
        <input
          type="text"
          id="talentoBuscado"
          v-model="talentoBuscado"
          class="form-control"
          placeholder="Ejemplo: Desarrollador, Diseñador, etc."
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Publicar Proyecto</button>
      <button type="button" class="btn btn-secondary" @click="regresar">Regresar</button>
    </form>

    <div class="proyectos-creados">
      <h2>Proyectos Creados</h2>
      <ul>
        <li v-for="proyecto in proyectos" :key="proyecto.id">
          <strong>Título:</strong> {{ proyecto.titulo }} - <strong>Descripción:</strong> {{ proyecto.descripcion }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginaProyecto',
  data() {
    return {
      titulo: '',
      descripcion: '',
      talentoBuscado: '',
      proyectos: [],
    };
  },
  methods: {
    publicarProyecto() {
      const nuevoProyecto = {
        id: this.proyectos.length + 1,
        titulo: this.titulo,
        descripcion: this.descripcion,
        talentoBuscado: this.talentoBuscado,
      };
      this.proyectos.push(nuevoProyecto); 
      this.limpiarFormulario();
      alert('Proyecto publicado con éxito');
    },
    limpiarFormulario() {
      this.titulo = '';
      this.descripcion = '';
      this.talentoBuscado = '';
    },
    regresar() {
      this.$router.go(-1); 
    },
  },
};
</script>

<style scoped>
.proyecto-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.proyecto-form {
  margin-bottom: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.proyectos-creados {
  margin-top: 30px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
