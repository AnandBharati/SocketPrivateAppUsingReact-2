const express = require('express')
const http = require('http')
const cors = require('cors')
const Socket = require('socket.io')

const PORT = process.env.PORT || 5000

//creating app and passing middlewares
const app = express();
app.use(cors());

//creating httpserver
const httpServer = http.createServer(app);

//passing httpserver to socket object
const io = new Socket.Server(httpServer, {
    cors: {
        origin: '*',
    }
})

/*************************************************** */
const AllUser = []; // [{username, id}]
const AllMessages = []; //[{content, to, from}]

//on connection establish
io.on('connection', (socket) => {
    console.log('a user is connected');

    //saving the new user and sending all list of available users
    AllUser.push({ 'username': socket.handshake.auth.username, 'id': socket.id });
    io.to(socket.id).emit('ownerData', AllUser[AllUser.length - 1]);

    io.emit('allUsers', AllUser);
    // io.on('allUsers', (dummy) => {
    //     io.emit('allUsers', AllUser);
    // });

    //on receiving message save message and emit to the concern user
    socket.on('send message', ({ content, fromUser, fromUserId, toUser, toUserId }) => {
        console.log({ content, fromUser, fromUserId, toUser, toUserId })
        AllMessages.push({ content, fromUser, fromUserId, toUser, toUserId });
        console.log('sending message to', toUserId)
        socket.to(toUserId).emit('send message',{ content, fromUser, fromUserId, toUser, toUserId })
    });

})




//to start server
httpServer.listen(PORT, () => {
    console.log('server started at port ', PORT)
});

app.get('/', (req, res) => {
    res.send('use get method')
})