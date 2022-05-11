import { productService } from '../services/services.js';

//GET all products
const getAllProducts = async(req, res) => {
    let products = await productService.getAll();
    //Check products in db
    if(!products) {
        logger.error(error.message);
        res.status(404).send({status:'error', message:'No products in db.'})
    }
    res.send({status:"success", payload:products});
}

//GET product by ID
const getProductById = async(req, res) => {
    let id = req.params.pid;
    let product = await productService.getBy({_id:id});
    //Check if the product exists
    if(!product) {
        logger.error(error.message);
        res.status(404).send({status:'error', message:'Product not found.'});
    }
    res.send({status:'success', payload: product});
}

//POST new product
const saveProduct = async(req, res) => {
    let file = req.file;
    let { title, description, code, price, stock } = req.body;
    //Check fields
    if(!title || !description || !code || !price || !stock) {
        logger.error(error.message);
        res.status(404).send({status:'error', message:`Body incomplete.`});
    }
    let thumbnail = '';
    //Check if the file was uploaded
    if(file) {
        thumbnail = file.location
    } else {
        logger.error(error.message);
        console.error(`Couldn't upload file.`)
    }
    await productService.save({title, description, code, thumbnail, price, stock}).then(product => {
        res.send({status: 'success', message: 'Product added.'});
    })
}

//PUT update product by ID
const updateProduct = async(req, res) => {
    let { pid } = req.params;
    let body = req.body;
    let product = await productService.getBy({_id:pid});
    //Check if the product exists
    if(!product) {
        logger.error(error.message);
        res.status(404).send({status:'error', error:`Product wasn't found.`});
    }
    await productService.update(pid, body);
    res.send({status:'success', message:`Product correctly updated.`});
}

//DELETE product by ID
const deleteProduct = async(req, res) => {
    let { pid } = req.params;
    let product = await productService.getBy({_id:pid});
    //Check if the product exists
    if(!product) {
        logger.error(error.message);
        res.status(404).send({status:'error', error:`Product wasn't found.`});
    }
    await productService.delete(pid);
    res.send({status:'success', message:'Product deleted from db.'});
}

export default {
    getAllProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct
}