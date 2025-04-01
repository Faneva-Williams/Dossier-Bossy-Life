const express = require('express');
const router = express.Router();
const paiementCtrl = require('../Controllers/paiementController');
const authorization = require('../middlewares/authMiddleware')


// Route pour ajouter une déclaration
router.post('/ajout', paiementCtrl.ajoutPaiement);
router.get('/listes',authorization, paiementCtrl.listePaiement);
//router.get('/listes', paiementCtrl.listePaiement);

module.exports = router;