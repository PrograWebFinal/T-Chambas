const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexión a la base de datos
const { obtenerHabilidades } = require('../services/habilidades'); // Servicio compartido

// Crear un proyecto
router.post('/', async (req, res) => {
  const { nombre_proyecto, descripcion, id_usuario_creador, habilidades } = req.body;

  if (!nombre_proyecto || !id_usuario_creador) {
    return res.status(400).json({ error: 'El nombre del proyecto y el usuario creador son obligatorios.' });
  }

  try {
    const [result] = await db.promise().query(
      `INSERT INTO proyectos (nombre_proyecto, descripcion, id_usuario_creador) VALUES (?, ?, ?)`,
      [nombre_proyecto, descripcion || null, id_usuario_creador]
    );

    const id_proyecto = result.insertId;

    if (habilidades && habilidades.length > 0) {
      const values = habilidades.map((id_habilidad) => [id_proyecto, id_habilidad]);
      await db.promise().query(
        `INSERT INTO proyecto_habilidades (id_proyecto, id_habilidad) VALUES ?`,
        [values]
      );
    }

    res.status(201).json({ message: 'Proyecto creado con éxito.', id_proyecto });
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    res.status(500).json({ error: 'Error al crear el proyecto.' });
  }
});

// Obtener proyectos del usuario
router.get('/:id_usuario', async (req, res) => {
  const id_usuario = req.params.id_usuario;

  try {
    const [proyectos] = await db.promise().query(
      `SELECT p.id_proyecto, p.nombre_proyecto, p.descripcion 
       FROM proyectos p
       WHERE p.id_usuario_creador = ?`,
      [id_usuario]
    );

    for (const proyecto of proyectos) {
      const [habilidades] = await db.promise().query(
        `SELECT h.id_habilidad, h.nombre_habilidad 
         FROM proyecto_habilidades ph
         JOIN habilidades h ON ph.id_habilidad = h.id_habilidad
         WHERE ph.id_proyecto = ?`,
        [proyecto.id_proyecto]
      );
      proyecto.habilidades = habilidades;
    }

    res.status(200).json(proyectos);
  } catch (error) {
    console.error('Error al obtener los proyectos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener los proyectos del usuario.' });
  }
});

// Editar un proyecto
router.put('/:id', async (req, res) => {
  const id_proyecto = req.params.id;
  const { nombre_proyecto, descripcion, habilidades } = req.body;

  try {
    await db.promise().query(
      `UPDATE proyectos 
       SET nombre_proyecto = ?, descripcion = ? 
       WHERE id_proyecto = ?`,
      [nombre_proyecto, descripcion || null, id_proyecto]
    );

    await db.promise().query(
      `DELETE FROM proyecto_habilidades WHERE id_proyecto = ?`,
      [id_proyecto]
    );

    if (habilidades && habilidades.length > 0) {
      const values = habilidades.map((id_habilidad) => [id_proyecto, id_habilidad]);
      await db.promise().query(
        `INSERT INTO proyecto_habilidades (id_proyecto, id_habilidad) VALUES ?`,
        [values]
      );
    }

    res.status(200).json({ message: 'Proyecto actualizado con éxito.' });
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    res.status(500).json({ error: 'Error al actualizar el proyecto.' });
  }
});

// Eliminar un proyecto
router.delete('/:id', async (req, res) => {
  const id_proyecto = req.params.id;

  try {
    await db.promise().query(
      `DELETE FROM proyecto_habilidades WHERE id_proyecto = ?`,
      [id_proyecto]
    );

    await db.promise().query(
      `DELETE FROM proyectos WHERE id_proyecto = ?`,
      [id_proyecto]
    );

    res.status(200).json({ message: 'Proyecto eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
    res.status(500).json({ error: 'Error al eliminar el proyecto.' });
  }
});

// Reutilizar el endpoint de habilidades desde usuarios
router.get('/habilidades', async (req, res) => {
  try {
    const [habilidades] = await obtenerHabilidades();
    res.status(200).json(habilidades);
  } catch (error) {
    console.error('Error al obtener habilidades:', error);
    res.status(500).json({ error: 'Error al obtener las habilidades.' });
  }
});

// Obtener todos los proyectos
router.get('/', async (req, res) => {
  try {
    // Consulta para obtener los proyectos
    const [proyectos] = await db.promise().query(
      `SELECT 
         p.id_proyecto, 
         p.nombre_proyecto, 
         IFNULL(p.descripcion, 'Sin descripción') AS descripcion, 
         u.nombre AS creador
       FROM proyectos p
       LEFT JOIN usuarios u ON p.id_usuario_creador = u.id_usuario`
    );

    // Agregar habilidades a cada proyecto
    for (const proyecto of proyectos) {
      const [habilidades] = await db.promise().query(
        `SELECT h.id_habilidad, h.nombre_habilidad
         FROM proyecto_habilidades ph
         JOIN habilidades h ON ph.id_habilidad = h.id_habilidad
         WHERE ph.id_proyecto = ?`,
        [proyecto.id_proyecto]
      );
      proyecto.habilidades = habilidades;
    }

    res.status(200).json(proyectos);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ error: 'Error al obtener proyectos.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener detalles del proyecto
    const [proyectos] = await db.promise().query(
      `SELECT id_proyecto, nombre_proyecto, descripcion 
       FROM proyectos
       WHERE id_proyecto = ?`,
      [id]
    );

    if (proyectos.length === 0) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    const proyecto = proyectos[0];

    // Obtener habilidades del proyecto
    const [habilidades] = await db.promise().query(
      `SELECT h.id_habilidad, h.nombre_habilidad
       FROM proyecto_habilidades ph
       JOIN habilidades h ON ph.id_habilidad = h.id_habilidad
       WHERE ph.id_proyecto = ?`,
      [id]
    );

    // Obtener integrantes
    const [integrantes] = await db.promise().query(
      `SELECT u.id_usuario, u.nombre, u.carrera, u.descripcion
       FROM proyecto_integrantes pi
       JOIN usuarios u ON pi.id_usuario = u.id_usuario
       WHERE pi.id_proyecto = ?`,
      [id]
    );

    proyecto.habilidades = habilidades;
    proyecto.integrantes = integrantes;
    proyecto.imagenes = []; // Opcional: agrega lógica para imágenes si las tienes

    res.status(200).json(proyecto);
  } catch (error) {
    console.error('Error al obtener detalles del proyecto:', error);
    res.status(500).json({ error: 'Error al obtener detalles del proyecto.' });
  }
});

module.exports = router;