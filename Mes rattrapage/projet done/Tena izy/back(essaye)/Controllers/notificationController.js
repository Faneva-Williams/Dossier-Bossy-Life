const Notification = require('../models/notification')

//getNotification

exports.getNouvelle =  (req, res) =>{
try {

  const idNotif = 1;
  return Notification.findOne({where:{id:idNotif}})    
                      .then(notif => {
                        if(notif === null){
                          res.json({
                            message: "Non trouvé"
                          })
                        }
                      else{
                        res.json({
                          message: "notif",
                          data: notif
                        })
                      }
                      })
} catch (error) {
  console.log(error)
}


exports.getAcceptation =  (req, res) =>{
  try {
  
    const idNotif = 2;
    return Notification.findOne({where:{id:idNotif}})    
                        .then(notif => {
                          if(notif === null){
                            res.json({
                              message: "Non trouvé"
                            })
                          }
                        else{
                          res.json({
                            message: "notif",
                            data: notif
                          })
                        }
                        })
  } catch (error) {
    console.log(error)
  }
    
}
}