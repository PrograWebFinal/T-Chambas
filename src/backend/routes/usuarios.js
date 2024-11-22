const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); // Conexión a la base de datos
const router = express.Router();

// **Registro de usuario**
router.post('/registro', async (req, res) => {
  const { nombre, apellidos, correo, contraseña, id_carrera, descripcion } = req.body;

  // Validar campos obligatorios
  if (!nombre || !apellidos || !correo || !contraseña) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Verificar si el correo ya está registrado
    const [userExists] = await db.promise().query('SELECT id_usuario FROM usuarios WHERE correo = ?', [correo]);
    if (userExists.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar nuevo usuario
    const [result] = await db.promise().query(
      'INSERT INTO usuarios (nombre, apellidos, correo, contraseña, id_carrera, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellidos, correo, hashedPassword, id_carrera || null, descripcion || null]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente.', id: result.insertId });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
});

// **Login de usuario**
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  // Validar campos obligatorios
  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
  }

  try {
    // Buscar usuario por correo
    const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const user = rows[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellidos: user.apellidos,
        correo: user.correo,
        id_carrera: user.id_carrera,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
});

// Obtener todas las carreras
router.get('/carreras', async (req, res) => {
  try {
    const [carreras] = await db.promise().query('SELECT id_carrera, nombre_carrera FROM carreras');
    res.status(200).json(carreras);
  } catch (error) {
    console.error('Error al obtener las carreras:', error);
    res.status(500).json({ error: 'Error al obtener las carreras.' });
  }
});

router.get('/perfil/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const [user] = await db.promise().query(
      `SELECT u.id_usuario, u.nombre, u.apellidos, u.correo, u.descripcion, 
              c.nombre_carrera 
       FROM usuarios u 
       LEFT JOIN carreras c ON u.id_carrera = c.id_carrera 
       WHERE u.id_usuario = ?`,
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json(user[0]);
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    res.status(500).json({ error: 'Error al obtener el perfil del usuario.' });
  }
});

router.get('/habilidades', async (req, res) => {
  try {
    const [habilidades] = await db.promise().query(
      `SELECT h.id_habilidad, h.nombre_habilidad, c.nombre_carrera 
       FROM habilidades h 
       LEFT JOIN carreras c ON h.id_carrera = c.id_carrera`
    );

    res.status(200).json(habilidades);
  } catch (error) {
    console.error('Error al obtener habilidades:', error);
    res.status(500).json({ error: 'Error al obtener habilidades.' });
  }
});

router.get('/perfil/:id/habilidades', async (req, res) => {
  const userId = req.params.id;

  try {
    const [habilidadesUsuario] = await db.promise().query(
      `SELECT h.id_habilidad, h.nombre_habilidad 
       FROM usuario_habilidades uh 
       JOIN habilidades h ON uh.id_habilidad = h.id_habilidad 
       WHERE uh.id_usuario = ?`,
      [userId]
    );

    res.status(200).json(habilidadesUsuario);
  } catch (error) {
    console.error('Error al obtener las habilidades del usuario:', error);
    res.status(500).json({ error: 'Error al obtener las habilidades del usuario.' });
  }
});

router.put('/perfil/:id/habilidades', async (req, res) => {
  const userId = req.params.id;
  const { habilidades } = req.body; // Array de IDs de habilidades

  try {
    // Inicia una transacción
    await db.promise().beginTransaction();

    // Elimina habilidades actuales
    await db.promise().query(
      `DELETE FROM usuario_habilidades WHERE id_usuario = ?`,
      [userId]
    );

    // Inserta las nuevas habilidades
    if (habilidades && habilidades.length > 0) {
      const values = habilidades.map((idHabilidad) => [userId, idHabilidad]);
      await db.promise().query(
        `INSERT INTO usuario_habilidades (id_usuario, id_habilidad) VALUES ?`,
        [values]
      );
    }

    // Confirma la transacción
    await db.promise().commit();

    res.status(200).json({ message: 'Habilidades actualizadas correctamente.' });
  } catch (error) {
    await db.promise().rollback();
    console.error('Error al actualizar habilidades del usuario:', error);
    res.status(500).json({ error: 'Error al actualizar habilidades del usuario.' });
  }
});

router.put('/perfil/:id/descripcion', async (req, res) => {
  const userId = req.params.id;
  const { descripcion } = req.body; // La nueva descripción proporcionada por el usuario

  try {
    // Actualizar la descripción en la base de datos
    const [result] = await db.promise().query(
      `UPDATE usuarios SET descripcion = ? WHERE id_usuario = ?`,
      [descripcion, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json({ message: 'Descripción actualizada con éxito.' });
  } catch (error) {
    console.error('Error al actualizar la descripción del usuario:', error);
    res.status(500).json({ error: 'Error al actualizar la descripción del usuario.' });
  }
});

// Obtener todos los usuarios con sus habilidades y proyectos
router.get('/', async (req, res) => {
  try {
    // Obtener información básica de los usuarios
    const [usuarios] = await db.promise().query(
      `SELECT 
         u.id_usuario, 
         u.nombre, 
         u.apellidos, 
         NULL AS foto, -- Foto no está en la tabla, ajusta si es necesario
         IFNULL(c.nombre_carrera, 'No especificado') AS carrera, 
         IFNULL(u.descripcion, 'Sin descripción') AS descripcion
       FROM usuarios u
       LEFT JOIN carreras c ON u.id_carrera = c.id_carrera`
    );

    // Iterar sobre cada usuario para agregar habilidades y proyectos
    for (const usuario of usuarios) {
      // Obtener habilidades del usuario
      const [habilidades] = await db.promise().query(
        `SELECT h.nombre_habilidad 
         FROM usuario_habilidades uh
         JOIN habilidades h ON uh.id_habilidad = h.id_habilidad
         WHERE uh.id_usuario = ?`,
        [usuario.id_usuario]
      );

      // Obtener proyectos del usuario
      const [proyectos] = await db.promise().query(
        `SELECT p.nombre_proyecto 
         FROM proyectos p
         WHERE p.id_usuario_creador = ?`,
        [usuario.id_usuario]
      );

      // Agregar habilidades y proyectos al usuario
      usuario.habilidades = habilidades || [];
      usuario.proyectos = proyectos.length > 0 ? proyectos.map((p) => p.nombre_proyecto) : [];
    }

    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno al obtener usuarios.' });
  }
});

module.exports = router;
