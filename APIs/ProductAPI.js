const exp = require('express')
const ProductAPP = exp.Router()

const expressAsyncHandler = require('express-async-handler')

ProductAPP.use(exp.json())


ProductAPP.get('/getproducts',expressAsyncHandler(async(request,response)=>{

    let productCollectionObj = request.app.get("productCollectionObj")
    let products = await productCollectionObj.find().toArray()
    response.send({message:'All products',payload:products})

}))

ProductAPP.get('/getproduct/:id',expressAsyncHandler(async(request,response)=>{

    let productCollectionObj = request.app.get("productCollectionObj")
    let pId = (+request.params.id)
    let product = await productCollectionObj.findOne({productId:pId})
    if(product == null){
        response.send({message:'product not existed'})
    }else{
        response.send({message:'product existed',payload:product})
    }

}))

ProductAPP.post('/create-product', expressAsyncHandler(async(request,response)=>{
    
    let productCollectionObj = request.app.get("productCollectionObj")

    let productObj = request.body
    let alreadyExists = await productCollectionObj.findOne({productId:productObj.productId})
    if(alreadyExists){
        response.send({message:`product already exists with this Id - ${productObj.productId}`})
        }else{
            await productCollectionObj.insertOne(productObj)
            response.send({message:'Product created successfully'})
            }
    
}))

ProductAPP.put('/update-product', expressAsyncHandler(async (request, response) => {

    let productCollectionObj = request.app.get("productCollectionObj");
    let modifiedtoBeProduct = request.body;
    let product = await productCollectionObj.findOne({ productId: modifiedtoBeProduct.productId });

    // Check if product exists and compare its properties with the modified product
    if (product) {
        // Compare relevant fields (you can specify which fields to compare)
        const productFields = ['name', 'description', 'price', 'category']; // Adjust this list according to your product fields
        let isSame = true;

        for (let field of productFields) {
            if (product[field] !== modifiedtoBeProduct[field]) {
                isSame = false;
                break;
            }
        }

        if (isSame) {
            response.send({ message: 'Product already exists with the same description, no modification needed' });
        } else {
            await productCollectionObj.updateOne(
                { productId: modifiedtoBeProduct.productId },
                { $set: { ...modifiedtoBeProduct } }
            );
            response.send({ message: 'Product updated successfully' });
        }
    } else {
        response.status(404).send({ message: 'Product not found' });
    }
}));


ProductAPP.delete('/delete-product/:id',expressAsyncHandler(async(request,response)=>{
    let productCollectionObj = request.app.get("productCollectionObj")
    let pId = (+request.params.id)
    let Exist = await productCollectionObj.findOne({productId:pId})
    
    if(!Exist){
        response.send({message:'Product not existed'})
        }else{
        await productCollectionObj.deleteOne({productId:pId})
        response.send({message:'Product deleted successfully'})
    }
}))

module.exports = ProductAPP