// routes/virementRoutes.js
const express = require('express');
const router = express.Router();
const virementController = require('../Controllers/virementController');
const authorization = require('../middlewares/authMiddleware')

// Route pour créer un nouveau virement
router.post('/ajout', virementController.ajoutVirement);

// Route pour récupérer tous les virements
router.get('/listes',authorization, virementController.listeVirement);

router.get('/listens', virementController.listenVirement);

router.post('/recherche', virementController.rechercheNif);

module.exports = router;
