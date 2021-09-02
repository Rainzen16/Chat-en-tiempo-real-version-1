const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { Socket } = require('dgram');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, getRoomUsers, userLeave} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Robotito UwU';

//Ejecutar cuando el usuario se conecta
io.on('connection', socket =>{
    socket.on('joinRoom',({username, room})=>{
        const user = userJoin(socket.id,username, room);
        
        socket.join(user.room);

        //Mensaje de bienvenida
        socket.emit('message',formatMessage(botName,'Bienvenido al Chat'));

        //mensaje cuando un usuario conecta

        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} se ha unido`));

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })

    //Mensaje cuando un usuario se desconecta
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} dejo el chat`))
        }
        
    } );

    socket.on('chatMessage', (msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT,()=> console.log('Server ejecutado en puerto 3000'));
