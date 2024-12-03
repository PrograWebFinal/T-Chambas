<template>
  <div class="container d-flex justify-content-center align-items-center vh-100 bg-white">
    <div class="card shadow-lg p-4" style="width: 100%; max-width: 450px;">
      <div class="d-flex justify-content-center mb-4">
        <button
          class="btn btn-outline-primary me-2"
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          Iniciar Sesión
        </button>
        <button
          class="btn btn-outline-success"
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          Registrarse
        </button>
      </div>

      <div>
        <div v-if="activeTab === 'login'">
          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="loginEmail" class="form-label">Correo Electrónico</label>
              <input
                type="email"
                id="loginEmail"
                class="form-control"
                v-model="loginData.email"
                required
                placeholder="tuemail@example.com"
              />
            </div>
            <div class="mb-3">
              <label for="loginPassword" class="form-label">Contraseña</label>
              <input
                type="password"
                id="loginPassword"
                class="form-control"
                v-model="loginData.password"
                required
                placeholder="********"
              />
            </div>
            <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
          </form>
        </div>

        <div v-if="activeTab === 'register'">
          <form @submit.prevent="register">
            <div class="mb-3">
              <label for="firstName" class="form-label">Nombre(s)</label>
              <input
                type="text"
                id="firstName"
                class="form-control"
                v-model="registerData.firstName"
                required
                placeholder="Tu Nombre"
              />
            </div>
            <div class="mb-3">
              <label for="lastName" class="form-label">Apellidos</label>
              <input
                type="text"
                id="lastName"
                class="form-control"
                v-model="registerData.lastName"
                required
                placeholder="Tus Apellidos"
              />
            </div>
            <div class="mb-3">
              <label for="registerEmail" class="form-label">Correo Electrónico</label>
              <input
                type="email"
                id="registerEmail"
                class="form-control"
                v-model="registerData.email"
                required
                placeholder="tuemail@example.com"
              />
            </div>
            <div class="mb-3">
              <label for="registerPassword" class="form-label">Contraseña</label>
              <input
                type="password"
                id="registerPassword"
                class="form-control"
                v-model="registerData.password"
                required
                placeholder="********"
              />
            </div>
            <div class="mb-3">
              <label for="career" class="form-label">Carrera</label>
              <select
                id="career"
                class="form-control"
                v-model="registerData.career"
                required
              >
                <option value="" disabled>Seleccione una carrera</option>
                <option
                  v-for="carrera in carreras"
                  :key="carrera.id_carrera"
                  :value="carrera.id_carrera"
                >
                  {{ carrera.nombre_carrera }}
                </option>
              </select>
            </div>
            <button type="submit" class="btn btn-success w-100">Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "LoginRegister",
  data() {
    return {
      activeTab: "login", 
      loginData: {
        email: "",
        password: "",
      },
      registerData: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        career: "", 
      },
      carreras: [], 
    };
  },
  methods: {
    async fetchCarreras() {
      try {
        const response = await axios.get("http://localhost:3000/usuarios/carreras");
        this.carreras = response.data;
        console.log("Carreras cargadas:", this.carreras);
      } catch (error) {
        console.error("Error al cargar carreras:", error);
        Swal.fire({
          title: "Error",
          text: "Error al cargar las carreras.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
      }
    },
    async login() {
      try {
        const response = await axios.post("http://localhost:3000/usuarios/login", {
          correo: this.loginData.email,
          contraseña: this.loginData.password,
        });

        console.log("Inicio de sesión exitoso:", response.data);

        Swal.fire({
          title: "¡Éxito!",
          text: "Inicio de sesión exitoso.",
          icon: "success",
          confirmButtonText: "Continuar",
        });

        localStorage.setItem("userId", response.data.user.id_usuario);

        this.$router.push("/");
      } catch (error) {
        console.error("Error al iniciar sesión:", error);

        const errorMessage = error.response
          ? error.response.data.error
          : "Error inesperado al iniciar sesión.";
        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Reintentar",
        });
      }
    },
    async register() {
      try {
        const response = await axios.post("http://localhost:3000/usuarios/registro", {
          nombre: this.registerData.firstName,
          apellidos: this.registerData.lastName,
          correo: this.registerData.email,
          contraseña: this.registerData.password,
          id_carrera: this.registerData.career, 
          descripcion: null,
        });

        console.log("Usuario registrado exitosamente:", response.data);

        Swal.fire({
          title: "¡Éxito!",
          text: "Usuario registrado exitosamente.",
          icon: "success",
          confirmButtonText: "Entendido",
        });
      } catch (error) {
        console.error("Error al registrar usuario:", error);
        const errorMessage = error.response
          ? error.response.data.error
          : "Error inesperado al registrar usuario.";
        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Reintentar",
        });
      }
    },
  },
  mounted() {
    this.fetchCarreras(); 
  },
};
</script>


  <style scoped>
  .container {
    background-color: #f8f9fa;
  }
  .card {
    border-radius: 15px;
  }
  .btn {
    width: 48%;
    font-weight: bold;
  }
  .btn.active {
    color: white;
    background-color: #007bff;
    border-color: #007bff;
  }
  </style>  
  