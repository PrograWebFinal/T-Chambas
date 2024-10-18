<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="#">A-Tinder Chambas</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
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
          </ul>
        </div>
      </div>
    </nav>

    <div class="welcome-container">
      <h1 class="text-center">Bienvenido a la Plataforma de Matchmaking</h1>
      <p class="text-center lead">Encuentra compañeros para tus proyectos universitarios aquí.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginaInicio',
};
</script>

<style scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; 
  background-color: #f8f9fa; 
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  font-size: 2.5rem; 
  color: #343a40;
}

p {
  font-size: 1.25rem;
  color: #6c757d;
}

.navbar {
  margin-bottom: 20px; 
}
</style>



