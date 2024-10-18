<template>
  <div class="perfil-container">
    <h1>Mi Perfil</h1>
    <form @submit.prevent="guardarPerfil" class="perfil-form">
      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre:</label>
        <input
          type="text"
          id="nombre"
          v-model="nombre"
          class="form-control"
          placeholder="Ingresa tu nombre"
          required
        />
      </div>
      <div class="mb-3">
        <label for="habilidades" class="form-label">Habilidades:</label>
        <input
          type="text"
          id="habilidades"
          v-model="habilidades"
          class="form-control"
          placeholder="Ejemplo: JavaScript, Vue.js, etc."
          required
        />
      </div>
      <div class="mb-3">
        <label for="biografia" class="form-label">Biografía:</label>
        <textarea
          id="biografia"
          v-model="biografia"
          class="form-control"
          rows="3"
          placeholder="Cuéntales sobre ti..."
          required
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Guardar Cambios</button>
      <button type="button" class="btn btn-secondary" @click="regresar">Regresar</button>
    </form>
    
    <div class="perfil-info" v-if="perfilGuardado">
      <h2>Información Actual</h2>
      <p><strong>Nombre:</strong> {{ nombre }}</p>
      <p><strong>Habilidades:</strong> {{ habilidades }}</p>
      <p><strong>Biografía:</strong> {{ biografia }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginaPerfil',
  data() {
    return {
      nombre: '',
      habilidades: '',
      biografia: '',
      perfilGuardado: false, 
    };
  },
  methods: {
    guardarPerfil() {
      this.perfilGuardado = true; 
      alert('Perfil actualizado con éxito');
    },
    regresar() {
      this.$router.go(-1); 
    },
  },
};
</script>

<style scoped>
.perfil-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.perfil-form {
  margin-bottom: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.perfil-info {
  margin-top: 30px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>


  