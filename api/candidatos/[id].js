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
        sendJson(res, 400, { error: 'ID do candidato é obrigatório.' });
        return;
    }

    if (req.method === 'PUT') {
        try {
            const body = await parseBody(req);
            const { nome, email, telefone, cargo_desejado, status } = body;
            const data = readData();

            const index = data.candidatos.findIndex(c => c.id == id);

            if (index === -1) {
                sendJson(res, 404, { error: 'Candidato não encontrado.' });
                return;
            }

            if (email && email !== data.candidatos[index].email) {
                if (data.candidatos.some(c => c.email === email)) {
                    sendJson(res, 400, { error: 'Email já cadastrado.' });
                    return;
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
            sendJson(res, 200, data.candidatos[index]);
            return;
        } catch (error) {
            sendJson(res, 500, { error: 'Erro ao atualizar candidato.' });
            return;
        }
    }

    if (req.method === 'DELETE') {
        const data = readData();
        const filtered = data.candidatos.filter(c => c.id != id);

        if (data.candidatos.length === filtered.length) {
            sendJson(res, 404, { error: 'Candidato não encontrado.' });
            return;
        }

        data.candidatos = filtered;
        saveData(data);

        sendJson(res, 200, { message: 'Candidato excluído com sucesso.' });
        return;
    }

    sendJson(res, 405, { error: 'Método não permitido.' });
};

