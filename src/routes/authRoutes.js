const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.status(201).json({ message: "Usuario creado con éxito" });
    } catch (err) {
        res.status(400).json({ message: "El correo ya está registrado o hay un error en los datos" });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ message: 'Credenciales inválidas' });

        const validPass = await bcrypt.compare(password, rows[0].password);
        if (!validPass) return res.status(401).json({ message: 'Credenciales inválidas' });

        const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, userId: rows[0].id });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;