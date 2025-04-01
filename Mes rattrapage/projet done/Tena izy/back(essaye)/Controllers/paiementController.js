const Paiement = require('../models/paiement');

//AJOUT
exports.ajoutPaiement = (req, res) => {
    const{ nif, raisonsociale, datedeclaration, datedepaiement, tvAPayer, statut } = req.body;

    if (!nif ||!raisonsociale ||!datedeclaration ||!datedepaiement ||!tvAPayer ||!statut){
        return res.status(400).json({
            message: 'Veuillez complétez tous les champs.'
        });
    }
    else
    return Paiement.create(req.body)
     .then(paiementAjoute => res.json({
        message: 'paiement ajouté',
        paiement: paiementAjoute
     }))
}
// LISTE
exports.listePaiement = (req, res) => {
    const userNif = req.user.nif
        console.log(userNif)  
    Paiement.findAll({ where: {nif:userNif}})
        .then(paiement => res.json({
            message: 'listes de paiement',
            liste: paiement
            }))
        /*return res.json({
            message: 'nif',
            nif: userNif
        })*/
}
