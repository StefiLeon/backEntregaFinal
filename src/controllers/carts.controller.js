import loggerHandler from '../utils/logger.js';
import { cartService, productService } from '../services/services.js';
import { sendMail, sendSMS, sendWhatsapp } from '../utils/mailing.js';

const logger = loggerHandler();

//GET cart by ID
const getCartById = async(req, res) => {
    let id = req.params.cid;
    let cart = await cartService.getByAndPopulate({_id:id});
    //Check if cart exists
    if(!cart) {
        logger.error(error.message);
    }
    res.send({status:'success', payload:cart});
}

//POST add new product to the cart
const addProduct = async(req, res) => {
    let modifiedQuantity = false;
    let { cid, pid } = req.params;
    let { quantity } = req.body;
    let product = await productService.getBy({_id:pid});
    let cart = await cartService.getBy({_id:cid});
    //Check if product exists
    if(!product) {
        logger.error(error.message);
        return res.status(404).send({status:'error', error:`The product wasn't found.`});
    }
    //Check if cart exists
    if(!cart) {
        logger.error(error.message);
        return res.status(404).send({status:'error', error:`The cart wasn't found.`});
    }
    //Check stock
    if(product.stock === 0) {
        logger.error(error.message);
        return res.status(400).send({status:'error', error:'No stock.'});
    }
    //Compare and check requested quantity with product stock
    if(product.stock<quantity) {
        quantity = product.stock;
        modifiedQuantity = true;
    }
    //Remove stock when quantity is changed
    product.stock = product.stock - quantity;
    //Change status when there isn't more stock
    if(product.stock === 0) product.status = 'unavailable';
    await productService.update(pid, product);
    //Add product to cart
    cart.products.push({product:pid, quantity});
    await cartService.update(cid, cart);
    res.send({status:'success', modifiedQuantity, newQuantity:quantity, message:'Product successfully added.'});
}

//DELETE product from cart
const deleteProductFromCart = async(req, res) => {
    let { pid, cid } = req.params;
    let cart = await cartService.getByAndPopulate({_id:cid});
    //Check if cart exists
    if(!cart) {
        logger.error(error.message);
        return res.status(404).send({status:'error', error:`The cart wasn't found.`});
    }
    //Check if the product is in the cart
    if(cart.products.some(e => e.product._id.toString() === pid)) {
        let product = await productService.getBy({_id:pid});
        if(!product) {
            logger.error(error.message);
            return res.status(404).send({status:'error', error: `The product wasn't found.`});
        }
        //Associate product with cart
        let productInCart = cart.products.find(e => e.product._id.toString() === pid);
        //Modify quantity
        product.stock = product.stock + productInCart.quantity;
        await productService.update(pid, product);
        //Delete product
        cart.products = cart.products.filter(e => e.product._id.toString() !== pid);
        await cartService.update(cid, cart);
        res.send({status:'success', message:'Product deleted from cart.'});
    } else {
        logger.error(error.message);
        res.status(400).send({error:`The product wasn't found in the cart.`})
    }
}

//PUT update cart
const updateCart = async(req, res) => {
    let { cid } = req.params;
    let { products } = req.body;
    let limitStock = false;
    let cart = await cartService.getBy({_id:cid});
    //Check if cart exists
    if(!cart) {
        logger.error(error.message);
        return res.status(404).send({status:'error', error:`The cart wasn't found.`});
    }
    //Check availability of each product in cart
    for(const e of cart.products) {
        let product = await productService.getBy({_id:e.product});
        let associatedProdInCart = cart.products.find(e => e.product.toString() === product._id.toString());
        let quantityInCart = associatedProdInCart.quantity;
        let associatedProdInInput = products.find(e => e.product.toString() === product._id.toString());
        let quantityInInput = associatedProdInInput.quantity;
        if(quantityInCart !== quantityInInput) {
            //Check if the requested quantity is less than the quantity of the cart
            if(quantityInCart > quantityInInput) {
                let dif = quantityInCart - quantityInInput;
                quantityInCart = quantityInInput;
                product.stock += dif;
                //Restore stock
                await productService.update(product._id, product);
            } else {
                //If more quantity is needed, check the stock
                let dif = quantityInInput - quantityInCart;
                if(product.stock >= dif || product.stock > 0) {
                    //Add stock to the cart
                    product.stock -= dif;
                    await productService.update(product._id, product);
                    associatedProdInCart.quantity = associatedProdInInput.quantity;
                } else {
                    //What happens if there's not enough stock to add
                    limitStock = true;
                    quantityInCart += product.stock;
                    product.stock = 0;
                    await productService.update(product._id, product, quantityInCart);
                }
            }
        } else {
            logger.error(error.message);
            console.log(`No changes in quantity.`)
        }
    }
    await productService.update(cid, cart);
    res.send({status:'success', limitStock});
}

//POST confirm purchase
const confirmPurchase = async(req, res) => {
    let user = req.user;
    let { cid } =req.params;
    let cart = await cartService.getBy({_id:cid});
    //Check if cart exists
    if(!cart) {
        logger.error(error.message);
        return res.status(404).send({status:'error', error:`The cart wasn't found.`});
    }
    //Empty cart
    cart.products = []
    await cartService.update(cid, cart);
    let html = `<h1>Preparar pedido</h1>`;
    sendMail(`Nuevo pedido de ${user.first_name} ${user.last_name}`, html);
    sendSMS(`Su pedido ha sido recibido`);
    sendWhatsapp(`${html}. De: ${user.first_name} ${user.last_name}`)
    res.send({status:'success', message:`Purchase finished.`});
}

export default {
    getCartById,
    addProduct,
    deleteProductFromCart,
    updateCart,
    confirmPurchase
}