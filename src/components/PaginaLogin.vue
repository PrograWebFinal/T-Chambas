<template>
    <div class="login-container">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div>
          <label for="email">Correo:</label>
          <input v-model="email" type="email" id="email" required />
        </div>
        <div>
          <label for="password">Contraseña:</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <button type="submit">Iniciar Sesión</button>
        <p>¿No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link></p>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      login() {
        if (this.email === 'test@example.com' && this.password === 'password') {
          localStorage.setItem('auth', true); // Guardar autenticación en localStorage
          this.$router.push('/'); // Redirigir a la página principal
        } else {
          alert('Correo o contraseña incorrectos');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: auto;
    padding: 1rem;
  }
  </style>
  