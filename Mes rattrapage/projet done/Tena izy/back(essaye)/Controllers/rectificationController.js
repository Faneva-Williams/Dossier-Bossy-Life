//const { where } = require('sequelize');
const { Sequelize } = require('sequelize');
const Rectification = require('../models/Rectification'); // Vérifiez la casse ici
const path = require('path');
const Notification = require('../models/notification')

// Créer une rectification
exports.ajoutRectification = async (req, res) => {
    try {
        const { nif, raisonsociale, ligne_erronee, commentaire } = req.body;
        let file_path = null;

        if (req.file) {
            file_path = req.file.filename; // Chemin relatif pour enregistrer en base de données
        }

        if (!nif || !raisonsociale || !ligne_erronee || !commentaire) {
            return res.status(400).json({
                message: 'Veuillez compléter tous les champs requis.'
            });
        }

        const rectification = await Rectification.create({
            nif,
            raisonsociale,
            ligne_erronee,
            commentaire,
            file_path // Ajouter le chemin du fichier si disponible
        });

        return res.status(201).json({
            message: 'Rectification ajoutée avec succès.',
            rectification
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la rectification:', error);
        return res.status(500).json({
            message: 'Erreur serveur lors de l\'ajout de la rectification.'
        });
    }
};


// Liste des rectifications
exports.listeRectification = async (req, res) => {
    try {
        const userNif = req.user.nif

        const count = await Rectification.count({
            where: {
              status: 'Approuvée',
              nif: userNif 
            }
          });
          const countRefuse = await Rectification.count({
            where: {
              status: 'Refusée',
              nif: userNif 
            }
          });
        const rectifications = await Rectification.findAll({where: { nif: userNif}});
        if (rectifications.length === 0) {
            return res.json({
                status: 404,
                message: "Aucun rectification"
            })
        }

        // Ajouter l'URL complète des fichiers pour chaque rectification
        const updatedRectifications = rectifications.map((rectification) => {
            if (rectification.file_path) {
                rectification.file_url = `${req.protocol}://${req.get('host')}/files/${rectification.file_path}`;
            }
            return rectification;
        });

        res.json({
            message: 'Listes de rectification',
            liste: updatedRectifications,
             count: count,
             countRefuse: countRefuse
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des rectifications:', error);
        return res.status(500).json({
            message: 'Erreur serveur lors de la récupération des rectifications.'
        });
    }
};


// Nouvelle fonction pour servir les fichiers
exports.getFile = async (req, res) => {
    try {
        const filePath = req.params.filePath;
        const fullPath = path.join(__dirname, '..', 'uploads', filePath); // Ajustez le chemin selon votre structure de dossiers

        // Utiliser `res.sendFile` pour envoyer le fichier
        res.sendFile(fullPath, (err) => {
            if (err) {
                console.error('Erreur lors de l\'envoi du fichier:', err);
                return res.status(404).json({ message: 'Fichier non trouvé ou inaccessible' });
            }
        });
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération du fichier.' });
    }
};

//editer
exports.editRetification =async  (req, res)=>{
   try {
        const id =  parseInt(req.params.id)
        if(!id){
            return res.json({
                message: "Paramètre non valide"
            })
        }
        const rectification = await Rectification.findOne({where: {id_rect: id}, raw:true})
            if(rectification === null){
                return res.json({
                    message: "Rectification non trouvé"
                })
        }
         // Construire l'URL complète pour le fichier
           const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
rectification.file_path = rectification.file_path.replace(/\\/g, '/'); // Remplacer les backslashes par des slashes

            return res.json({
                message: "Rectification",
                data: rectification
            })
   } catch (error) {
            console.error('Erreur lors de la récupération des rectifications:', error);
            return res.status(500).json({
                message: 'Erreur serveur lors de la récupération des rectifications.'
            });
   }

}

//Aprouver

exports.approuver = async (req, res) => {

    try {
        const id =  parseInt(req.params.id)
        if(!id){
            return res.json({
                message: "Paramètre non valide"
            })
        }
        const rectification = await Rectification.findOne({where: {id_rect: id}, raw:true})
            if(rectification === null){
                return res.json({
                    message: "Rectification non trouvé"
                })
        }
        const rectificationModifie = await Rectification.update(
            {status : "Approuvée"},
            {where : {id_rect: id} }
        )
        return res.json({
            message: "Rectification modifié",
            data: rectificationModifie
        })
      
      

    } catch (error) {
        console.log('Erreur lors de la récupération des rectifications:', error);
        return res.status(500).json({
            message: 'Erreur serveur lors de la récupération des rectifications.',
        });
    }
};
exports.supprimer = async(req, res)=>{
    try {
        const id =  parseInt(req.params.id)
        if(!id){
            return res.json({
                message: "Paramètre non valide"
            })
        }
        const rectification = await Rectification.findOne({where: {id_rect: id}, raw:true})
            if(rectification === null){
                return res.json({
                    message: "Rectification non trouvé"
                })
        }
        const rectificationModifie = await Rectification.update(
            {status : "Refusée"},
            {where : {id_rect: id} }
        )
        return res.json({
            message: "Rectification refusé",
            data: rectificationModifie
        })
      
      

    } catch (error) {
        console.log('Erreur lors de la récupération des rectifications:', error);
        return res.status(500).json({
            message: 'Erreur serveur lors de la récupération des rectifications.',
        });
    }
};

const { Op } = require('sequelize');
const moment = require('moment'); // Assure-toi d'installer moment.js pour gérer les dates

exports.getRectificationsByMonth = async (req, res) => {
    try {
        const currentYear = moment().year(); // Obtenir l'année actuelle

        const rectifications = await Rectification.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('COUNT', Sequelize.col('id_rect')), 'rectifications_count'],
            ],
            where: {
                createdAt: {
                    [Op.gte]: new Date(currentYear, 0, 1), // Date de début de l'année
                    [Op.lt]: new Date(currentYear + 1, 0, 1) // Date de début de l'année suivante
                }
            },
            group: ['month'],
            order: [[Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'ASC']],
        });

        res.json(rectifications);
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

//LISTES
exports.listenRectification = async (req, res) => {
    try {
        const rectifications = await Rectification.findAll({
            order: [['createdAt', 'DESC']]
        });
        const count = await Rectification.count(); // Compte le nombre de rectifications

        res.json({
            message: 'Liste des rectifications',
            liste: rectifications,
            count: count // Renvoie le nombre total de rectifications
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des rectifications:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la récupération des rectifications.'
        });
    }
}

exports.rechercheNif = async (req, res) =>{
    try {
        const {nif} = req.body
        const rectification = await Rectification.findAll({
            where:{
                nif:{
                    [Op.like]: `%${nif}%`,
                },
            },
        });

        if(!rectification){
            return res.json({
                status: 401,
                message: "Aucun rectification trouvé"
            })
        }
        return res.status(200).json({
            data: rectification
        })
    } catch (error) {
        console.error('Error fetching virements:', error); 
    }
}
