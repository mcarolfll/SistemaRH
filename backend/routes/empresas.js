const express = require('express');
const router = express.Router();
const { readData, saveData } = require('../database/dataStore');

// GET /empresas
router.get('/', (req, res) => {
    const data = readData();
    res.json(data.empresas);
});

// POST /empresas
router.post('/', (req, res) => {
    const { nome, cnpj, email, telefone } = req.body;

    if (!nome || !cnpj || !email) {
        return res.status(400).json({ error: 'Nome, CNPJ e Email são obrigatórios.' });
    }

    const data = readData();
    
    // Validar CNPJ único
    if (data.empresas.some(e => e.cnpj === cnpj)) {
        return res.status(400).json({ error: 'CNPJ já cadastrado.' });
    }

    const novaEmpresa = {
        id: Date.now(),
        nome,
        cnpj,
        email,
        telefone: telefone || '',
        vagas_disponiveis: 0
    };

    data.empresas.push(novaEmpresa);
    saveData(data);

    res.status(201).json(novaEmpresa);
});

// PUT /empresas/:id
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, cnpj, email, telefone, vagas_disponiveis } = req.body;
    const data = readData();
    
    const index = data.empresas.findIndex(e => e.id == id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Empresa não encontrada.' });
    }

    // Validar CNPJ único se mudou
    if (cnpj && cnpj !== data.empresas[index].cnpj) {
        if (data.empresas.some(e => e.cnpj === cnpj)) {
            return res.status(400).json({ error: 'CNPJ já cadastrado.' });
        }
    }

    data.empresas[index] = {
        ...data.empresas[index],
        nome: nome || data.empresas[index].nome,
        cnpj: cnpj || data.empresas[index].cnpj,
        email: email || data.empresas[index].email,
        telefone: telefone || data.empresas[index].telefone,
        vagas_disponiveis: vagas_disponiveis !== undefined ? vagas_disponiveis : data.empresas[index].vagas_disponiveis
    };

    saveData(data);
    res.json(data.empresas[index]);
});

// DELETE /empresas/:id
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();
    
    const filtered = data.empresas.filter(e => e.id != id);
    
    if (data.empresas.length === filtered.length) {
        return res.status(404).json({ error: 'Empresa não encontrada.' });
    }

    data.empresas = filtered;
    saveData(data);
    
    res.json({ message: 'Empresa excluída com sucesso.' });
});

module.exports = router;
