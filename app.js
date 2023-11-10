const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const mongoose = require('mongoose');
const axios = require('axios');
const config = require('./config');
const Chiste = require('./models/Chiste');
const { calcularMCM } = require("./helpers");

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Conexión a la base de datos MongoDB
mongoose.connect(config.mongoURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB'));
db.once('open', () => {
    console.log('Conexión a MongoDB establecida');
});

// Endpoint para obtener chistes aleatorios o específicos
/**
 * @swagger
 * components:
 *   schemas:
 *     Chiste:
 *       type: object
 *       properties:
 *         texto:
 *           type: string
 *           description: Texto del chiste.
 *           example: "Este es un chiste de ejemplo."
 *         number:
 *           type: integer
 *           description: Número de identificación único del chiste.
 *           example: 1
 */

/**
 * @swagger
 * tags:
 *   name: Chistes
 *   description: Endpoints relacionados con chistes
 */

/**
 * @swagger
 * /chistes:
 *   get:
 *     summary: Obtiene chistes aleatorios o específicos.
 *     description: Retorna un chiste aleatorio o específico según el tipo especificado.
 *     parameters:
 *       - in: query
 *         name: tipo
 *         description: Tipo de chiste ("Chuck" o "Dad").
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Chiste obtenido con éxito.
 *         content:
 *           application/json:
 *             example:
 *               chiste: "Chuck Norris Joke"
 */

app.get('/chistes', async (req, res) => {
    try {
        // Obtén el valor del parámetro "tipo" de la solicitud
        const tipo = req.query.tipo;

        let chiste;

        if (!tipo) {
            // No se especificó un tipo, obtener chiste aleatorio entre las dos fuentes
            const randomSource = Math.random() < 0.5 ? 'Chuck' : 'Dad';
            if (randomSource === 'Chuck') {
                const chuckResponse = await axios.get('https://api.chucknorris.io/jokes/random');
                chiste = chuckResponse.data.value;
            } else {
                const dadResponse = await axios.get('https://icanhazdadjoke.com/', {
                    headers: { 'Accept': 'application/json' }
                });
                chiste = dadResponse.data.joke;
            }
        } else if (tipo === 'Chuck') {
            // Obtén chiste de Chuck Norris
            const chuckResponse = await axios.get('https://api.chucknorris.io/jokes/random');
            chiste = chuckResponse.data.value;
        } else if (tipo === 'Dad') {
            // Obtén chiste de Dad Joke
            const dadResponse = await axios.get('https://icanhazdadjoke.com/', {
                headers: { 'Accept': 'application/json' }
            });
            chiste = dadResponse.data.joke;
        } else {
            return res.status(400).json({ error: 'Tipo de chiste no válido. Debe ser "Chuck" o "Dad".' });
        }

        res.json({ chiste });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al obtener el chiste.' });
    }
});

// Endpoint para guardar un chiste en la base de datos
/**
 * @swagger
 * /chistes:
 *   post:
 *     summary: Guarda un nuevo chiste en la base de datos.
 *     description: Guarda un nuevo chiste en la base de datos con el texto proporcionado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texto:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chiste guardado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chiste'
 */
app.post('/chistes', async (req, res) => {
    try {
        const texto = req.body.texto;

        if (!texto) {
            return res.status(400).json({ error: 'El campo "texto" es obligatorio.' });
        }

        // Usamos el nuevo método estático para guardar un chiste
        const nuevoChiste = await Chiste.guardarChiste(texto);

        res.status(201).json({ mensaje: 'Chiste guardado con éxito', chiste: nuevoChiste });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocurrió un error al guardar el chiste.' });
    }
});


// Endpoint para actualizar un chiste en la base de datos por su número de identificación
/**
 * @swagger
 * /chistes/{number}:
 *   put:
 *     summary: Actualiza un chiste en la base de datos por su número de identificación.
 *     description: Actualiza un chiste en la base de datos por su número de identificación con el nuevo texto proporcionado.
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         description: Número de identificación del chiste.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texto:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chiste actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chiste'
 */

app.put('/chistes/:number', async (req, res) => {
    try {
        const numeroChiste = req.params.number;
        const nuevoTexto = req.body.texto; // Nuevo texto del chiste

        if (!nuevoTexto) {
            return res.status(400).json({ error: 'El campo "texto" es obligatorio para la actualización.' });
        }

        // Busca el chiste por su número de identificación
        const chiste = await Chiste.findOne({ numero: numeroChiste });

        if (!chiste) {
            return res.status(404).json({ error: 'Chiste no encontrado.' });
        }

        // Actualiza el texto del chiste
        chiste.texto = nuevoTexto;

        // Guarda los cambios en la base de datos
        await chiste.save();

        res.json({ mensaje: 'Chiste actualizado con éxito', chiste });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al actualizar el chiste.' });
    }
});


// Endpoint para eliminar un chiste de la base de datos por su número de identificación
/**
 * @swagger
 * /chistes/{number}:
 *   delete:
 *     summary: Elimina un chiste de la base de datos por su número de identificación.
 *     description: Elimina un chiste de la base de datos por su número de identificación.
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         description: Número de identificación del chiste.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chiste eliminado con éxito.
 */
app.delete('/chistes/:number', async (req, res) => {
    try {
        const numeroChiste = req.params.number;

        // Busca y elimina el chiste por su número de identificación
        const resultado = await Chiste.deleteOne({ numero: numeroChiste });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: 'Chiste no encontrado.' });
        }

        res.json({ mensaje: 'Chiste eliminado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al eliminar el chiste.' });
    }
});


// Endpoint matemático


// Endpoint para calcular el MCM de una lista de números
/**
 * @swagger
 * /lcm:
 *   get:
 *     summary: Calcula el MCM de una lista de números.
 *     description: Calcula el MCM (Mínimo Común Múltiplo) de una lista de números proporcionada en la solicitud.
 *     parameters:
 *       - in: query
 *         name: numbers
 *         required: true
 *         description: Lista de números para calcular el MCM.
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *     responses:
 *       200:
 *         description: MCM calculado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               mcm: 24
 */
app.get('/lcm', (req, res) => {
    try {
        const numbers = req.query.numbers;

        if (!numbers || !Array.isArray(numbers) || numbers.length < 2) {
            return res.status(400).json({ error: 'Se requiere una lista de al menos 2 números para calcular el MCM.' });
        }

        // Inicializa el MCM con el primer número
        let mcm = parseInt(numbers[0]);

        // Calcula el MCM de la lista de números
        for (let i = 1; i < numbers.length; i++) {
            mcm = calcularMCM(mcm, parseInt(numbers[i]));
        }

        res.json({ mcm });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al calcular el MCM.' });
    }
});


// Endpoint para incrementar un número en 1
/**
 * @swagger
 * /increment:
 *   get:
 *     summary: Incrementa un número en 1.
 *     description: Incrementa un número proporcionado en la solicitud en 1.
 *     parameters:
 *       - in: query
 *         name: number
 *         required: true
 *         description: Número para incrementar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Número incrementado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               numeroIncrementado: 6
 */

app.get('/increment', (req, res) => {
    try {
        const number = req.query.number;

        if (!number) {
            return res.status(400).json({ error: 'Se requiere un número para incrementar.' });
        }

        const numeroIncrementado = parseInt(number) + 1;

        res.json({ numeroIncrementado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al incrementar el número.' });
    }
});


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

module.exports = { app, server }
