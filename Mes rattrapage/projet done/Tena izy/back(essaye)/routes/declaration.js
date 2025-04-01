const express = require('express');
const router = express.Router();
const declarationCtrl = require('../Controllers/declarationController');
const authorization = require('../middlewares/authMiddleware')

// Route pour ajouter une déclaration (protégée par authMiddleware)
router.post('/ajout',  declarationCtrl.ajoutDeclaration);
router.get('/listes',authorization,  declarationCtrl.listeDeclaration);

module.exports = router;
