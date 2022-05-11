import express from 'express';
import cors from 'cors';
import passport from 'passport';
import initializePassport from './config/passport-config.js';
import cookieParser from 'cookie-parser';
import sessionsRouter from './routes/sessions.routes.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { messagesService } from './services/services.js';
import { uploader } from './utils/uploader.js';
import { Server } from 'socket.io';

//SERVER ON EXPRESS
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})
server.on('error', (error) => console.log(`Error in server: ${error}`));
const io = new Server(server, {
    cors: {
        origin:'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({credentials:true, origin:"http://localhost:3000"}));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
app.use(uploader.single('profilePic'));

//Routes
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/session', sessionsRouter);

//Websockets
let connectedSockets = {};
io.on('connection', async socket => {
    console.log(`Client connected.`)
    if(socket.handshake.query.name) {
        if(Object.values(connectedSockets).some(u => u.id === socket.handshake.query.id)) {
            Object.keys(connectedSockets).forEach(idSocket => {
                if(connectedSockets[idSocket].id === socket.handshake.query.id) {
                    delete connectedSockets[idSocket];
                    connectedSockets[socket.id] = {
                        name: socket.handshake.query.name,
                        id: socket.handshake.query.id,
                        thumbnail: socket.handshake.query.thumbnail
                    }
                }
            })
        } else {
            connectedSockets[socket.id] = {
                name: socket.handshake.query.name,
                id: socket.handshake.query.id,
                thumbnail: socket.handshake.query.thumbnail
            }
        }
    }
    io.emit('users', connectedSockets);
    
    let logs = await messagesService.getMessagesAndPopulate();
    io.emit('logs', logs);

    socket.on('disconnect', reason => {
        delete connectedSockets[socket.id];
    })

    socket.on('message', async data => {
        if(Object.keys(connectedSockets).includes(socket.id)) {
            await messagesService.save({
                author: connectedSockets[socket.id].id,
                content: data
            })
            let logs = await messagesService.getMessagesAndPopulate();
            io.emit('logs', logs);
        }
    })
})