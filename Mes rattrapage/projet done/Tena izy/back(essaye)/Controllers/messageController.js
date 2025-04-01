// controllers/messageController.js
const Message = require('../models/message');

// Créer un message
exports.createMessage = async (req, res) => {
    try {
        const { contenu, sender } = req.body;

        const newMessage = await Message.create({
            contenu,
            sender,
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création du message' });
    }
};

// Récupérer les messages
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.findAll();
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des messages' });
    }
};
