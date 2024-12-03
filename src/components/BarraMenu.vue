<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow">
    <div class="container">
      <a class="navbar-brand" @click.prevent="irInicio" style="cursor: pointer;">Connect-A</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/Perfil" class="nav-link">Mi Perfil</router-link>
          </li>

          <li class="nav-item">
            <router-link to="/Proyecto" class="nav-link">Mis Proyectos</router-link>
          </li>

          <li class="nav-item">
            <router-link to="/Perfiles" class="nav-link">Buscar Compañero</router-link>
          </li>

          <li class="nav-item">
            <router-link to="/Proyectos" class="nav-link">Buscar Proyectos</router-link>
          </li>

          <li class="nav-item">
            <button @click="logout" class="nav-link btn btn-link">Cerrar Sesión</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "BarraMenu",
  mounted() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      this.$router.push("/login");
    }
  },
  methods: {
    irInicio() {
      this.$router.push("/");
    },
    logout() {
      localStorage.removeItem("userId");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.navbar-nav .nav-link {
  font-size: 1rem;
  color: #495057;
}

.navbar-nav .nav-link:hover {
  color: #007bff;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
  color: #007bff;
}

.navbar-brand:hover {
  color: #0056b3;
}
</style>