const jwt = require('jsonwebtoken');
const SECRET_KEY = 'votre_clé_secrète';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if  (!token) {
        console.log('Token manquant');
        return res.status(401).json({ message: 'Token manquant' });
    }


    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide',
        erreur: err });
        }
        //req.user = decoded; // Assurez-vous que `nif` est dans le token
        req.user = {nif: decoded.nif, id: decoded.id }; // Stocker le NIF et l'ID de l'utilisateur
        //console.log(req.user.nif)
        next();
    });
};

module.exports = authMiddleware;
