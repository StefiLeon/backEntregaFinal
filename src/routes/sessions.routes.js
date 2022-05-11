import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { passportCall } from '../utils/middlewares.js';
import { getAllUsers, saveUser, deleteUser } from '../controllers/users.controller.js';
import { serialize } from '../utils/utils.js';
import { uploader } from '../utils/uploader.js';

const router = express.Router();

//GETS
router.get('/current', passportCall('jwt'), (req, res) => {
    let user = serialize(req.user, ['first_name', 'last_name', 'role', 'profile_picture', 'cart']);
    res.send({status:'success', payload:user});
})

router.get('/users', getAllUsers);

//POSTS
router.post('/register', passportCall('register'), uploader.single('profilePic'), saveUser);

router.post('/login', passportCall('login'), (req, res) => {
    let user;
    if(req.user.role !== 'superadmin') {
        user = serialize(req.user, ['first_name', 'last_name']);
    } else {
        user = req.user;
    }
    let token = jwt.sign(user, config.jwt.secret);
    res.cookie(config.jwt.cookie, token, {
        httpOnly: true,
        maxAge: 60*60*1000
    })
    res.cookie('sessionCookie', 'boom', {
        maxAge: 60*60*1000
    })
    res.send({status:'success', payload:{user}})
})

//DELETES
router.delete('/:uid', deleteUser);

export default router;