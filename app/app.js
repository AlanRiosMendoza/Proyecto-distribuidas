import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.urlencoded({ extended: true }));

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

    app.use(express.static(path.join(__dirname, 'assets')));
    app.use('/assets', express.static(path.join(__dirname, 'assets')));
    app.use(express.static(path.join(__dirname, 'views')))

    app.get('/', (req, res) => {
        res.redirect('/auth');
    });

    app.get('/auth', (req, res) => {
        console.log('Peticion recibida');
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

    // Ruta para manejar el registro
    app.post('/register', async (req, res) => {
        const { txt, email, broj, pswd } = req.body;

        try {
            const [result] = await connection.query(
                'INSERT INTO usuarios (nombres, correo, celular, contrasenia) VALUES (?, ?, ?, ?)',
                [txt, email, broj, pswd]
            );
            console.log('Usuario registrado:', result);
            res.sendFile(path.join(__dirname, 'views', 'auth', 'auth.html'));
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).send('Error al registrar usuario');
        }
    });

    // Ruta para manejar el inicio de sesión
    app.post('/login', async (req, res) => {
        const { email, pswd } = req.body;

        try {
            const [rows] = await connection.query(
                'SELECT * FROM usuarios WHERE correo = ? AND contrasenia = ?',
                [email, pswd]
            );

            if (rows.length > 0) {
                console.log('Inicio de sesión exitoso:', rows[0]);
                res.sendFile(path.join(__dirname, 'views', 'catalog', 'catalog.html'));
            } else {
                res.status(401).send('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).send('Error al iniciar sesión');
        }
    });

    app.post('/register-product', async (req, res) => {
        const { productName, productDescription, productImage, productPrice } = req.body;

        try {
            const [result] = await connection.query(
                'INSERT INTO productos (nombre, descripcion, imagen, precio) VALUES (?, ?, ?, ?)',
                [productName, productDescription, productImage, productPrice]
            );
            console.log('Producto registrado:', result);
            res.sendFile(path.join(__dirname, 'views', 'catalog', 'catalog.html'));
        } catch (error) {
            console.error('Error al registrar el producto:', error);
            res.status(500).send('Error al registrar el producto');
        }
    });
}

startServer().catch(err => {
    console.error('Error al iniciar el servidor:', err);
});