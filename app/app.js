import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function connectWithRetry() {
    let connected = false;
    while (!connected) {
        try {
            const connection = await mysql.createConnection({
                host: 'databaseA',
                user: 'root',
                password: 'root',
                database: 'proyecto'
            });
            console.log('Conexión exitosa a la base de datos MySQL');
            return connection;
        } catch (err) {
            console.error('Error al conectar a la base de datos. Reintentando en 5 segundos...', err);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

async function startServer() {
    const connection = await connectWithRetry();

    app.use(express.static(path.join(__dirname, 'views')));

    app.get('/', (req, res) => {
        res.redirect('/auth');
    });

    app.get('/auth', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'auth', 'auth.html'));
    });

    app.get('/catalog', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'catalog', 'catalog.html'));
    });

    app.get('/form', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'form', 'form.html'));
    });

    app.get('/databaseusers', async (req, res) => {
        try {
            const [rows] = await connection.query('SELECT * FROM usuarios');
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener los datos de la base de datos:', error);
            res.status(500).send('Error al obtener los datos de la base de datos');
        }
    });

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
    });
}

startServer().catch(err => {
    console.error('Error al iniciar el servidor:', err);
});