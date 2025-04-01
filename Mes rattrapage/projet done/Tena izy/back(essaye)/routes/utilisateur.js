const express = require('express')
const router = express.Router()
const userCtrl = require('../Controllers/utilisateurController');

router.post('/login', userCtrl.login);

module.exports = router