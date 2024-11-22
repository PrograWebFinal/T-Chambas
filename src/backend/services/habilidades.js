const db = require('../db');

async function obtenerHabilidades() {
  return await db.promise().query(
    `SELECT h.id_habilidad, h.nombre_habilidad, c.nombre_carrera 
     FROM habilidades h
     LEFT JOIN carreras c ON h.id_carrera = c.id_carrera`
  );
}

module.exports = { obtenerHabilidades };