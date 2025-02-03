import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';  // Agregar dotenv

dotenv.config();  // Cargar las variables de entorno desde el archivo .env

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'views', '404', '404.html'));
});

const PORT = process.env.PORT || 3000;  // Aquí se usa la variable de entorno PORT

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
