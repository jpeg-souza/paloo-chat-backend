
// TODO: VERIFICAR SE TEM VERSAO ES6 DO CORS E SOCKETIO
// OBS: NÃO IMPORTA O RESTANTE. VAI DAR PROBLEMA SE COLOCAR TYPE MODULE
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');


// importando as funções do usuário - Michele
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

// instancia
const router = require('./router');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// o servidor usará o router e cors pra lidar com as requisções vindas de fora
app.use(cors());
app.use(router);

// quando dispara um conect
io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room }); // cria a variavel user
    if(error) return callback(error); // handle de possivel erro
    socket.join(user.room); // adiciona na room do socket
    socket.emit('message', { user: 'server', text: `${user.name}, bem vindo à sala ${user.room}.`}); // emite mensagem para o usuário
    socket.broadcast.to(user.room).emit('message', { user: 'server', text: `${user.name} entrou na sala!` }); // mensagem de confirmação para os demais usuários
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) }); // atualiza os dados da room nos usuários
    callback(); // default 'ok' 
  });

// quando uma mensagem é enviada
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id); // recebe o id do usuário
    io.to(user.room).emit('message', { user: user.name, text: message }); // emite a mensagem aos demais
    callback();
  });

// quando o usuário desconecta 
  socket.on('disconnect', () => {
    const user = removeUser(socket.id); // remove informações do usuário no servidor
    if(user) {
      // emite sinal de que o usuário saiu
      io.to(user.room).emit('message', { user: 'server', text: `${user.name} saiu da sala.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});


// servidor ouve na porta 5000
server.listen(process.env.PORT || 5000, () => console.log(`server online.`));