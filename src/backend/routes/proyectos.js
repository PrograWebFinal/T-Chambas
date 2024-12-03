const express = require('express');
const router = express.Router();
const db = require('../db'); 
const { obtenerHabilidades } = require('../services/habilidades'); 


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

router.get('/:id/colaboradores', async (req, res) => {
  const id_proyecto = req.params.id;

  try {
    const [colaboradores] = await db.promise().query(
      `SELECT u.id_usuario, u.nombre, u.correo
       FROM colaboradores c
       JOIN usuarios u ON c.id_usuario = u.id_usuario
       WHERE c.id_proyecto = ?`,
      [id_proyecto]
    );

    for (const colaborador of colaboradores) {
      const [habilidades] = await db.promise().query(
        `SELECT h.nombre_habilidad 
         FROM usuario_habilidades uh
         JOIN habilidades h ON uh.id_habilidad = h.id_habilidad
         WHERE uh.id_usuario = ?`,
        [colaborador.id_usuario]
      );
      colaborador.habilidades = habilidades.map((h) => h.nombre_habilidad);
    }

    res.status(200).json(colaboradores);
  } catch (error) {
    console.error('Error al obtener colaboradores:', error);
    res.status(500).json({ error: 'Error al obtener colaboradores.' });
  }
});

router.delete('/:id/colaboradores/:id_usuario', async (req, res) => {
  const { id, id_usuario } = req.params;

  try {
    await db.promise().query(
      `DELETE FROM colaboradores WHERE id_proyecto = ? AND id_usuario = ?`,
      [id, id_usuario]
    );

    res.status(200).json({ message: 'Colaborador eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar colaborador:', error);
    res.status(500).json({ error: 'Error al eliminar colaborador.' });
  }
});

// Obtener información del dueño del proyecto
router.get('/:id/jefe', async (req, res) => {
  const id_proyecto = req.params.id;

  try {
    const [result] = await db.promise().query(
      `SELECT 
         u.nombre, 
         u.correo, 
         c.nombre_carrera AS carrera
       FROM proyectos p
       JOIN usuarios u ON p.id_usuario_creador = u.id_usuario
       LEFT JOIN carreras c ON u.id_carrera = c.id_carrera
       WHERE p.id_proyecto = ?`,
      [id_proyecto]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado o sin dueño asociado.' });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error al obtener el dueño del proyecto:', error);
    res.status(500).json({ error: 'Error al obtener el dueño del proyecto.' });
  }
});


// Obtener los proyectos en los que colaboras 
router.get('/colaboradores/:id_usuario', async (req, res) => {
  const id_usuario = req.params.id_usuario;

  try {
    const [proyectos] = await db.promise().query(
      `SELECT p.id_proyecto, p.nombre_proyecto, p.descripcion
       FROM colaboradores c
       JOIN proyectos p ON c.id_proyecto = p.id_proyecto
       WHERE c.id_usuario = ?`,
      [id_usuario]
    );

    for (const proyecto of proyectos) {
      const [habilidades] = await db.promise().query(
        `SELECT h.nombre_habilidad
         FROM proyecto_habilidades ph
         JOIN habilidades h ON ph.id_habilidad = h.id_habilidad
         WHERE ph.id_proyecto = ?`,
        [proyecto.id_proyecto]
      );
      proyecto.habilidades = habilidades.map((h) => h.nombre_habilidad);
    }

    res.status(200).json(proyectos);
  } catch (error) {
    console.error('Error al obtener proyectos en los que colaboras:', error);
    res.status(500).json({ error: 'Error al obtener proyectos en los que colaboras.' });
  }
});

// Obtener Colaboradores de un Proyecto
router.get('/proyectos/:id_proyecto/colaboradores', async (req, res) => {
  const id_proyecto = req.params.id_proyecto;

  try {
    const [colaboradores] = await db.promise().query(
      `SELECT u.id_usuario, u.nombre, u.correo
       FROM colaboradores c
       JOIN usuarios u ON c.id_usuario = u.id_usuario
       WHERE c.id_proyecto = ?`,
      [id_proyecto]
    );

    for (const colaborador of colaboradores) {
      const [habilidades] = await db.promise().query(
        `SELECT h.nombre_habilidad
         FROM usuario_habilidades uh
         JOIN habilidades h ON uh.id_habilidad = h.id_habilidad
         WHERE uh.id_usuario = ?`,
        [colaborador.id_usuario]
      );
      colaborador.habilidades = habilidades.map((h) => h.nombre_habilidad);
    }

    res.status(200).json(colaboradores);
  } catch (error) {
    console.error('Error al obtener colaboradores del proyecto:', error);
    res.status(500).json({ error: 'Error al obtener colaboradores del proyecto.' });
  }
});

// Invitar a un usuario a un proyecto
router.post("/:id_proyecto/invitar", async (req, res) => {
  const id_proyecto = req.params.id_proyecto;
  const { id_usuario } = req.body;

  if (!id_usuario) {
    return res.status(400).json({ error: "El ID del usuario es obligatorio." });
  }

  try {
    const [colaboradores] = await db.promise().query(
      `SELECT * FROM colaboradores WHERE id_proyecto = ? AND id_usuario = ?`,
      [id_proyecto, id_usuario]
    );

    if (colaboradores.length > 0) {
      return res
        .status(400)
        .json({ error: "El usuario ya es colaborador de este proyecto." });
    }

    await db.promise().query(
      `INSERT INTO colaboradores (id_proyecto, id_usuario) VALUES (?, ?)`,
      [id_proyecto, id_usuario]
    );

    res.status(200).json({ message: "Usuario invitado al proyecto con éxito." });
  } catch (error) {
    console.error("Error al invitar al usuario al proyecto:", error);
    res.status(500).json({ error: "Error al invitar al usuario al proyecto." });
  }
});

router.delete('/colaboradores/:id_proyecto/:id_usuario', async (req, res) => {
  const { id_proyecto, id_usuario } = req.params;

  try {
    await db.promise().query(
      `DELETE FROM colaboradores
       WHERE id_proyecto = ? AND id_usuario = ?`,
      [id_proyecto, id_usuario]
    );

    res.status(200).json({ message: 'Te has salido del proyecto con éxito.' });
  } catch (error) {
    console.error('Error al salir del proyecto:', error);
    res.status(500).json({ error: 'Error al salir del proyecto.' });
  }
});

router.get('/habilidades', async (req, res) => {
  try {
    const [habilidades] = await obtenerHabilidades();
    res.status(200).json(habilidades);
  } catch (error) {
    console.error('Error al obtener habilidades:', error);
    res.status(500).json({ error: 'Error al obtener las habilidades.' });
  }
});

// Obtener proyectos
// Obtener todos los proyectos excluyendo los del usuario actual y los que ya colabora
router.get("/", async (req, res) => {
  try {
    const usuarioActualId = req.query.userId;

    if (!usuarioActualId) {
      return res.status(400).json({ error: "El ID del usuario es requerido." });
    }

    const [proyectos] = await db.promise().query(
      `SELECT 
         p.id_proyecto, 
         p.nombre_proyecto, 
         IFNULL(p.descripcion, 'Sin descripción') AS descripcion
       FROM proyectos p
       WHERE p.id_usuario_creador != ?
         AND p.id_proyecto NOT IN (
           SELECT c.id_proyecto
           FROM colaboradores c
           WHERE c.id_usuario = ?
         )`,
      [usuarioActualId, usuarioActualId]
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
    console.error("Error al obtener proyectos:", error);
    res.status(500).json({ error: "Error al obtener proyectos." });
  }
});



// Obtener proyectos en los que el usuario ya está colaborando
router.get("/colaborando/:userId", async (req, res) => {
  try {
    const usuarioActualId = req.params.userId; 
    if (!usuarioActualId) {
      return res.status(400).json({ error: "El ID del usuario es requerido." });
    }

    const [proyectos] = await db.promise().query(
      `SELECT 
         p.id_proyecto, 
         p.nombre_proyecto, 
         IFNULL(p.descripcion, 'Sin descripción') AS descripcion
       FROM proyectos p
       JOIN colaboradores c ON p.id_proyecto = c.id_proyecto
       WHERE c.id_usuario = ?`,
      [usuarioActualId]
    );

    res.status(200).json(proyectos);
  } catch (error) {
    console.error("Error al obtener proyectos en los que colaboras:", error);
    res.status(500).json({ error: "Error al obtener proyectos en los que colaboras." });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params; 
  try {
    const [proyecto] = await db.promise().query(
      `SELECT 
         p.id_proyecto, 
         p.nombre_proyecto, 
         p.descripcion, 
         u.nombre AS creador_nombre, 
         u.apellidos AS creador_apellidos
       FROM proyectos p
       JOIN usuarios u ON p.id_usuario_creador = u.id_usuario
       WHERE p.id_proyecto = ?`,
      [id]
    );
    if (proyecto.length === 0) {
      return res.status(404).json({ error: "Proyecto no encontrado." });
    }
    const [colaboradores] = await db.promise().query(
      `SELECT 
         u.id_usuario, 
         u.nombre, 
         u.apellidos, 
         u.descripcion 
       FROM colaboradores c
       JOIN usuarios u ON c.id_usuario = u.id_usuario
       WHERE c.id_proyecto = ?`,
      [id]
    );

    res.status(200).json({
      ...proyecto[0],
      colaboradores,
    });
  } catch (error) {
    console.error("Error al obtener los detalles del proyecto:", error);
    res.status(500).json({ error: "Error interno al obtener los detalles del proyecto." });
  }
});

router.post("/:id/unirse", async (req, res) => {
  const { id } = req.params; 
  const { userId } = req.body; 

  try {
    
    const [existe] = await db.promise().query(
      `SELECT 1 FROM colaboradores WHERE id_usuario = ? AND id_proyecto = ?`,
      [userId, id]
    );

    if (existe.length > 0) {
      return res.status(400).json({ error: "El usuario ya es colaborador de este proyecto." });
    }

    
    await db.promise().query(
      `INSERT INTO colaboradores (id_usuario, id_proyecto) VALUES (?, ?)`,
      [userId, id]
    );

    res.status(200).json({ message: "Te has unido exitosamente al proyecto." });
  } catch (error) {
    console.error("Error al unirse al proyecto:", error);
    res.status(500).json({ error: "Error interno al unirse al proyecto." });
  }
});


module.exports = router;