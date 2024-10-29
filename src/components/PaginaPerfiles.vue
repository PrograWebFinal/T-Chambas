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
    <!-- Perfiles de alumnos en hileras de 4 -->
    <div class="perfiles-alumnos">
      <div v-for="(fila, index) in filasPerfiles" :key="index" class="fila">
        <!-- Renderizar cada perfil en la hilera -->
        <div v-for="perfil in fila" :key="perfil.nombre" class="perfil" @click="seleccionarPerfil(perfil)">
          <img :src="perfil.foto" alt="Foto de perfil" class="foto-perfil" />
          <h3>{{ perfil.nombre }}</h3>
          <p>Habilidades: {{ perfil.habilidades.join(', ') }}</p>
          <!-- Flecha abajo si el perfil está seleccionado -->
          <div v-if="perfilSeleccionado === perfil" class="flecha-abajo">⬇️</div>
        </div>
        <!-- Ficha técnica solo en la hilera donde está el perfil seleccionado -->
        <div v-if="perfilSeleccionado && fila.includes(perfilSeleccionado)" class="ficha-tecnica">
          <img :src="perfilSeleccionado.foto" alt="Foto del perfil" class="ficha-foto-perfil" />
          <div class="ficha-detalles">
            <h2>{{ perfilSeleccionado.nombre }}</h2>
            <p><strong>Carrera:</strong> {{ perfilSeleccionado.carrera }}</p>
            <p><strong>Habilidades:</strong> {{ perfilSeleccionado.habilidades.join(', ') }}</p>
            <p><strong>Descripción:</strong> {{ perfilSeleccionado.descripcion }}</p>
            <p v-if="perfilSeleccionado.proyectos.length"><strong>Proyectos:</strong> {{ perfilSeleccionado.proyectos.join(', ') }}</p>
            <!-- Botón de conectar o invitar -->
            <button class="btn-conectar">Conectar o Invitar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JuanFoto from '../assets/Perfiles/Juan.jpg';
import AnaFoto from '../assets/Perfiles/Ana.jpeg';
import LuisFoto from '../assets/Perfiles/Luis.jpg';
import MariaFoto from '../assets/Perfiles/Maria.jpg';
import DiegoFoto from '../assets/Perfiles/Diego.jpg';
import PedroFoto from '../assets/Perfiles/Pedro.jpg';

export default {
  name: 'PaginaBuscarCompaneros',
  data() {
    return {
      searchQuery: '',
      perfilSeleccionado: null,
      habilidadesPopulares: ['Programación', 'Fotografía', 'Marketing', 'Gestión de Proyectos', 'Contabilidad', ],
      perfiles: [
        { nombre: 'Juan Pérez', foto: JuanFoto, carrera: 'Ingeniería en Tecnologías de la Información', habilidades: ['Programación', 'Ciberseguridad'], descripcion: 'Estudiante apasionado por la tecnología y la seguridad informática.', proyectos: ['Sistema de Ciberseguridad', 'Aplicación de Redes'] },
        { nombre: 'Ana López', foto: AnaFoto, carrera: 'Diseño Multimedia', habilidades: ['Diseño Gráfico', 'Fotografía'], descripcion: 'Amante del diseño visual y la fotografía digital.', proyectos: ['N/D'] },
        { nombre: 'Luis García', foto: LuisFoto, carrera: 'Mercadotecnia Estrategica', habilidades: ['Marketing', 'Redacción'], descripcion: 'Experto en marketing digital y contenido creativo.', proyectos: ['Campaña Publicitaria 2023'] },
        { nombre: 'María Fernández', foto: MariaFoto, carrera: 'Administración y Dirección de Empresas', habilidades: ['Gestión de Proyectos', 'Liderazgo'], descripcion: 'Apasionada por la gestión de proyectos y el liderazgo.', proyectos: ['Gestión de Eventos Estudiantiles'] },
        { nombre: 'Diego Martínez', foto: DiegoFoto, carrera: 'Finanzas y Contaduría Pública', habilidades: ['Contabilidad', 'Finanzas'], descripcion: 'Apasionada por la gestión de proyectos y el liderazgo.', proyectos: ['N/D'] },
        { nombre: 'Pedro Paredes', foto: PedroFoto, carrera: 'Ingeniería Mecatrónica', habilidades: ['Electrónica', 'Programación'], descripcion: 'Apasionada por la gestión de proyectos y el liderazgo.', proyectos: ['N/D'] },
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
    },
    filasPerfiles() {
      const filas = [];
      for (let i = 0; i < this.perfilesFiltrados.length; i += 4) {
        filas.push(this.perfilesFiltrados.slice(i, i + 4));
      }
      return filas;
    }
  },
  methods: {
    buscarPorHabilidad(habilidad) {
      this.searchQuery = habilidad;
    },
    seleccionarPerfil(perfil) {
      this.perfilSeleccionado = this.perfilSeleccionado === perfil ? null : perfil;
    }
  }
};
</script>

<style scoped>
.buscar-companeros {
  text-align: center;
}
.busqueda {
  width: 80%;
  padding: 10px;
  margin: 20px 10px;
  font-size: 16px;
}
.habilidades-populares {
  margin: 20px 0;
  font-size: 20px;
}
.habilidades-populares button {
  margin: 0 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
}
.perfiles-alumnos {
  display: grid;
  gap: 20px;
  margin-top: 20px;
  padding: 20px;
}
.fila {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.perfil {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  font-size: 18px;
}
.foto-perfil {
  width: 200px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
  margin: 5%;
}
.flecha-abajo {
  font-size: 30px;
  color: #333;
  margin-top: 5px;
}
.ficha-tecnica {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-top: 2px solid #ccc;
  grid-column: span 4;
}
.ficha-foto-perfil {
  width: 250px;
  height: 300px;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
  margin-right: 60px;
  margin-left: 60px;
}
.ficha-detalles {
  text-align: left;
  font-size: 16px;
}
.btn-conectar {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
