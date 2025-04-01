const User = require('../models/utilisateur')
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'votre_clé_secrète';

//LOGIN
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (email === '' || password === '') {
        return res.status(400).json({ message: 'Veuillez compléter tous les champs' });
    }
    User.findOne({ where: { email }  })
        .then(user => {
            if (!user || user.password !== password) {
                return res.json({ message: 'Adresse email ou mot de passe incorrect' });
            }

            const token = jwt.sign({ id: user.id},
                 SECRET_KEY, { expiresIn: '1h' });
            res.json({ 
                message: 'Connexion réussie', 
                tokenKey: token 
            });
        })
        .catch(error => res.status(500).json({
                message: 'Erreur lors de la connexion', 
                error: error,
                erreur: console.log(error) 
        }));
};