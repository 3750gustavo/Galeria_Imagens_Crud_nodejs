// Arquivo: server.js
// Diretório: /Backend
// Responsável por hospedar tanto o front quanto o back-end da aplicação, é a "alma" do negócio, onde tudo acontece.

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Configurações importantes
const imagesDir = path.join(__dirname, 'images');

// Criar diretório de imagens se não existir
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// Configuração do CORS
app.use(cors());

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imagesDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error('Tipo de arquivo não suportado');
            error.code = 'LIMIT_FILE_TYPES';
            return cb(error, false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Middleware para servir arquivos estáticos
app.use('/images', express.static(imagesDir));
app.use(express.static(path.join(__dirname, '../FrontEnd'))); // server index.html da pasta FrontEnd

// Rota para listar imagens
app.get('/images', (req, res) => {
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Erro ao ler diretório:', err);
            return res.status(500).json({ error: 'Erro ao listar imagens' });
        }

        // Filtrar apenas arquivos de imagem
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
        });

        res.json(imageFiles);
    });
});

// Rota para upload de imagens
app.post('/images', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    res.status(201).json({
        message: 'Upload realizado com sucesso',
        filename: req.file.filename
    });
});

// Rota para deletar imagens
app.delete('/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(imagesDir, filename);

    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    // Verificar se é um arquivo de imagem
    const ext = path.extname(filename).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        return res.status(400).json({ error: 'Tipo de arquivo inválido' });
    }

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Erro ao deletar arquivo:', err);
            return res.status(500).json({ error: 'Erro ao deletar arquivo' });
        }
        res.json({ message: 'Arquivo deletado com sucesso' });
    });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err.stack);

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'Arquivo muito grande. Tamanho máximo: 5MB' });
    }

    if (err.code === 'LIMIT_FILE_TYPES') {
        return res.status(415).json({ error: 'Tipo de arquivo não suportado' });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Armazenando imagens em: ${imagesDir}`);
})