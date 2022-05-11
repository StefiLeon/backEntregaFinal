import Dao from '../models/Dao.js';
import CartService from './carts.service.js';
import MessagesService from './messages.service.js';
import ProductService from './products.service.js';
import UserService from './users.service.js';
import config from '../config/config.js';

//Instance Dao with Mongo
const dao = new Dao(config.mongo);

//Instance and export services using dao
export const cartService = new CartService(dao);
export const messagesService = new MessagesService(dao);
export const productService = new ProductService(dao);
export const userService = new UserService(dao);