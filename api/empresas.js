const { readData, saveData } = require('../backend/database/dataStore');

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
    if (req.method === 'GET') {
        const data = readData();
        sendJson(res, 200, data.empresas);
        return;
    }

    if (req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { nome, cnpj, email, telefone } = body;

            if (!nome || !cnpj || !email) {
                sendJson(res, 400, { error: 'Nome, CNPJ e Email são obrigatórios.' });
                return;
            }

            const data = readData();

            if (data.empresas.some(e => e.cnpj === cnpj)) {
                sendJson(res, 400, { error: 'CNPJ já cadastrado.' });
                return;
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

            sendJson(res, 201, novaEmpresa);
            return;
        } catch (error) {
            sendJson(res, 500, { error: 'Erro ao processar os dados da empresa.' });
            return;
        }
    }

    sendJson(res, 405, { error: 'Método não permitido.' });
};

