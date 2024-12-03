<template>
    <div class="register-container">
      <h2>Registrarse</h2>
      <form @submit.prevent="register">
        <div>
          <label for="email">Correo:</label>
          <input v-model="email" type="email" id="email" required />
        </div>
        <div>
          <label for="password">Contraseña:</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <button type="submit">Registrarse</button>
        <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
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
      register() {
        alert('Usuario registrado exitosamente');
        this.$router.push('/login'); 
      }
    }
  };
  </script>  