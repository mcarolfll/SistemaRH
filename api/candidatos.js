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
        sendJson(res, 200, data.candidatos);
        return;
    }

    if (req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { nome, email, telefone, cargo_desejado } = body;

            if (!nome || !email || !cargo_desejado) {
                sendJson(res, 400, { error: 'Nome, Email e Cargo desejado são obrigatórios.' });
                return;
            }

            const data = readData();

            if (data.candidatos.some(c => c.email === email)) {
                sendJson(res, 400, { error: 'Email já cadastrado.' });
                return;
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

            sendJson(res, 201, novoCandidato);
            return;
        } catch (error) {
            sendJson(res, 500, { error: 'Erro ao processar os dados do candidato.' });
            return;
        }
    }

    sendJson(res, 405, { error: 'Método não permitido.' });
};

