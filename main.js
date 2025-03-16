const express = require('express');
const mysql = require('mysql2'); 
const bodyParser = require('body-parser');
const path = require('path'); 

const app = express();
const port = 3001; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({ // Configuración de la conexión a MySQL
    host: 'localhost',  
    user: 'root',
    password: 'Danielmaster56',
    database: 'registro'
});

db.connect((err) => { // Conexión a la base de datos
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL. Thread ID:', db.threadId);
});

app.post('/registrar-entrada', (req, res) => { // Ruta para registrar una entrada
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const fechaEntrada = new Date();
    const query = 'INSERT INTO registros (nombre, fecha_entrada) VALUES (?, ?)';

    db.query(query, [nombre, fechaEntrada], (err, result) => {
        if (err) {
            console.error('Error al registrar la entrada:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.status(201).json({ mensaje: 'Entrada registrada', id: result.insertId });
    });
});

app.post('/registro/salida', (req, res) => { // Ruta para registrar una salida
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'El ID es obligatorio' });
    }

    const fechaSalida = new Date();
    const query = 'UPDATE registros SET fecha_salida = ? WHERE id = ?';

    db.query(query, [fechaSalida, id], (err, result) => {
        if (err) {
            console.error('Error al registrar la salida:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        res.status(200).json({ mensaje: 'Salida registrada' });
    });
});

app.get('/registros', (req, res) => { // Ruta para obtener todos los registros
    const query = 'SELECT * FROM registros';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los registros:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.status(200).json(results);
    });
});

app.listen(port, () => { // Iniciar el servidor
    console.log(`Servidor corriendo en http://localhost:${port}`);
});