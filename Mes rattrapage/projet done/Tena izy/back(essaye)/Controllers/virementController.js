// controllers/virementController.js
const Virement = require('../models/virement');
const { Op } = require('sequelize');

// Fonction pour créer un nouveau virement
// AJOUT
exports.ajoutVirement = (req, res) => { 
    const { nif, raisonsociale, nifPayeur, nomPayeur, datePaiement, numDecl, compteimpot, comptebancaire, tvaAPayer} = req.body;

    if (!nif || !raisonsociale || !nifPayeur || !nomPayeur || !datePaiement || !numDecl  || !compteimpot || !comptebancaire || !tvaAPayer) {
        return res.status(400).json({
            message: 'Veuillez compléter tous les champs requis.'
        });
    }

    else 
    return Virement.create(req.body)
        .then(virementAjoute => res.json({
            message: 'virement ajouté',
            payement: virementAjoute
                }))
}


// LISTE
exports.listeVirement = (req, res) => {
    const userNif = req.user.nif
    console.log(userNif)
    Virement.findAll({ where: {nif: userNif}})
        .then(virement => res.json({
            message: 'listes de virement',
            liste: virement
            }))
}

exports.listenVirement = (req, res) => {
    Virement.findAll()
        .then(virement => res.json({
            message: 'listes de virement',
            liste: virement 
            }))
}


exports.rechercheNif = async (req, res) =>{
    try {
        const {nif} = req.body
        const virement = await Virement.findAll({
            where:{
                nif:{
                    [Op.like]: `%${nif}%`,
                },
            },
        });

        if(!virement){
            return res.json({
                status: 401,
                message: "Aucun payement trouvé"
            })
        }
        return res.status(200).json({
            data: virement
        })
    } catch (error) {
        console.error('Error fetching virements:', error); 
    }
}


