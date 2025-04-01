const express = require('express');
const router = express.Router();
const multer = require('multer');
const authorization = require('../middlewares/authMiddleware')
const rectificationController = require('../Controllers/rectificationController');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Routes
router.post('/ajout', upload.single('file'), rectificationController.ajoutRectification);
router.get('/listes', authorization, rectificationController.listeRectification); // Ajout de la route pour la liste
router.get('/files/:filePath', rectificationController.getFile);
router.get('/edit/:id', rectificationController.editRetification );
router.patch('/approuver/:id', rectificationController.approuver);
router.patch('/refuser/:id', rectificationController.supprimer);
router.get('/diagramme', rectificationController.getRectificationsByMonth);
router.get('/listens', rectificationController.listenRectification);

router.post('/recherche', rectificationController.rechercheNif);
//router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

module.exports = router;
