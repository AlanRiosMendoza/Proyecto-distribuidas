import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
