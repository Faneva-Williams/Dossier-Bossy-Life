const express = require('express');
const router = express.Router();
const contribuableController = require('../Controllers/contribuableController'); // Assurez-vous que le chemin est correct
const authMiddleware = require('../middlewares/authMiddleware');


// Ajoute cette ligne pour gérer le login
router.post('/login', contribuableController.login);
router.get('/infos', authMiddleware, contribuableController.getContribuableInfos);
router.get('/listes', contribuableController.listeContribuable);
router.post('/ajout', contribuableController.ajoutContribuable);
router.get('/editer/:nif', contribuableController.editContribuable)
router.patch('/modifier/:nif', contribuableController.modifieContribuable)
router.delete('/supprimer/:nif', contribuableController.supprimeContribuable)
router.post('/recherche', contribuableController.rechercheNif)

module.exports = router;
