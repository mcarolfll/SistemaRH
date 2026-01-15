require('dotenv').config();
const express = require('express');
const cors = require('cors');
const candidatoRoutes = require('./routes/candidatos'); // Changed to new path
const empresaRoutes = require('./routes/empresas'); // Changed to new path

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rotas
app.use('/api/candidatos', candidatoRoutes);
app.use('/api/empresas', empresaRoutes);

// Rota base
app.get('/', (req, res) => {
    res.send('API do Sistema de RH rodando!');
});

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado no servidor!' });
});

// Iniciar servidor apenas se executado diretamente
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;
