const exp = require('express')
const app = exp()
const mClient = require("mongodb").MongoClient;
require("dotenv").config()


const DBURL = process.env.DATABASE_CONNECTION_URL;

mClient.connect(DBURL)

.then((client)=>{

    let dbObj = client.db('raksdb')

    let userCollectionObj =  dbObj.collection('usercollection')
    let productCollectionObj =  dbObj.collection('productcollection')

    app.set('userCollectionObj', userCollectionObj);
    app.set('productCollectionObj', productCollectionObj);
    


    console.log("Connected to MongoDB")
})
.catch(err=>console.log('Error is Database Connection',err))

const UserApp = require('./APIs/UserAPI')
const ProductAPP = require('./APIs/ProductAPI')



app.use('/User-API', UserApp)
app.use('/Product-API', ProductAPP)


app.use((request,response,next)=>{
    response.send(`Invalid path = ${request.url}`)
}
)

app.use((error,request,response,next)=>{
    response.send(`Syntax Error = ${error}`)
})
const port = process.env.PORT;

app.listen(port,()=>console.log(`Web Server listening on port ${port}`))