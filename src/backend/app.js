const express = require('express');
const cors = require('cors'); 
const app = express();
const usuariosRoutes = require('./routes/usuarios'); 
const proyectosRoutes = require('./routes/proyectos'); 
require('dotenv').config();

// Middleware para CORS
app.use(cors());

// Middleware para interpretar JSON
app.use(express.json());

// Rutas
app.use('/usuarios', usuariosRoutes);
app.use('/proyectos', proyectosRoutes); 

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

