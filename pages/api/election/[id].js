import firebaseApp from "../../../utils/firebaseConfig"

export default (req,res)=>{  
    firebaseApp
    .firestore()
    .collection(`elections`)
    .doc(req.query.id)
    .get()
    .then(item => {
      res.json({dataSWR: item.data()})
    })
    .catch(err => {
      res.json({err})
    });
}