// routes/messageRoutes.js
const express = require('express');
const { createMessage, getMessages } = require('../controllers/messageController');

const router = express.Router();

// Route pour créer un message
router.post('/', createMessage);

// Route pour récupérer tous les messages
router.get('/', getMessages);

module.exports = router;
