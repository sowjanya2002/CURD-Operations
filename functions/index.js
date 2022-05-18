const functions = require("firebase-functions");

const app=require("express")();

const {admin,db}=require("./utils/admin")

app.post("/createUser",(req,res)=>{
    const inputs=req.body;
    return admin.auth().createUser({
        email:inputs.email,
        password:inputs.password
    }).then((user)=>{
        req.user=user;
        return admin.auth().setCustomUserClaims(user.uid,{role:"user"})
    }).then(()=>{
        const userRef=db.collection("USERS").doc(req.user.uid)
        return userRef.set({
        ...inputs,
        isExist: true,
        createdAt:admin.firestore.FieldValue.serverTimestamp(),
        role:"user",
        id:userRef.id,
        uid:req.user.uid
    })
    }).then(()=>{
          res.send("user created successfully")
    }).catch((err)=>{
        console.log(err)
        return res.send("Failed to create user")
    })
    
})
exports.api=functions.https.onRequest(app)