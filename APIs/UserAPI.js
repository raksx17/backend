const exp = require('express')
const UserApp = exp.Router()
require("dotenv").config()

const expressAsyncHandler = require('express-async-handler')

const bycruptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

UserApp.use(exp.json())


UserApp.post('/login',expressAsyncHandler(async(request,response)=>{

    let userCollectionObj = request.app.get("userCollectionObj")

    let userCredObj = request.body

    let userOfDB = await userCollectionObj.findOne(
        {username:userCredObj.username}
    )
    if(!userOfDB){
        response.send("Invalid User")
    }else{
        let status = await bycruptjs.compare(userCredObj.password, userOfDB.password)
        
        if(!status){
            response.send("Invalid Password")
        }else{
            let token = jwt.sign({username:userOfDB.username},process.env.SECRET_KEY,{expiresIn:60})

            response.send({message:"login success",payload:token,userObj:userOfDB})
        }
    }
}))

UserApp.get('/getusers',expressAsyncHandler(async(request,response)=>{ 

    let userCollectionObj = request.app.get("userCollectionObj")
    let users = await userCollectionObj.find().toArray()
    response.send(users)
    
    
}))

UserApp.post('/create-user', expressAsyncHandler(async(request,response)=>{
    let userCollectionObj = request.app.get("userCollectionObj")
    let newUserObj = request.body;
    let userOfDB = await userCollectionObj.findOne(
        {username:newUserObj.username}
    )
    if(userOfDB){
        response.send({message:'username already taken, please choose another one'})
        }else{
            let hashedpassword = await bycruptjs.hash(newUserObj.password,6)
            newUserObj.password = hashedpassword
            await userCollectionObj.insertOne(newUserObj)
            response.send({message:'user created successfully'})
        }

}))

UserApp.put('/update-user',expressAsyncHandler(async(request,response)=>{
    let userCollectionObj = request.app.get("userCollectionObj")
    let modifyUserData = request.body
    let UserObj = await userCollectionObj.findOne({username:modifyUserData.username})
    if(!UserObj){
        response.send({message:'user not found'})
    }else{
        await userCollectionObj.updateOne({username: modifyUserData.username},{$set:{modifyUserData}})
        response.send({message:"updation successfull"})
    }
    
    
}))

UserApp.delete('/delete-user/:username',expressAsyncHandler(async(request,response)=>{
    let userCollectionObj = request.app.get("userCollectionObj")

    let reqUsername = request.params.username
    
    let user = await userCollectionObj.findOne({username:reqUsername})
    if(!user){
        response.send({message:'user not found'})
        }else{
            userCollectionObj.deleteOne({username:reqUsername})
            response.send({message:'user deleted successfully'})
            }
}))

module.exports = UserApp