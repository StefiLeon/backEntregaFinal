import mongoose from 'mongoose';
import Cart from './Cart.js';
import Message from './Message.js';
import Product from './Product.js';
import User from './User.js';

export default class Dao {

    constructor(config) {
        this.mongoose = mongoose.connect(config.url, {useNewUrlParser:true}).catch(error => {
            console.error(error);
            process.exit();
        })

        //Timestamp
        const timestamp = {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}};
        
        //Schemas
        const cartSchema = mongoose.Schema(Cart.schema, timestamp);
        const messageSchema = mongoose.Schema(Message.schema, timestamp);
        const productSchema = mongoose.Schema(Product.schema, timestamp);
        const userSchema = mongoose.Schema(User.schema, timestamp);
        
        //Populate
        // cartSchema.pre('find', function() {
        //     this.populate('products', 'user');
        // })
        // messageSchema.pre('find', function() {
        //     this.populate('messages');
        // })
        // userSchema.pre('find', function() {
        //     this.populate('cart');
        // })
        
        //Models
        this.models = {
            [Cart.model]:mongoose.model(Cart.model, cartSchema),
            [Message.model]:mongoose.model(Message.model, messageSchema),
            [Product.model]:mongoose.model(Product.model, productSchema),
            [User.model]:mongoose.model(User.model, userSchema)
        }
    }

    //CRUD
    findOne = async(options, entity) => {
        if(!this.models[entity]) throw new Error (`Entity ${entity} not in dao schemas.`)
        let result = await this.models[entity].findOne(options);
        return result ? result.toObject() : null;
    }
    getAll = async(options, entity) => {
        if(!this.models[entity]) throw new Error (`Entity ${entity} not in dao schemas.`)
        let results = await this.models[entity].find(options);
        if(!results) throw new Error(`Results not found.`)
        return results.map(result => result.toObject())
    }
    insert = async(document, entity) => {
        if(!this.models[entity]) throw new Error (`Entity ${entity} not in dao schemas.`)
        try {
            let instance = new this.models[entity](document);
            let result = await instance.save();
            return result ? result.toObject() : null;
        } catch(err) {
            console.log(err);
            return null;
        }
    }
    update = async(document, entity) => {
        if(!this.models[entity]) throw new Error (`Entity ${entity} not in dao schemas.`)
        let id = document._id;
        delete document._id;
        let result = await this.models[entity].findByIdAndUpdate(id, {$set:document}, {new:true});
        return result;
    }
    deleteOne = async(id, entity) => {
        if(!this.models[entity]) throw new Error (`Entity ${entity} not in dao schemas.`)
        let result = await this.models[entity].findByIdAndDelete(id);
        return result ? result.toObject() : null;
    }
    exists = async(options, entity) => {
        if(!this.models[entity]) throw new Error (`Entity ${entity} not in dao schemas.`)
        return this.models[entity].exists(options);
    }
}