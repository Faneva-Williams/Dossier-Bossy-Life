const express = require('express');
const cors = require('cors');
const multer = require('multer'); // Pour la gestion des fichiers
const sequelize = require('./db.config');
const path = require('path'); // Add this line
const http = require('http');
const socketIo = require('socket.io');


// Routes
const contribuableRouter = require('./routes/contribuable');
const declarationRouter = require('./routes/declaration');
const virementRouter = require('./routes/virement');
const utilisateurRouter = require('./routes/utilisateur');
const rectificationRouter = require('./routes/rectification');
const messageRouter = require('./routes/message');
const paiementRouter = require('./routes/paiement');
const notificationRouter = require('./routes/notification');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de multer
//const multer = require('multer');
//const path = require('path');

// Configuration de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // Chemin vers le dossier uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nom de fichier unique
    }
});


const upload = multer({ storage });
const fs = require('fs');
//const path = require('path');

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


// Routes
app.get('/', (req, res) => res.send('Hello World'));
app.use('/contribuables', contribuableRouter);
app.use('/declarations', declarationRouter);
app.use('/virements', virementRouter);
app.use('/rectifications', rectificationRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Ensure path is defined here
app.use('/messages', messageRouter);
//app.use('/paiements', paiementRouter);
app.use('/paiements', paiementRouter);
app.use('/utilisateurs', utilisateurRouter);
app.use('/notifications', notificationRouter);


app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err);
    res.status(500).json({ message: 'Erreur serveur interne', error: err.message, stack: err.stack });
});


async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie avec succès.');

        
        await sequelize.sync({ force: false }); 
        console.log('Modèles synchronisés avec la base de données');
        app.listen(2005, () => {
            console.log('Le serveur est : http://localhost:2005');
        });
    } catch (error) {
        console.error('Impossible de démarrer le serveur:', error);
    }
}

startServer();
