// node server which will handel socket io connections
const io = require("socket.io")(process.env.PORT || 8000);

const users = {};

io.on("connection", socket =>{
    // If a new user joins, let other users know
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to others
    socket.on("send", message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // Inform all, if someone leaves the chat
    socket.on('disconnect', message =>{
        socket.broadcast.emit("left", users[socket.id]);
        delete users[socket.id];
    });
});
