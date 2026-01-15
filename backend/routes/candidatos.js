const express = require('express');
const router = express.Router();
const { readData, saveData } = require('../database/dataStore');

// GET /candidatos
router.get('/', (req, res) => {
    const data = readData();
    res.json(data.candidatos);
});

// POST /candidatos
router.post('/', (req, res) => {
    const { nome, email, telefone, cargo_desejado } = req.body;

    if (!nome || !email || !cargo_desejado) {
        return res.status(400).json({ error: 'Nome, Email e Cargo desejado são obrigatórios.' });
    }

    const data = readData();
    
    // Validar email único
    if (data.candidatos.some(c => c.email === email)) {
        return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    const novoCandidato = {
        id: Date.now(),
        nome,
        email,
        telefone: telefone || '',
        cargo_desejado,
        status: 'Em análise'
    };

    data.candidatos.push(novoCandidato);
    saveData(data);

    res.status(201).json(novoCandidato);
});

// PUT /candidatos/:id
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, cargo_desejado, status } = req.body;
    const data = readData();
    
    const index = data.candidatos.findIndex(c => c.id == id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Candidato não encontrado.' });
    }

    // Validar email único se mudou
    if (email && email !== data.candidatos[index].email) {
         if (data.candidatos.some(c => c.email === email)) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }
    }

    data.candidatos[index] = {
        ...data.candidatos[index],
        nome: nome || data.candidatos[index].nome,
        email: email || data.candidatos[index].email,
        telefone: telefone || data.candidatos[index].telefone,
        cargo_desejado: cargo_desejado || data.candidatos[index].cargo_desejado,
        status: status || data.candidatos[index].status
    };

    saveData(data);
    res.json(data.candidatos[index]);
});

// DELETE /candidatos/:id
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();
    
    const filtered = data.candidatos.filter(c => c.id != id);
    
    if (data.candidatos.length === filtered.length) {
        return res.status(404).json({ error: 'Candidato não encontrado.' });
    }

    data.candidatos = filtered;
    saveData(data);
    
    res.json({ message: 'Candidato excluído com sucesso.' });
});

module.exports = router;
