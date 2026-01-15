const { readData, saveData } = require('../../backend/database/dataStore');

function sendJson(res, statusCode, payload) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';

        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            if (!data) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(data));
            } catch (error) {
                reject(error);
            }
        });

        req.on('error', reject);
    });
}

module.exports = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        sendJson(res, 400, { error: 'ID da empresa é obrigatório.' });
        return;
    }

    if (req.method === 'PUT') {
        try {
            const body = await parseBody(req);
            const { nome, cnpj, email, telefone, vagas_disponiveis } = body;
            const data = readData();

            const index = data.empresas.findIndex(e => e.id == id);

            if (index === -1) {
                sendJson(res, 404, { error: 'Empresa não encontrada.' });
                return;
            }

            if (cnpj && cnpj !== data.empresas[index].cnpj) {
                if (data.empresas.some(e => e.cnpj === cnpj)) {
                    sendJson(res, 400, { error: 'CNPJ já cadastrado.' });
                    return;
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
            sendJson(res, 200, data.empresas[index]);
            return;
        } catch (error) {
            sendJson(res, 500, { error: 'Erro ao atualizar empresa.' });
            return;
        }
    }

    if (req.method === 'DELETE') {
        const data = readData();
        const filtered = data.empresas.filter(e => e.id != id);

        if (data.empresas.length === filtered.length) {
            sendJson(res, 404, { error: 'Empresa não encontrada.' });
            return;
        }

        data.empresas = filtered;
        saveData(data);

        sendJson(res, 200, { message: 'Empresa excluída com sucesso.' });
        return;
    }

    sendJson(res, 405, { error: 'Método não permitido.' });
};

