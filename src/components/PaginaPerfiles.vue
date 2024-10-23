<template>
  <div class="buscar-companeros">
    <h1>Busca Compañeros</h1>
    
    <!-- Cuadro de búsqueda -->
    <input 
      type="text" 
      placeholder="Buscar por nombre o habilidades"
      v-model="searchQuery"
      class="busqueda"
    />
    
    <!-- Botones de habilidades más buscadas -->
    <div class="habilidades-populares">
      <button v-for="habilidad in habilidadesPopulares" :key="habilidad" @click="buscarPorHabilidad(habilidad)">
        {{ habilidad }}
      </button>
    </div>

    <!-- Perfiles de alumnos -->
    <div class="perfiles-alumnos">
      <div v-for="perfil in perfilesFiltrados" :key="perfil.nombre" class="perfil">
        <img :src="perfil.foto" alt="Foto de perfil" class="foto-perfil" />
        <h3>{{ perfil.nombre }}</h3>
        <p>Habilidades: {{ perfil.habilidades.join(', ') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginaBuscarCompaneros',
  data() {
    return {
      searchQuery: '',
      habilidadesPopulares: ['Programación', 'Diseño Gráfico', 'Marketing', 'Gestión de Proyectos'],
      perfiles: [
        { nombre: 'Juan Pérez', foto: 'path/to/juan.jpg', habilidades: ['Programación', 'Ciberseguridad'] },
        { nombre: 'Ana López', foto: 'path/to/ana.jpg', habilidades: ['Diseño Gráfico', 'Fotografía'] },
        { nombre: 'Luis García', foto: 'path/to/luis.jpg', habilidades: ['Marketing', 'Redacción'] },
        { nombre: 'María Fernández', foto: 'path/to/maria.jpg', habilidades: ['Gestión de Proyectos', 'Liderazgo'] },
      ]
    };
  },
  computed: {
    perfilesFiltrados() {
      if (!this.searchQuery) {
        return this.perfiles;
      }
      const query = this.searchQuery.toLowerCase();
      return this.perfiles.filter(perfil => 
        perfil.nombre.toLowerCase().includes(query) || 
        perfil.habilidades.some(habilidad => habilidad.toLowerCase().includes(query))
      );
    }
  },
  methods: {
    buscarPorHabilidad(habilidad) {
      this.searchQuery = habilidad;
    }
  }
};
</script>

<style scoped>
.buscar-companeros {
  text-align: center;
}

.busqueda {
  width: 100%;
  padding: 10px;
  margin: 20px 0;
  font-size: 16px;
}

.habilidades-populares {
  margin: 20px 0;
}

.habilidades-populares button {
  margin: 0 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
}

.perfiles-alumnos {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.perfil {
  width: 23%;
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.foto-perfil {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
