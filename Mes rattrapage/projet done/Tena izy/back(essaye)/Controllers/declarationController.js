const Declaration = require('../models/declaration');

// AJOUT
exports.ajoutDeclaration = async (req, res) => {
  const { nif, raisonsociale, periode, vente, achats, tvaAPayer } = req.body;
  
  
  if (!nif || !raisonsociale || !periode || !vente || !achats || !tvaAPayer) {
    return res.status(409).json({
      message: 'Veuillez completer les champs'
  })
  }
  else 
        return Declaration.create(req.body)
            .then(declarationAjoute => res.json({
                message: 'declaration ajouté',
                recette: declarationAjoute
                    }))
}
  

// LISTE
exports.listeDeclaration = (req, res) => {
  const userNif = req.user.nif
    console.log(userNif)
  //console.log(userId);
  Declaration.findAll({where: {nif:userNif}})
      .then(declaration => res.json({
          message: 'listes de declaration',
          liste: declaration,
          }))
}


//Liste contribuable
/*exports.listeDeclarationtoken = (req, res) => {
  Declaration.findAll()
      .then(declaration => res.json({
          message: 'listes de declaration',
          liste: declaration
          }))
}*/



