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
        <div 
          v-for="(fila, index) in filasPerfiles" 
          :key="index" 
          class="row mb-4"
        >
          <!-- Renderizar cada perfil en la hilera -->
          <div 
            v-for="perfil in fila" 
            :key="perfil.nombre" 
            class="col-md-3 text-center"
            @click="seleccionarPerfil(perfil)"
          >
            <div class="perfil">
              <img :src="perfil.foto" alt="Foto de perfil" class="foto-perfil" />
              <h3 class="mt-2">{{ perfil.nombre }}</h3>
              <p>Habilidades: {{ perfil.habilidades.join(', ') }}</p>
              <div v-if="perfilSeleccionado === perfil" class="flecha-abajo">⬇️</div>
            </div>
          </div>
          
          <!-- Ficha técnica -->
          <div 
            v-if="perfilSeleccionado && fila.includes(perfilSeleccionado)" 
            class="ficha-tecnica"
          >
            <img 
              :src="perfilSeleccionado.foto" 
              alt="Foto del perfil" 
              class="ficha-foto-perfil" 
            />
            <div class="ficha-detalles">
              <h2>{{ perfilSeleccionado.nombre }}</h2>
              <p><strong>Carrera:</strong> {{ perfilSeleccionado.carrera }}</p>
              <p><strong>Habilidades:</strong> {{ perfilSeleccionado.habilidades.join(', ') }}</p>
              <p><strong>Descripción:</strong> {{ perfilSeleccionado.descripcion }}</p>
              <p v-if="perfilSeleccionado.proyectos.length"><strong>Proyectos:</strong> {{ perfilSeleccionado.proyectos.join(', ') }}</p>
              <button class="btn btn-success">Conectar o Invitar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarraMenu from "@/components/BarraMenu.vue";
import JuanFoto from "../assets/Perfiles/Juan.jpg";
import AnaFoto from "../assets/Perfiles/Ana.jpeg";
import LuisFoto from "../assets/Perfiles/Luis.jpg";
import MariaFoto from "../assets/Perfiles/Maria.jpg";
import DiegoFoto from "../assets/Perfiles/Diego.jpg";
import PedroFoto from "../assets/Perfiles/Pedro.jpg";

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
        "Contabilidad"
      ],
      perfiles: [
        { 
          nombre: "Juan Pérez", 
          foto: JuanFoto, 
          carrera: "Ingeniería en Tecnologías de la Información", 
          habilidades: ["Programación", "Ciberseguridad"], 
          descripcion: "Estudiante apasionado por la tecnología y la seguridad informática.", 
          proyectos: ["Sistema de Ciberseguridad", "Aplicación de Redes"] 
        },
        { 
          nombre: "Ana López", 
          foto: AnaFoto, 
          carrera: "Diseño Multimedia", 
          habilidades: ["Diseño Gráfico", "Fotografía"], 
          descripcion: "Amante del diseño visual y la fotografía digital.", 
          proyectos: [] 
        },
        { 
          nombre: "Luis García", 
          foto: LuisFoto, 
          carrera: "Mercadotecnia Estratégica", 
          habilidades: ["Marketing", "Redacción"], 
          descripcion: "Experto en marketing digital y contenido creativo.", 
          proyectos: ["Campaña Publicitaria 2023"] 
        },
        { 
          nombre: "María Fernández", 
          foto: MariaFoto, 
          carrera: "Administración y Dirección de Empresas", 
          habilidades: ["Gestión de Proyectos", "Liderazgo"], 
          descripcion: "Apasionada por la gestión de proyectos y el liderazgo.", 
          proyectos: ["Gestión de Eventos Estudiantiles"] 
        },
        { 
          nombre: "Diego Martínez", 
          foto: DiegoFoto, 
          carrera: "Finanzas y Contaduría Pública", 
          habilidades: ["Contabilidad", "Finanzas"], 
          descripcion: "Entusiasta de las finanzas y la contabilidad.", 
          proyectos: [] 
        },
        { 
          nombre: "Pedro Paredes", 
          foto: PedroFoto, 
          carrera: "Ingeniería Mecatrónica", 
          habilidades: ["Electrónica", "Programación"], 
          descripcion: "Apasionado por la mecatrónica y la programación.", 
          proyectos: [] 
        },
      ],
    };
  },
  computed: {
    perfilesFiltrados() {
      if (!this.searchQuery) {
        return this.perfiles;
      }
      const query = this.searchQuery.toLowerCase();
      return this.perfiles.filter(
        (perfil) =>
          perfil.nombre.toLowerCase().includes(query) || 
          perfil.habilidades.some((habilidad) => habilidad.toLowerCase().includes(query))
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
    buscarPorHabilidad(habilidad) {
      this.searchQuery = habilidad;
    },
    seleccionarPerfil(perfil) {
      this.perfilSeleccionado = this.perfilSeleccionado === perfil ? null : perfil;
    },
  },
};
</script>

<style scoped>
.buscar-companeros {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}
.perfiles-alumnos {
  margin-top: 20px;
}
.foto-perfil {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
.flecha-abajo {
  font-size: 20px;
  color: #007bff;
}
.ficha-tecnica {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
}
.ficha-foto-perfil {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
.ficha-detalles {
  text-align: left;
}
</style>