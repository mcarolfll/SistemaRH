const fs = require('fs');
const path = require('path');
const os = require('os');

const baseDataPath = path.join(__dirname, 'data.json');
const tmpDataPath = path.join(os.tmpdir(), 'sistema-rh-data.json');

function getDataPath() {
    if (process.env.VERCEL) {
        return tmpDataPath;
    }
    return baseDataPath;
}

function ensureDataFile() {
    const targetPath = getDataPath();

    if (!fs.existsSync(targetPath)) {
        if (fs.existsSync(baseDataPath)) {
            fs.copyFileSync(baseDataPath, targetPath);
        } else {
            const emptyData = {
                candidatos: [],
                empresas: []
            };
            fs.writeFileSync(targetPath, JSON.stringify(emptyData, null, 2));
        }
    }
}

function readData() {
    ensureDataFile();
    const filePath = getDataPath();
    const raw = fs.readFileSync(filePath, 'utf8');

    if (!raw) {
        return {
            candidatos: [],
            empresas: []
        };
    }

    return JSON.parse(raw);
}

function saveData(data) {
    const filePath = getDataPath();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
    readData,
    saveData
};

