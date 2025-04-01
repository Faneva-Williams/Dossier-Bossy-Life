// controllers/contribuableController.js
const Contribuable = require('../models/contribuable');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const SECRET_KEY = 'votre_clé_secrète';

exports.login = (req, res) => {
    const { nif, mdp } = req.body;

    if (nif === undefined || mdp === undefined) {
        return res.status(400).json({ message: 'Veuillez compléter tous les champs' });
    }

    Contribuable.findOne({ where: { nif } })
        .then(contribuable => {
            if (!contribuable || contribuable.mdp !== mdp) {
                return res.status(401).json({ message: 'NIF ou mot de passe incorrect' });
            }

            const token = jwt.sign({ nif: contribuable.nif, id: contribuable.id },
                 SECRET_KEY, { expiresIn: '1h' });
            res.json({ message: 'Connexion réussie', token });
        })
        .catch(error => res.status(500).json({ message: 'Erreur lors de la connexion', error }));
};




exports.getContribuableInfos = async (req, res) => {
    const { nif } = req.user; // Assurez-vous que req.user est bien renseigné

    try {
        const contribuable = await Contribuable.findOne({ where: { nif } });
        if (!contribuable) {
            return res.status(404).json({ message: 'Contribuable non trouvé' });
        }
        res.json(contribuable);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des informations', error });
    }
};


//LISTES
exports.listeContribuable = (req, res) => {
    Contribuable.findAll()
        .then(contribuable => res.json({
            message: 'listes de contribuable',
            liste: contribuable
            }))
}



//AJOUT
exports.ajoutContribuable = (req, res) => {
    const { nif, raisonsociale, adresse, mdp, cin, numStat, activite } = req.body;

    if (!nif || !raisonsociale || !adresse || !mdp || !cin || !numStat || !activite) {
        return res.status(400).json({
            message: 'Veuillez compléter tous les champs'
        })
    }

    else 
        return Contribuable.create(req.body)
            .then(contribuableAjoute => res.json({
                message: 'contribuable ajouté',
                contribuable: contribuableAjoute
                    }))
}

 //EDIT
 exports.editContribuable = (req, res) => {
    const nifContribuable = parseInt(req.params.nif)
    if (!nifContribuable)
    {
        return res.status(404).json({
            message: 'parametre non valide'
        })
    }
    else
    {
        return Contribuable.findOne({ where: { nif: nifContribuable }, raw: true })
            .then(Contribuable => {
                if (Contribuable === null)
                {
                    return res.status(404).json({
                        message: 'Contribuable non trouvé'
                    })
                }  
                else
                {
                    return res.json({
                        message: 'trouvé',
                        data: Contribuable
                    })
                    }
                        })
    }
    
}


//MODIFIER
exports.modifieContribuable = (req, res) => {
    const nifContribuable = parseInt(req.params.nif)
     if (!nifContribuable)
    {
        return res.status(404).json({
            message: 'parametre non valide'
        })
    }
     else {
          return Contribuable.findOne({ where: { nif: nifContribuable }, raw: true })
            .then(contribuable => {
                if (contribuable === null)
                {
                    return res.status(404).json({
                        message: 'Contribuable non trouvé'
                    })
                }  
                else
                {
                    Contribuable.update(req.body, { where: { nif: nifContribuable } })
                        .then(contribuableModfier => {
                            res.json({
                                message: 'Contribuable modifié'
                                })
                            })
                }
                        })
    }
}


//SUPPRIMER
exports.supprimeContribuable = (req, res) => {
     const nifContribuable = parseInt(req.params.nif)
     if (!nifContribuable)
    {
        return res.status(404).json({
            message: 'parametre non valide'
        })
    }
     else
     {
         Contribuable.destroy({ where: { nif: nifContribuable }, force: true })
        .then(() => res.json({ message: 'Contribuable supprimé' }))
        .catch(erreur => res.status(500).json({
            message: 'Erreur de recupération',
            erreur: erreur
        }))
    }
   
}

exports.rechercheNif = async (req, res) =>{

    try {
        const {nif} = req.body
        const contribuable = await Contribuable.findAll({
            where:{
                nif:{
                    [Op.like]: `%${nif}%`,
                },
            },
        });

        if(!contribuable){
            return res.json({
                status: 401,
                message: "Aucun contribuable trouvé"
            })
        }
        return res.status(200).json({
            data: contribuable
        })
    } catch (error) {
        console.error('Error fetching virements:', error); 
    }
}
